"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  Home,
  FilePlus,
  Users,
  ClipboardX,
  Bell,
  History,
  Download,
  MoreVertical,
  ChevronDown,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/authSlice";
import { useState } from "react";

export function AppSidebar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { name } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Toggle states for dropdowns
  const [openFormDropdown, setOpenFormDropdown] = useState(false);
  const [openUserDropdown, setOpenUserDropdown] = useState(false);

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-bold px-2">Admin Panel</h2>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            {/* Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/dashboard">
                  <Home size={20} />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Create Form Dropdown */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setOpenFormDropdown(!openFormDropdown)}
              >
                <FilePlus size={20} />
                <span>Form</span>
                <ChevronDown
                  size={16}
                  className={`ml-auto transition-transform ${
                    openFormDropdown ? "rotate-180" : ""
                  }`}
                />
              </SidebarMenuButton>
              {openFormDropdown && (
                <div className="ml-8 mt-1 text-sm flex flex-col gap-1">
                  <Link href="/admin/create-form" className="hover:underline">
                    Create Form
                  </Link>
                  <Link href="/admin/my-forms" className="hover:underline">
                    My Forms
                  </Link>
                </div>
              )}
            </SidebarMenuItem>

            {/* Users Dropdown */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setOpenUserDropdown(!openUserDropdown)}
              >
                <Users size={20} />
                <span>Users</span>
                <ChevronDown
                  size={16}
                  className={`ml-auto transition-transform ${
                    openUserDropdown ? "rotate-180" : ""
                  }`}
                />
              </SidebarMenuButton>
              {openUserDropdown && (
                <div className="ml-8 mt-1 text-sm flex flex-col gap-1">
                  <Link href="/admin/user-list" className="hover:underline">
                    User List
                  </Link>
                  <Link
                    href="/admin/user-submissions"
                    className="hover:underline"
                  >
                    User Submissions
                  </Link>
                </div>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Actions Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/mark-mistakes">
                  <ClipboardX size={20} />
                  <span>Mark Mistakes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/notifications">
                  <Bell size={20} />
                  <span>Send Notifications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/history">
                  <History size={20} />
                  <span>User History</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/export">
                  <Download size={20} />
                  <span>Export Data</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter>
        <div className="flex items-center justify-between px-2 py-2 text-sm">
          <div
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/admin/profile")}
          >
            {name || "Admin"}
          </div>

          <Button variant="ghost" size="icon" className="p-1">
            <MoreVertical size={18} />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
