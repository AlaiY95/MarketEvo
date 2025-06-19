// app/api/analyze-chart/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { anthropic, getTradingPrompt } from "@/lib/claude";
import { checkUsagePermission, recordUsage } from "@/lib/UsageEnforcement";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    console.log("Starting chart analysis...");

    // Read test image
    const imagePath = path.join(process.cwd(), "public", "test-chart.png");

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json(
        {
          error: "Test chart not found. Please add test-chart.png to your public folder.",
        },
        { status: 404 }
      );
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    // Detect media type based on file extension
    const imageExtension = path.extname(imagePath).toLowerCase();
    const mediaType = imageExtension === ".jpg" || imageExtension === ".jpeg" ? "image/jpeg" : "image/png";

    console.log("Sending request to Claude...");

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: getTradingPrompt(), // Default general prompt
            },
          ],
        },
      ],
    });

    console.log("Received response from Claude");

    // Safely extract the analysis text
    const analysisText = response.content[0]?.text || "No analysis generated";

    return NextResponse.json({
      success: true,
      analysis: analysisText,
      timestamp: new Date().toISOString(),
      tradingStyle: "general",
      imageInfo: {
        size: imageBuffer.length,
        type: mediaType,
        extension: imageExtension,
      },
    });
  } catch (error: any) {
    console.error("Analysis error:", error);
    console.error("Full error object:", JSON.stringify(error, null, 2));

    // Handle specific Anthropic API errors
    if (error.status === 400 && error.error?.type === "invalid_request_error") {
      if (error.error?.message?.includes("credit")) {
        return NextResponse.json(
          {
            error: "Insufficient credits. Please add credits to your Anthropic account.",
          },
          { status: 402 }
        );
      }
      if (error.error?.message?.includes("image")) {
        return NextResponse.json(
          {
            error: "Could not process image. Please check image format and size.",
            details: error.error.message,
          },
          { status: 400 }
        );
      }
    }

    if (error.status === 429) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Handle overloaded errors
    if (error.status === 529) {
      return NextResponse.json(
        {
          error: "Claude's servers are temporarily overloaded. Please try again in a moment.",
          details: "This is a temporary issue that usually resolves quickly.",
        },
        { status: 529 }
      );
    }

    return NextResponse.json(
      {
        error: "Analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
        errorType: error.error?.type || "unknown",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("Starting chart analysis from uploaded image...");

    // 🚨 GET USER SESSION FIRST
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🛡️ USAGE ENFORCEMENT - Check permissions BEFORE processing
    console.log("Checking usage permissions...");
    const usageResult = await checkUsagePermission(session.user.email);

    if (!usageResult.allowed) {
      console.log("Usage limit exceeded:", usageResult.message);
      return NextResponse.json(
        {
          error: "Usage limit exceeded",
          code: "USAGE_LIMIT_EXCEEDED",
          details: {
            reason: usageResult.reason,
            message: usageResult.message,
            resetDate: usageResult.resetDate,
            remaining: usageResult.remaining || 0,
          },
        },
        { status: 429 }
      ); // 429 = Too Many Requests
    }

    console.log("✅ Usage check passed:", usageResult.message);

    const formData = await request.formData();
    const file = formData.get("image") as File;
    const tradingStyle = formData.get("tradingStyle") as string;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "File must be an image",
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "File size too large. Maximum 5MB allowed.",
        },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Determine media type from file type
    const mediaType = file.type.startsWith("image/") ? file.type : "image/png";

    console.log("📊 About to send request to Claude for analysis...");

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: getTradingPrompt(tradingStyle),
            },
          ],
        },
      ],
    });

    console.log("✅ Received response from Claude");

    // Safely extract the analysis text
    const analysisText = response.content[0]?.text || "No analysis generated";

    // Parse the analysis to extract structured data
    let parsedAnalysis;
    try {
      const cleanedText = analysisText.trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedAnalysis = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.log("Failed to parse analysis JSON, saving raw text");
      parsedAnalysis = null;
    }

    // SAVE ANALYSIS TO DATABASE
    console.log("💾 Saving analysis to database...");
    try {
      const savedAnalysis = await prisma.chartAnalysis.create({
        data: {
          userId: userId,
          imageName: file.name,
          imageSize: file.size,
          tradingStyle: tradingStyle || "general",
          pattern: parsedAnalysis?.pattern || null,
          confidence: parsedAnalysis?.confidence || null,
          timeframe: parsedAnalysis?.timeframe || null,
          trend: parsedAnalysis?.trend || null,
          entryPoint: parsedAnalysis?.entryPoint ? parseFloat(parsedAnalysis.entryPoint) : null,
          stopLoss: parsedAnalysis?.stopLoss ? parseFloat(parsedAnalysis.stopLoss) : null,
          target: parsedAnalysis?.target ? parseFloat(parsedAnalysis.target) : null,
          riskReward: parsedAnalysis?.riskReward || null,
          explanation: parsedAnalysis?.explanation || null,
          fullAnalysis: analysisText, // Save complete response
        },
      });

      console.log("✅ Analysis saved successfully with ID:", savedAnalysis.id);
    } catch (dbError) {
      console.error("❌ Failed to save analysis to database:", dbError);
      // Don't fail the whole request if database save fails
    }

    // 🛡️ RECORD USAGE - ONLY USE ONE SYSTEM TO PREVENT DOUBLE COUNTING
    console.log("📊 Recording usage (single increment only)...");
    try {
      // Get current usage before incrementing for logging
      const userBefore = await prisma.user.findUnique({
        where: { id: userId },
        select: { analysesUsed: true },
      });

      console.log(`📊 User ${userId} usage before increment: ${userBefore?.analysesUsed || 0}`);

      await recordUsage(userId);

      // Check usage after increment for verification
      const userAfter = await prisma.user.findUnique({
        where: { id: userId },
        select: { analysesUsed: true },
      });

      console.log(`📊 User ${userId} usage after increment: ${userAfter?.analysesUsed || 0}`);
      console.log("✅ Usage recorded successfully");
    } catch (usageError) {
      console.error("❌ Failed to record usage:", usageError);
      // Don't fail the whole request if usage recording fails
    }

    // Calculate remaining analyses for response
    const remainingAnalyses = usageResult.remaining ? Math.max(0, usageResult.remaining - 1) : null;

    return NextResponse.json({
      success: true,
      analysis: analysisText,
      timestamp: new Date().toISOString(),
      tradingStyle: tradingStyle || "general",
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      // 🛡️ Include usage info in response
      usage: {
        remaining: remainingAnalyses,
        reason: usageResult.reason,
        message: usageResult.message,
        isPremium: usageResult.reason === "premium",
      },
    });
  } catch (error: any) {
    console.error("❌ Analysis error:", error);

    // Handle specific Anthropic API errors
    if (error.status === 400 && error.error?.type === "invalid_request_error") {
      if (error.error?.message?.includes("credit")) {
        return NextResponse.json(
          {
            error: "Insufficient credits. Please add credits to your Anthropic account.",
          },
          { status: 402 }
        );
      }
      if (error.error?.message?.includes("image")) {
        return NextResponse.json(
          {
            error: "Could not process image. Please check image format and size.",
            details: error.error.message,
          },
          { status: 400 }
        );
      }
    }

    if (error.status === 429) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Handle overloaded errors
    if (error.status === 529) {
      return NextResponse.json(
        {
          error: "Claude's servers are temporarily overloaded. Please try again in a moment.",
          details: "This is a temporary issue that usually resolves quickly.",
        },
        { status: 529 }
      );
    }

    return NextResponse.json(
      {
        error: "Analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
        errorType: error.error?.type || "unknown",
      },
      { status: 500 }
    );
  }
}
