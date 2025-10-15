"use client"

import * as React from "react"
import {
  Bell,
  BookOpen,
  Bot,
  Calendar,
  Command,
  FileText,
  Frame,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  Map,
  MessageSquare,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "./theme-toggle"

const data = {
  user: {
    name: "admin",
    email: "",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Newsletters", url: "/admin/newsletters", icon: FileText },
    { title: "Subjects", url: "/admin/subjects", icon: BookOpen },
    { title: "Student Corner", url: "/admin/student-corner", icon: Bell },
    { title: "Events", url: "/admin/events", icon: Calendar },
    { title: "Faculty", url: "/admin/faculty", icon: Users },
    { title: "Feedback", url: "/admin/feedback", icon: MessageSquare },
    { title: "Contact", url: "/admin/contact", icon: LifeBuoy },
  ],
}

export function AppSidebar({
  name,
  email,
  ...props
}: React.ComponentProps<typeof Sidebar> & { name: string; email: string }) {
  const user = {
    ...data.user,
    name,
    email,
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">RCTI</span>
                  <span className="truncate text-xs">Computer Department</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
