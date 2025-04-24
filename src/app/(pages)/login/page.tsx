"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";
import Link from "next/link";
import ClipLoader from "react-spinners/ClipLoader"; // humbly imported spinner
import { Eye, EyeOff } from "lucide-react"; // humbly imported for password toggle

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (response.status === 200) {
        // Token and user data ko cookies me store karo for production-friendly access
        Cookies.set("token", data.token, {
          expires: 7,
          path: "/",
          secure: process.env.NODE_ENV === "production", // secure flag only in production
          sameSite: "Strict",
        });

        Cookies.set(
          "authData",
          JSON.stringify({
            email: data.email,
            name: data.name,
            role: data.role,
          }),
          {
            expires: 7,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
          }
        );

        // Redux ko update karo
        dispatch(
          loginSuccess({
            email: data.email,
            name: data.name,
            role: data.role,
          })
        );

        // Await router.push to ensure full transition
        if (data.role === "admin") {
          await router.push("/admin/dashboard");
        } else if (data.role === "candidate") {
          await router.push("/apply");
        } else {
          await router.push("/");
        }
      } else {
        console.log(data.message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // Redux restore logic on mount (helpful on page reloads or refreshes)
  useEffect(() => {
    const token = Cookies.get("token");
    const authData = Cookies.get("authData");

    if (token && authData) {
      try {
        const parsed = JSON.parse(authData);
        dispatch(loginSuccess(parsed));
      } catch (err) {
        console.error("Invalid authData cookie");
      }
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700">
      <div
        className="bg-white/90 p-6 rounded-xl shadow-2xl w-full max-w-md"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #e6f0fa 100%)",
        }}
      >
        <h1 className="text-4xl font-bold text-blue-700 mb-5 text-center">
          Login to Exam Form Portal
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <p className="text-red-600 text-center font-semibold">
              {errorMessage}
            </p>
          )}

          <div>
            <Label htmlFor="email" className="text-blue-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-2 border-blue-400 focus:border-blue-600 focus:ring-blue-600"
              required
            />
          </div>

          <div className="relative">
            <Label htmlFor="password" className="text-blue-700 font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-2 border-blue-400 focus:border-blue-600 focus:ring-blue-600 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-blue-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-700 text-white hover:bg-blue-800 transition-all rounded-lg py-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex justify-center items-center space-x-2">
                <ClipLoader size={20} color="#ffffff" />
                <span>Logging in...</span>
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-blue-700 font-medium">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-900 hover:underline font-bold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
