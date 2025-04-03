"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define form data type
interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here (e.g., API call)
    console.log("Login Data:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Login to Exam Form Portal
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-blue-600">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password" className="text-blue-600">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Login
          </Button>
        </form>

        {/* Signup Link */}
        <p className="mt-4 text-center text-sm text-blue-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-800 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
