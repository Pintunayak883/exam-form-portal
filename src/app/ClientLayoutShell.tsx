"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppSidebar } from "@/components/AdminScreen/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ClientLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Ye admin routes ke liye check hai
  const isAdminRoute = pathname.startsWith("/admin");

  // Ye preview route ke liye check hai
  const isPreviewRoute = pathname === "/apply/preview";

  // Jab admin aur preview dono nahi honge, tabhi navbar aur footer dikhana
  const showNavbarFooter = !isAdminRoute && !isPreviewRoute;

  return (
    <div className="">
      {/* Sidebar only for admin routes */}
      {isAdminRoute && (
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      )}

      {/* Navbar only if not admin or preview route */}
      {showNavbarFooter && <Navbar />}

      <main>{children}</main>

      {/* Footer only if not admin or preview route */}
      {showNavbarFooter && <Footer />}
    </div>
  );
}
