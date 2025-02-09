import { ShoppingBag, Home, Inbox, User, Settings, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { signOut } from "next-auth/react";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Consultation",
    url: "/consultation",
    icon: Inbox,
  },
  {
    title: "Products",
    url: "/products",
    icon: ShoppingBag,
  },
  {
    title: "User",
    url: "/user",
    icon: User,
  },
  {
    title: "Review",
    url: "/review",
    icon: Settings,
  },
];

export function AppSidebar() {
  const handleLogout = async () => {
    // Clear the token from storage
    localStorage.removeItem("token"); // or sessionStorage.removeItem("token");

    // Call NextAuth.js signOut
    await signOut({ redirect: true, callbackUrl: "/login" });
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl mb-5">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <div>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="text-xl mb-4">
                        <item.icon style={{ width: "20px", height: "20px" }} />
                        <span className="ml-2">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => handleLogout()}>
                    <div className="text-xl mb-4 flex mt-4 items-center">
                      <LogOut style={{ width: "20px", height: "20px" }} />
                      <span className="ml-2">Logout</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
