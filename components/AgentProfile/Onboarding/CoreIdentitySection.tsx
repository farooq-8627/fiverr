import React, { useState } from "react";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Switch } from "@/components/UI/switch";
import { Textarea } from "@/components/UI/textarea";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { ImageUpload } from "@/components/Forms/ImageUpload";
import { FormSectionLayout } from "@/components/Forms/FormSectionLayout";
import { RightContentLayout } from "@/components/Forms/RightContentLayout";

interface CoreIdentitySectionProps {
  onNext: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1.0],
    },
  },
};

const companyDetailsVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1.0],
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const teamSizes = [
  { value: "solo", label: "Solo" },
  { value: "2-5", label: "2-5 Members" },
  { value: "6-15", label: "6-15 Members" },
  { value: "16-50", label: "16-50 Members" },
  { value: "50+", label: "50+ Members" },
];

export function CoreIdentitySection({
  onNext,
  onPrev,
  onSkip,
}: CoreIdentitySectionProps) {
  const [name, setName] = useState("");
  const [hasCompany, setHasCompany] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    teamSize: "",
    bio: "",
    website: "",
    logo: null as File | null,
    banner: null as File | null,
  });

  const rightContent = (
    <RightContentLayout
      title="Establish Your Identity"
      subtitle="Create a strong professional presence that resonates with potential clients."
      features={[
        {
          icon: "fa-building",
          title: "Company Profile",
          description: "Create a company profile to showcase your organization",
        },
        {
          icon: "fa-id-badge",
          title: "Professional Role",
          description: "Define your role and position within your organization",
        },
        {
          icon: "fa-users",
          title: "Team Structure",
          description: "Share your team size and organizational capabilities",
        },
      ]}
      currentStep={1}
      totalSteps={6}
    />
  );

  return (
    <FormSectionLayout
      title="Core Identity"
      description="Tell us about yourself and your business"
      onNext={onNext}
      onPrev={onPrev}
      onSkip={onSkip}
      rightContent={rightContent}
    >
      <motion.div
        className="space-y-4 max-h-[calc(85vh-12rem)] overflow-y-auto px-0.5 py-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-4">
          <motion.div variants={itemVariants}>
            <Input
              placeholder="What's your full name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </motion.div>

          <motion.div
            className="flex items-center justify-between py-1"
            variants={itemVariants}
          >
            <motion.div>
              <motion.p className="text-sm font-medium text-white">
                Do you have a company?
              </motion.p>
              <motion.p className="text-xs text-white/60">
                Create a company profile to showcase your business
              </motion.p>
            </motion.div>
            <Switch checked={hasCompany} onCheckedChange={setHasCompany} />
          </motion.div>

          <AnimatePresence>
            {hasCompany && (
              <motion.div
                className="space-y-4"
                variants={companyDetailsVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.div variants={itemVariants}>
                  <Input
                    placeholder="Your company name"
                    value={companyDetails.name}
                    onChange={(e) =>
                      setCompanyDetails({
                        ...companyDetails,
                        name: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Select
                    value={companyDetails.teamSize}
                    onValueChange={(value) =>
                      setCompanyDetails({ ...companyDetails, teamSize: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="How big is your team?" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Textarea
                    placeholder="Tell us about your company's mission and expertise..."
                    value={companyDetails.bio}
                    onChange={(e) =>
                      setCompanyDetails({
                        ...companyDetails,
                        bio: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[60px] max-h-[120px] resize-none"
                  />
                </motion.div>

                <motion.div className="relative" variants={itemVariants}>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="fas fa-globe text-white/40 text-sm" />
                  </div>
                  <Input
                    type="url"
                    placeholder="Company website URL"
                    value={companyDetails.website}
                    onChange={(e) =>
                      setCompanyDetails({
                        ...companyDetails,
                        website: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10"
                  />
                </motion.div>

                {/* Profile Images */}
                <motion.div className="space-y-4" variants={itemVariants}>
                  <motion.div
                    className="flex items-center justify-between"
                    variants={itemVariants}
                  >
                    <ImageUpload
                      type="profile"
                      image={companyDetails.logo}
                      onImageChange={(file) =>
                        setCompanyDetails({ ...companyDetails, logo: file })
                      }
                      className="flex-shrink-0"
                    />
                    <div className="flex-grow pl-6">
                      <h3 className="text-white font-medium mb-1">
                        Company Logo
                      </h3>
                      <p className="text-white/60 text-sm">
                        Add a logo to help others recognize your company
                      </p>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <ImageUpload
                      type="banner"
                      image={companyDetails.banner}
                      onImageChange={(file) =>
                        setCompanyDetails({ ...companyDetails, banner: file })
                      }
                      className="w-full"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </FormSectionLayout>
  );
}
