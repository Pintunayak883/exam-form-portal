"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define form data type
interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add signup logic here (e.g., API call)
    console.log("Signup Data:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Sign Up for Exam Form Portal
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-blue-600">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

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

          {/* Confirm Password Field */}
          <div>
            <Label htmlFor="confirmPassword" className="text-blue-600">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="mt-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </Button>
        </form>

        {/* Login Link */}
        <p className="mt-4 text-center text-sm text-blue-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-800 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
