"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Menu,
  Home,
  Users,
  UserSquare2,
  Newspaper,
  User,
  X,
  Building2,
} from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

import { useState, useEffect } from "react";

const navigationItems = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
  {
    icon: UserSquare2,
    label: "Agents",
    href: "/agents",
  },
  {
    icon: Users,
    label: "Clients",
    href: "/clients",
  },
  {
    icon: Building2,
    label: "Companies",
    href: "/companies",
  },
  {
    icon: Newspaper,
    label: "Feed",
    href: "/feed",
  },
  {
    icon: User,
    label: "Dashboard",
    href: "/dashboard",
  },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Don't show navbar on onboarding pages
  const isOnboardingPage = pathname?.startsWith("/onboarding");
  const isUserDetailsPage = pathname?.startsWith("/user-details");
  const isMessagingPage = pathname?.startsWith("/messaging");

  // Determine active item based on current pathname
  const isActiveItem = (href: string, label: string) => {
    if (!pathname) return false;

    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    if (label === "Dashboard" && pathname.startsWith("/dashboard")) return true;

    return false;
  };

  // Handle navigation with username for dashboard
  const handleNavigation = (href: string, label: string) => {
    setIsMobileMenuOpen(false);

    if (href === "/dashboard" && user) {
      const username =
        user.username || user.primaryEmailAddress?.emailAddress.split("@")[0];
      if (!username) {
        router.push("/sign-in");
        return;
      }
      if (username) {
        router.push(`/dashboard/${username}`);
        return;
      }
    }
    router.push(href);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        const target = event.target as Element;
        if (!target.closest(".mobile-menu")) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  if (isOnboardingPage || isUserDetailsPage || isMessagingPage) {
    return null;
  }

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-white">
                Agentor
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveItem(item.href, item.label);

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.href, item.label)}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "text-violet-400 bg-violet-500/10"
                        : "text-gray-300 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right side - Auth */}
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <>
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </button>

                  {/* User button */}
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                        userButtonPopoverCard: "bg-gray-900 border-gray-700",
                        userButtonPopoverActionButton:
                          "text-gray-200 hover:text-white",
                      },
                    }}
                  />
                </>
              ) : (
                <>
                  {/* Mobile menu button for non-signed in users */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </button>

                  {/* Desktop auth buttons */}
                  <div className="hidden md:flex items-center space-x-3">
                    <SignInButton mode="modal">
                      <button className="px-4 py-2 text-sm text-gray-300 hover:text-white">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded-lg">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="mobile-menu fixed top-16 left-0 right-0 bg-gray-900 border-b border-gray-800">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Items */}
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveItem(item.href, item.label);

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.href, item.label)}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                      isActive
                        ? "text-violet-400 bg-violet-500/10"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Auth Buttons */}
              {!isSignedIn && (
                <div className="pt-4 border-t border-gray-800 space-y-3">
                  <SignInButton mode="modal">
                    <button className="w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg text-left">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-left">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
