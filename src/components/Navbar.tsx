"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

// Redux imports
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import { RootState } from "@/redux/store";

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
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux se auth state le liya
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    // Redux se logout maar diya
    dispatch(logout());
    setIsOpen(false);
    setTimeout(() => {
      router.push("/login");
    }, 100);
  };

  // TypeScript ko bata diya bhai ki role safe hai
  const links = navLinks[role as "candidate" | "admin"];

  return (
    <nav className="bg-blue-600 text-white shadow-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Home text as logo */}
        <Link href="/" className="text-xl font-bold">
          Home
        </Link>

        <div className="hidden md:flex space-x-6">
          {role !== "candidate" && // Hide candidate options if role is candidate
            links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-gray-200 transition-colors"
              >
                {link.name}
              </Link>
            ))}
        </div>

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

          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-blue-700 py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            {role !== "candidate" && // Hide candidate options in mobile view as well
              links.map((link) => (
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
