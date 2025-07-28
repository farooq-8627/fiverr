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
  X,
} from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useSession,
  useUser,
} from "@clerk/nextjs";

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
    icon: User,
    label: "Dashboard",
    href: "/dashboard",
    gradient:
      "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Don't show navbar on onboarding pages
  const isOnboardingPage = pathname?.startsWith("/onboarding");
  if (isOnboardingPage) {
    return null;
  }

  // Determine active item based on current pathname
  const getActiveItem = () => {
    if (!pathname) return "Home";

    // Check for exact matches first
    for (const item of SignedInItems) {
      if (item.href === pathname) {
        return item.label;
      }
    }

    // Check for dashboard pages (including username paths)
    if (pathname.startsWith("/dashboard")) {
      return "Dashboard";
    }

    // Check for partial matches
    if (pathname.startsWith("/agents")) return "Agents";
    if (pathname.startsWith("/clients")) return "Clients";
    if (pathname.startsWith("/feed")) return "Feed";
    if (pathname.startsWith("/notifications")) return "Notifications";

    // Default to Home
    return "Home";
  };

  const activeItem = getActiveItem();

  // Handle navigation with username for dashboard
  const handleItemClick = (label: string) => {
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
    const item = SignedInItems.find((i) => i.label === label);
    if (!item) return;

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        const target = event.target as Element;
        if (!target.closest(".mobile-menu-container")) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo/Brand */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent"
              >
                Agentor
              </Link>
            </div>

            {/* Center - Navigation Items (Desktop) */}
            <div className="hidden lg:flex flex-1 justify-center">
              <MenuBar
                items={SignedInItems}
                activeItem={activeItem}
                onItemClick={handleItemClick}
              />
            </div>

            {/* Right - Auth Buttons */}
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <>
                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </button>

                  {/* Desktop User Button */}
                  <div className="hidden lg:block">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8",
                        },
                      }}
                    />
                  </div>

                  {/* Mobile User Button */}
                  <div className="lg:hidden">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8",
                        },
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 text-sm text-white hover:text-gray-300 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-lg transition-colors">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Mobile Menu Box */}
          <div className="mobile-menu-container fixed top-20 left-4 right-4 bg-black/90 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
            <div className="p-6">
              {/* Mobile Navigation Items */}
              <div className="space-y-4">
                {SignedInItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.label;

                  return (
                    <button
                      key={item.label}
                      onClick={() => handleItemClick(item.label)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-white/10 border border-white/20"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${item.iconColor}`} />
                      <span className="text-white font-medium">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Auth Section */}
              {!isSignedIn && (
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="space-y-3">
                    <SignInButton mode="modal">
                      <button className="w-full p-3 text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="w-full p-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />
    </>
  );
}
