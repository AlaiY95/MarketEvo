// app/api/user/trading-metrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserTradingMetrics } from "../../../lib/tradingMetrics";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const metrics = await getUserTradingMetrics(userId);

    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error("Error fetching trading metrics:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch trading metrics" }, { status: 500 });
  }
}
