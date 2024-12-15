import { Calendar, Home, Inbox, User, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/",
    icon: Calendar,
  },
  {
    title: "User",
    url: "/user",
    icon: User,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export  function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup >
          <SidebarGroupLabel className="text-2xl mb-5">Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu  >
              {items.map((item) => (
                <SidebarMenuItem key={item.title} >
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="text-xl mb-4">
                      <item.icon  style={{ width: '20px', height: '20px' }}/>
                      <span className="ml-2">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
