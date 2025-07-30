import React from "react";
import { motion } from "framer-motion";

export interface RightContentLayoutProps {
  title: string;
  subtitle: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  currentStep?: number;
  totalSteps?: number;
}

export function RightContentLayout({
  title,
  subtitle,
  features,
  currentStep,
  totalSteps,
}: RightContentLayoutProps) {
  const showProgress =
    typeof currentStep === "number" &&
    typeof totalSteps === "number" &&
    totalSteps > 0;

  // Calculate progress based on completed steps (currentStep - 1)
  const completedSteps = showProgress ? Math.max(0, currentStep! - 1) : 0;
  const progress = showProgress ? (completedSteps / totalSteps!) * 100 : 0;

  const getMotivationalMessage = (step: number, total: number) => {
    switch (step) {
      case 1:
        return "Welcome! Let's get started with your profile.";
      case 2:
        return "Great start! Your profile is taking shape.";
      case 3:
        return "You're doing great! Keep going.";
      case 4:
        return "Excellent progress! More than halfway there.";
      case 5:
        return "Looking good! Almost there.";
      case 6:
        return "Amazing! Just one more step to go.";
      case 7:
        return "You're at the final step! Let's wrap this up.";
      default:
        return "Keep going! You're doing great.";
    }
  };

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Progress Section - Always at Top */}
      {showProgress && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-2"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-between text-sm text-white/70"
          >
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </motion.div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <motion.div className="flex flex-col gap-2">
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-white/50"
            >
              Step {currentStep} of {totalSteps}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-sm font-medium text-purple-400"
            >
              {getMotivationalMessage(currentStep!, totalSteps!)}
            </motion.p>
          </motion.div>
        </motion.div>
      )}

      {/* Content Section - Centered */}
      <motion.div className="flex-1 flex flex-col justify-center mt-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm text-white/60 max-w-md mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex items-start gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <div className="h-9 w-9 rounded-lg bg-purple-500/10 p-2 mt-1 flex items-center justify-center">
                <i className={`fas ${feature.icon} text-purple-400 text-sm`} />
              </div>
              <div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
