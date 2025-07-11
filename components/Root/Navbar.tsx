"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Bell, Home, Users, UserSquare2, Newspaper } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

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

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Agents",
    href: "/agents",
    icon: UserSquare2,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    title: "Feed",
    href: "/feed",
    icon: Newspaper,
  },
];

export function Navbar() {
  const { isSignedIn, user } = useUser();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="w-full border-b border-border/40 bg-background/60 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="w-full" />
        </div>
      </header>
    );
  }

  return (
    <header className="w-full border-b border-border/40 bg-background/60 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile Menu */}
        <Popover>
          <PopoverTrigger className="mr-2 px-0 text-base hover:bg-accent/50 rounded-md focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
            <Menu className="h-5 w-5" />
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2 mt-4 ml-2 bg-background/80 backdrop-blur-xl backdrop-saturate-150 border-border/40">
            <nav className="grid gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group grid grid-cols-[auto_1fr] gap-3 rounded-lg p-2 text-sm hover:bg-accent/50 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <div className="font-medium leading-none">{item.title}</div>
                  </Link>
                );
              })}
            </nav>
          </PopoverContent>
        </Popover>

        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">LOGO</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/50 focus:bg-accent/50 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Notifications */}
          <button className="hover:bg-accent/50 transition-colors h-9 w-9 rounded-md p-2">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </button>

          {/* Auth */}
          {isSignedIn ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-8 w-8",
                },
              }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="text-sm font-medium hover:bg-accent/50 px-3 py-2 rounded-md transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-primary/80 backdrop-blur-sm text-primary-foreground hover:bg-primary/70 rounded-md px-3 py-2 text-sm font-medium transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
