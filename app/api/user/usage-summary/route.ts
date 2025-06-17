// app/api/user/usage-summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserUsageSummary } from "@/lib/UsageEnforcement";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usage = await getUserUsageSummary(session.user.email);

    if (!usage) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ usage });
  } catch (error) {
    console.error("Error fetching usage summary:", error);
    return NextResponse.json({ error: "Failed to fetch usage summary" }, { status: 500 });
  }
}
