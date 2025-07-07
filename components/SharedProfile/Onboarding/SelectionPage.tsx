"use client";

import { User, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { RightContentLayout } from "../../Forms/RightContentLayout";
import { useRouter } from "next/navigation";

export function SelectionPage() {
  const router = useRouter();
  const containerVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.3 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="flex h-full">
      {/* Left Content */}
      <div className="flex-1 border-r border-white/[0.05] p-8 lg:p-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center space-y-2">
            <motion.h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Welcome to Agentor
            </motion.h1>
            <motion.p className="text-white/60">
              Choose your journey with us
            </motion.p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                router.push("/onboarding/client-profile");
              }}
              className="w-full group relative flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                <User size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-white">I'm a Client</h3>
                <p className="text-sm text-white/60">Looking to hire talent</p>
              </div>
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  className="w-6 h-6 text-white/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                router.push("/onboarding/agent-profile");
              }}
              className="w-full group relative flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                <Briefcase size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-white">I'm an Agent</h3>
                <p className="text-sm text-white/60">
                  Looking for opportunities
                </p>
              </div>
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  className="w-6 h-6 text-white/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.div>
            </motion.button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-sm text-center text-white/40"
          >
            Your choice will determine your profile type and experience
          </motion.p>
        </motion.div>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-8 lg:p-12">
        <RightContentLayout
          title="Join Our Growing Community"
          subtitle="Whether you're looking to hire top talent or showcase your skills, we've got you covered."
          features={[
            {
              icon: "fa-bolt",
              title: "Smart matching algorithm",
              description:
                "Our AI-powered matching system ensures you find the perfect fit for your needs",
            },
            {
              icon: "fa-headset",
              title: "Professional support",
              description:
                "Our dedicated support team is here to help you every step of the way",
            },
            {
              icon: "fa-globe",
              title: "Global opportunities",
              description:
                "Connect with professionals from around the world and expand your network",
            },
          ]}
        />
      </div>
    </div>
  );
}
