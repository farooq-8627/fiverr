import * as React from "react";
import {
  motion,
  HTMLMotionProps,
  Variants,
  Transition,
  Easing,
} from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MenuItem {
  icon: LucideIcon | React.FC;
  label: string;
  href: string;
  gradient: string;
  iconColor: string;
}

interface MenuBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuItem[];
  activeItem?: string;
  onItemClick?: (label: string) => void;
}

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 1.5,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as Easing },
      scale: {
        duration: 0.5,
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
      },
    },
  },
};

const navGlowVariants: Variants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as Easing,
    },
  },
};

const sharedTransition: Transition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

export const MenuBar = React.forwardRef<HTMLDivElement, MenuBarProps>(
  ({ className, items, activeItem, onItemClick, ...props }, ref) => {
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";

    return (
      <motion.nav
        ref={ref}
        className={cn(
          "p-2 bg-gradient-to-b from-background/90 to-background/60 backdrop-blur-lg  shadow-lg relative overflow-hidden h-full",
          className
        )}
        initial="initial"
        whileHover="hover"
        {...(props as HTMLMotionProps<"nav">)}
      >
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-background/30 to-transparent rounded-3xl z-0 pointer-events-none`}
          variants={navGlowVariants}
        />
        <ul className="flex items-center justify-between gap-4 sm:gap-8 relative z-10 whitespace-nowrap">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;

            return (
              <motion.li key={item.label} className="relative flex-1">
                <button
                  onClick={() => onItemClick?.(item.label)}
                  className="block w-full"
                >
                  <motion.div
                    className="block rounded-xl overflow-visible group relative"
                    style={{ perspective: "600px" }}
                    whileHover="hover"
                    initial="initial"
                  >
                    <motion.div
                      className="absolute inset-0 z-0 pointer-events-none"
                      variants={glowVariants}
                      animate={isActive ? "hover" : "initial"}
                      style={{
                        background: `linear-gradient(to ${index === 0 ? "right" : "left"}, ${item.gradient})`,
                        opacity: isActive ? 1 : 0,
                        borderRadius: "16px",
                      }}
                    />
                    <motion.div
                      className={cn(
                        "flex items-center justify-center gap-2 px-3 sm:px-4 py-3 relative z-10 bg-transparent transition-colors rounded-xl",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                      variants={itemVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center bottom",
                      }}
                    >
                      <span
                        className={cn(
                          "transition-colors duration-300",
                          isActive ? item.iconColor : "text-foreground",
                          `group-hover:${item.iconColor}`
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm sm:text-base">{item.label}</span>
                    </motion.div>
                    <motion.div
                      className={cn(
                        "flex items-center justify-center gap-2 px-3 sm:px-4 py-3 absolute inset-0 z-10 bg-transparent transition-colors rounded-xl",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                      variants={backVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center top",
                        rotateX: 90,
                      }}
                    >
                      <span
                        className={cn(
                          "transition-colors duration-300",
                          isActive ? item.iconColor : "text-foreground",
                          `group-hover:${item.iconColor}`
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm sm:text-base">{item.label}</span>
                    </motion.div>
                  </motion.div>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </motion.nav>
    );
  }
);

MenuBar.displayName = "MenuBar";
