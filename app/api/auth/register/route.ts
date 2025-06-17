// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    console.log("=== REGISTER DEBUG ===");

    const body = await request.json();
    console.log("Request body:", body);

    const { email, password, name } = body;

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    console.log("Checking if user exists...");

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists");
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    console.log("Hashing password...");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("Creating user in database...");

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        lastResetDate: new Date().toDateString(),
      },
    });

    console.log("User created successfully:", user.email);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Failed to create user", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
