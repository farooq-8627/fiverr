import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Script from "next/script";
import localFont from "next/font/local";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Root/Navbar";
import { Toaster } from "@/components/UI/toaster";
import { PostProvider } from "@/lib/context/PostContext";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Fiverr",
  description: "Fiverr - Freelance Services Marketplace",
};

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const inter = Inter({ subsets: ["latin"] });

/**
 * This object can be customized to change Clerk's built-in appearance. To learn more: https://clerk.com/docs/customization/overview
 */
const clerkAppearanceObject = {
  variables: { colorPrimary: "#000000" },
  elements: {
    socialButtonsBlockButton:
      "bg-white border-gray-200 hover:bg-transparent hover:border-black text-gray-600 hover:text-black",
    socialButtonsBlockButtonText: "font-semibold",
    formButtonReset:
      "bg-white border border-solid border-gray-200 hover:bg-transparent hover:border-black text-gray-500 hover:text-black",
    membersPageInviteButton:
      "bg-black border border-black border-solid hover:bg-white hover:text-black",
    card: "bg-[#fafafa]",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={clerkAppearanceObject}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} ${geistSans.variable} ${geistMono.variable} min-h-screen bg-black text-white relative overflow-x-hidden`}
          suppressHydrationWarning
        >
          {/* Premium Dark Background with Violet Theme */}
          <div className="fixed inset-0 z-0">
            {/* Base dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

            {/* Violet accent gradients */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/30 via-transparent to-violet-900/20"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-violet-950/10 to-purple-950/20"></div>

            {/* Animated gradient orbs for premium effect */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/8 rounded-full blur-3xl animate-pulse delay-500"></div>

            {/* Subtle dot pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            ></div>

            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "100px 100px",
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <PostProvider>
              <Navbar />
              {children}
              <Toaster />
            </PostProvider>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
