"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Home,
  Users,
  UserSquare2,
  Newspaper,
  User,
} from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useSession,
  useUser,
} from "@clerk/nextjs";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/UI/navigation-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/UI/popover";

import { useState, useEffect } from "react";
import { MenuBar } from "@/components/UI/glow-menu";
import { useUserProfiles } from "@/hooks/useUserProfiles";

const SignedInItems = [
  {
    icon: Home,
    label: "Home",
    href: "/",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: UserSquare2,
    label: "Agents",
    href: "/agents",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: Users,
    label: "Clients",
    href: "/clients",
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-green-500",
  },
  {
    icon: Newspaper,
    label: "Feed",
    href: "/feed",
    gradient:
      "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
    iconColor: "text-red-500",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: Bell,
    label: "Dashboard",
    href: "/dashboard",
    gradient:
      "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
];

export function Navbar() {
  const [activeItem, setActiveItem] = useState<string>("Home");
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Handle navigation with username for dashboard
  const handleItemClick = (label: string) => {
    if (!label) return;

    setActiveItem(label);

    // Find the item by label
    const item = SignedInItems.find((i) => i.label === label);
    if (!item?.href) return;

    if (item.href === "/dashboard" && user) {
      const username =
        user.username || user.primaryEmailAddress?.emailAddress.split("@")[0];
      if (username) {
        router.push(`/dashboard/${username}`);
        return;
      }
    }

    router.push(item.href);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <MenuBar
        items={SignedInItems}
        activeItem={activeItem}
        onItemClick={handleItemClick}
      />

      <div className="flex items-center gap-4 pr-4">
        {isSignedIn ? (
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-white hover:text-white/80">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-white/90">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        )}
      </div>
    </div>
  );
}
