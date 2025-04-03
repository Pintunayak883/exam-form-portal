"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User } from "lucide-react";

// Define types for navLinks
interface NavLink {
  name: string;
  href: string;
}

// Define props type for Navbar
interface NavbarProps {
  userRole?: "candidate" | "admin"; // userRole can only be "candidate" or "admin"
}

// Define navLinks structure with TypeScript
const navLinks: Record<"candidate" | "admin", NavLink[]> = {
  candidate: [
    { name: "Home", href: "/" },
    { name: "Apply", href: "/apply" },
    { name: "My Submissions", href: "/submissions" },
  ],
  admin: [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Create Form", href: "/admin/create-form" },
    { name: "User List", href: "/admin/users" },
  ],
};

export default function Navbar({ userRole = "candidate" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <nav className="bg-blue-600 text-white shadow-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <span className="text-xl font-bold">Exam Form Portal</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {navLinks[userRole].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-gray-200 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* User Profile Dropdown */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-blue-700">
                <User className="mr-2 h-5 w-5" />
                <span>User</span> {/* Replace with actual user name */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/logout">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            {navLinks[userRole].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="py-2 hover:text-gray-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
