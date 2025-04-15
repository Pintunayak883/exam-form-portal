"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
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

// Nav link types
interface NavLink {
  name: string;
  href: string;
}

// Role-based nav links
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<"candidate" | "admin">("candidate"); // Default

  // Fetch token and role from sessionStorage when the component mounts
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token") || "";
    const storedRole =
      (sessionStorage.getItem("role") as "admin" | "candidate") || "candidate";

    setIsAuthenticated(!!storedToken);
    setUserRole(storedRole);
  }, []);

  // Logout: Remove sessionStorage items
  const handleLogout = () => {
    // Remove sessionStorage items for token and role
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");

    setIsAuthenticated(false);
    setUserRole("candidate");

    // Redirect after clearing sessionStorage
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <span className="text-xl font-bold">Exam Form Portal</span>
        </Link>

        {/* Desktop nav links */}
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

        {/* Account Dropdown + Mobile Toggle */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-blue-700">
                <User className="mr-2 h-5 w-5" />
                <span>Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {isAuthenticated ? (
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>Guest</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav links */}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full text-left text-white hover:bg-blue-800"
                >
                  <User className="mr-2 h-5 w-5" />
                  <span>Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Guest</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        Register
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </nav>
  );
}
