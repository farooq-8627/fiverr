"use client";

import { userData } from "@/components/mesaging/data";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "../sidebar";
import { Chat } from "./chat";
import { Button } from "@/components/mesaging/ui/button";
import { Menu } from "lucide-react";

interface ChatLayoutProps {
  defaultLayout?: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps) {
  const [selectedUser, setSelectedUser] = React.useState(userData[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.getElementById("mobile-sidebar");
        const button = document.getElementById("sidebar-toggle");

        if (
          sidebar &&
          !sidebar.contains(event.target as Node) &&
          button &&
          !button.contains(event.target as Node)
        ) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  return (
    <div className="flex h-full w-full relative">
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <Button
          id="sidebar-toggle"
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar for Desktop/Tablet */}
      {!isMobile && (
        <div className="w-80 border-r bg-background/50 backdrop-blur-sm">
          <Sidebar
            isCollapsed={false}
            chats={userData.map((user) => ({
              name: user.name,
              messages: user.messages ?? [],
              avatar: user.avatar,
              variant: selectedUser.name === user.name ? "secondary" : "ghost",
            }))}
            isMobile={false}
            onChatSelect={(chat) => {
              const user = userData.find((u) => u.name === chat.name);
              if (user) setSelectedUser(user);
            }}
          />
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div
            id="mobile-sidebar"
            className={cn(
              "fixed left-0 top-0 h-full w-80 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <Sidebar
              isCollapsed={false}
              chats={userData.map((user) => ({
                name: user.name,
                messages: user.messages ?? [],
                avatar: user.avatar,
                variant:
                  selectedUser.name === user.name ? "secondary" : "ghost",
              }))}
              isMobile={true}
              onChatSelect={(chat) => {
                const user = userData.find((u) => u.name === chat.name);
                if (user) {
                  setSelectedUser(user);
                  setSidebarOpen(false); // Close sidebar after selection on mobile
                }
              }}
            />
          </div>
        </>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <Chat
          messages={selectedUser.messages}
          selectedUser={selectedUser}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}
