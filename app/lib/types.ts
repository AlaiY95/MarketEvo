// app/lib/types.ts
export interface ChartAnalysis {
  pattern: string;
  confidence: "High" | "Medium" | "Low";
  timeframe?: string;
  trend: "Bullish" | "Bearish" | "Sideways";
  entryPoint?: number;
  stopLoss?: number;
  target?: number;
  riskReward?: string;
  explanation: string;
}

export interface UserUsage {
  analysesUsed: number;
  maxAnalyses: number;
  resetDate: string; // Daily reset
  isPremium: boolean;
}

export function parseAnalysis(rawText: string): ChartAnalysis | null {
  try {
    console.log("🔍 Attempting to parse analysis:", rawText.substring(0, 200) + "...");

    // Clean up the JSON text - fix common issues
    let cleanedText = rawText.trim();

    // Remove any markdown code blocks if present
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    }
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // Try to extract JSON from the response if it's wrapped in text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
      console.log("🔍 Extracted JSON from text:", cleanedText.substring(0, 100) + "...");
    }

    // Parse the JSON
    const parsed = JSON.parse(cleanedText);
    console.log("🔍 Raw parsed object:", parsed);

    // Normalize and convert values
    const normalizedAnalysis: ChartAnalysis = {
      pattern: String(parsed.pattern || parsed.Pattern || "Pattern Analysis"),
      confidence: validateConfidence(parsed.confidence || parsed.Confidence || "Medium"),
      timeframe: parsed.timeframe || parsed.Timeframe || undefined,
      trend: validateTrend(parsed.trend || parsed.Trend || "Sideways"),
      entryPoint: parseNumericValue(parsed.entryPoint || parsed.entryPrice || parsed.entry || parsed.Entry),
      stopLoss: parseNumericValue(parsed.stopLoss || parsed.stopPrice || parsed.stop || parsed.StopLoss),
      target: parseNumericValue(parsed.target || parsed.targetPrice || parsed.takeProfit || parsed.Target),
      riskReward: parsed.riskReward || parsed.riskRewardRatio || parsed.RiskReward || undefined,
      explanation: String(parsed.explanation || parsed.Explanation || parsed.analysis || rawText),
    };

    console.log("✅ Successfully parsed and normalized analysis:", normalizedAnalysis);
    return normalizedAnalysis;
  } catch (error) {
    console.error("❌ JSON parsing failed:", error);
    console.log("Raw text that failed:", rawText);

    // Enhanced fallback: try to extract key information using multiple patterns
    try {
      const fallbackAnalysis: ChartAnalysis = {
        pattern: extractValue(rawText, ["pattern", "Pattern"]) || "Pattern Analysis",
        confidence: validateConfidence(extractValue(rawText, ["confidence", "Confidence"]) || "Medium"),
        timeframe: extractValue(rawText, ["timeframe", "Timeframe"]),
        trend: validateTrend(extractValue(rawText, ["trend", "Trend"]) || "Sideways"),
        entryPoint: parseNumericValue(extractValue(rawText, ["entryPoint", "entryPrice", "entry", "Entry"])),
        stopLoss: parseNumericValue(extractValue(rawText, ["stopLoss", "stopPrice", "stop", "StopLoss"])),
        target: parseNumericValue(extractValue(rawText, ["target", "targetPrice", "takeProfit", "Target"])),
        riskReward: extractValue(rawText, ["riskReward", "riskRewardRatio", "RiskReward"]),
        explanation: extractValue(rawText, ["explanation", "Explanation", "analysis"]) || rawText,
      };

      console.log("🔄 Using enhanced fallback parsing:", fallbackAnalysis);
      return fallbackAnalysis;
    } catch (fallbackError) {
      console.error("❌ Enhanced fallback parsing also failed:", fallbackError);

      // Last resort: create a basic analysis with the raw text
      return {
        pattern: "Analysis Available",
        confidence: "Medium",
        trend: "Sideways",
        explanation: rawText,
      };
    }
  }
}

// Helper function to extract values from malformed JSON with multiple possible keys
function extractValue(text: string, keys: string[]): string | null {
  try {
    for (const key of keys) {
      // Try quoted string pattern
      const quotedRegex = new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`, "i");
      const quotedMatch = text.match(quotedRegex);
      if (quotedMatch && quotedMatch[1]) {
        return quotedMatch[1];
      }

      // Try unquoted number/value pattern
      const unquotedRegex = new RegExp(`"${key}"\\s*:\\s*([^,}\\s]+)`, "i");
      const unquotedMatch = text.match(unquotedRegex);
      if (unquotedMatch && unquotedMatch[1]) {
        return unquotedMatch[1].replace(/[,}].*$/, "").trim();
      }

      // Try key-value pair pattern (for non-JSON text)
      const keyValueRegex = new RegExp(`${key}\\s*[:|=]\\s*([^\\n\\r,]+)`, "i");
      const keyValueMatch = text.match(keyValueRegex);
      if (keyValueMatch && keyValueMatch[1]) {
        return keyValueMatch[1].trim();
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Helper function to parse numeric values safely
function parseNumericValue(value: any): number | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  // If already a number
  if (typeof value === "number") {
    return isNaN(value) ? undefined : value;
  }

  // If string, try to parse
  if (typeof value === "string") {
    // Remove currency symbols and whitespace
    const cleaned = value.replace(/[$,\s]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}

// Helper function to validate confidence values
function validateConfidence(confidence: any): "High" | "Medium" | "Low" {
  if (typeof confidence !== "string") return "Medium";

  const lower = confidence.toLowerCase();
  if (lower.includes("high")) return "High";
  if (lower.includes("low")) return "Low";
  return "Medium";
}

// Helper function to validate trend values
function validateTrend(trend: any): "Bullish" | "Bearish" | "Sideways" {
  if (typeof trend !== "string") return "Sideways";

  const lower = trend.toLowerCase();
  if (lower.includes("bull") || lower.includes("up")) return "Bullish";
  if (lower.includes("bear") || lower.includes("down")) return "Bearish";
  return "Sideways";
}
