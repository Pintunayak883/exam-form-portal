import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// GET method for admin to fetch all users
export async function GET() {
  try {
    await connectToDatabase(); // Database connection

    const users = await User.find(); // Sab users fetch karo

    return NextResponse.json(
      {
        success: true,
        users,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Admin user fetch failed",
      },
      { status: 500 }
    );
  }
}
