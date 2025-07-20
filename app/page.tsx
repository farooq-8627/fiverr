"use client";
import { Navbar } from "@/components/Root/Navbar";
import LandingSparkles from "@/components/Root/LandingSparkles";
import { SplineSceneBasic } from "@/components/LandingComponents/SplineScene";
import { AgentProfileExample } from "@/components/LandingComponents/AgentProfileExample";
import { ClientCardExample } from "@/components/LandingComponents/ClientCardExample";
import PostCardExample from "@/components/LandingComponents/PostCard";
import { Button } from "@/components/UI/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const userId = "harry_01";
  return (
    <main className="relative">
      {/* <SplineSceneBasic />
      <AgentProfileExample />
      <ClientCardExample /> */}

      <Button onClick={() => router.push("/dashboard/" + userId)}>
        Dashboard
      </Button>
      <Button
        variant="outline"
        onClick={() => router.push("/agent-profile/" + userId)}
      >
        Agent Profile
      </Button>
      <Button variant="ghost" onClick={() => router.push("/clientprojects")}>
        Client Profile
      </Button>
      <Button variant="link" onClick={() => router.push("/post/" + userId)}>
        Post
      </Button>
      <Button variant="destructive">Click me</Button>
      <PostCardExample />
    </main>
  );
}
