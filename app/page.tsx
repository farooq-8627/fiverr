import { Navbar } from "@/components/Root/Navbar";
import LandingSparkles from "@/components/Root/LandingSparkles";
import { SplineSceneBasic } from "@/components/LandingComponents/SplineScene";
import { AgentProfileExample } from "@/components/LandingComponents/AgentProfileExample";
import { ClientCardExample } from "@/components/LandingComponents/ClientCardExample";
import PostCardExample from "@/components/LandingComponents/PostCard";

export default function Home() {
  return (
    <main className="relative">
      {/* <SplineSceneBasic />
      <AgentProfileExample />
      <ClientCardExample /> */}
      <PostCardExample />
    </main>
  );
}
