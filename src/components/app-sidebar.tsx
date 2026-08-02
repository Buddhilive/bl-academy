"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { RecentChats } from "@/components/chat/recent-chats"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, Plus } from "lucide-react"
import Link from "next/link"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "[EMAIL_ADDRESS]",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "BuddhiAI",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Local AI OS",
    }
  ],
  navMain: [
    {
      title: "Knowledge",
      icon: (
        <BookOpenIcon className="size-4 shrink-0" />
      ),
      isActive: true,
      items: [
        { title: "Knowledge Base", url: "/knowledge-base" },
        { title: "Knowledge Viewer", url: "/knowledge-viewer" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="New Chat" render={<Link href="/chat" />}>
                <Plus className="size-4 shrink-0" />
                <span>New Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={data.navMain} />
        <RecentChats />
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
