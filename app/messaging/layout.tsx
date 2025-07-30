import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ModeToggle } from "@/components/mesaging/mode-toggle";
import ChatSupport from "@/components/mesaging/chat/chat-support";

export const metadata: Metadata = {
  title: "Agentor Chat",
  description: "Chat/message components for Agentor",
};

export default async function MessagingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const layout = (await cookies()).get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center justify-center p-4 md:px-24 py-12 gap-4">
      {/* <div className="flex justify-between max-w-full w-full items-center"></div> */}

      <div className="z-10 border rounded-lg max-w-full w-full h-full text-sm flex">
        {/* Page content */}
        {children}
      </div>

      {/* Chat support component */}
      <ChatSupport />
    </main>
  );
}
