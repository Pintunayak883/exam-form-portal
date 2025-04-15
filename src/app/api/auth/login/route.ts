// src/app/api/login/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import User, { IUser } from "@/models/User";

interface ResponseData {
  message: string;
  token?: string;
  error?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { email, password }: LoginData = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user by email
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Validate password
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token: string = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Send token in response (client-side will handle storage in sessionStorage)
    return NextResponse.json(
      {
        message: "Login successful",
        token: token,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
