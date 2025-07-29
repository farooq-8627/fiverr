"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  Users,
  Type,
  FileText,
  Camera,
  Tag,
  Save,
  Loader2,
  Upload,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { Label } from "@/components/UI/label";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import { GlassModal } from "@/components/UI/GlassModal";
import { CompanyProfile } from "@/components/cards/CompanyCard";
import { updateCompanyDetails } from "@/app/user-details/actions";
import { INDUSTRY_DOMAINS, TEAM_SIZES } from "@/sanity/schemaTypes/constants";
import Image from "next/image";

interface CompanyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyProfile;
  onUpdate: (updatedCompany: CompanyProfile) => void;
}

interface CompanyFormData {
  name: string;
  tagline: string;
  bio: string;
  website: string;
  teamSize: string;
  industries: string[];
  customIndustries: string[];
  companyType: "agent" | "client";
}

export function CompanyEditModal({
  isOpen,
  onClose,
  company,
  onUpdate,
}: CompanyEditModalProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: company.name || "",
    tagline: company.tagline || "",
    bio: company.bio || "",
    website: company.website || "",
    teamSize: company.teamSize || "",
    industries: company.industries || [],
    customIndustries: company.customIndustries || [],
    companyType: company.companyType || "agent",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newCustomIndustry, setNewCustomIndustry] = useState("");

  // Reset form when company changes
  useEffect(() => {
    setFormData({
      name: company.name || "",
      tagline: company.tagline || "",
      bio: company.bio || "",
      website: company.website || "",
      teamSize: company.teamSize || "",
      industries: company.industries || [],
      customIndustries: company.customIndustries || [],
      companyType: company.companyType || "agent",
    });
    setLogoFile(null);
    setBannerFile(null);
    setLogoPreview(null);
    setBannerPreview(null);
    setErrors({});
    setNewCustomIndustry("");
  }, [company]);

  const handleInputChange = (field: keyof CompanyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === "logo") {
          setLogoFile(file);
          setLogoPreview(result);
        } else {
          setBannerFile(file);
          setBannerPreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIndustryToggle = (industry: string) => {
    setFormData((prev) => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter((i) => i !== industry)
        : [...prev.industries, industry],
    }));
  };

  const handleAddCustomIndustry = () => {
    if (
      newCustomIndustry.trim() &&
      !formData.customIndustries.includes(newCustomIndustry.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        customIndustries: [...prev.customIndustries, newCustomIndustry.trim()],
      }));
      setNewCustomIndustry("");
    }
  };

  const handleRemoveCustomIndustry = (industry: string) => {
    setFormData((prev) => ({
      ...prev,
      customIndustries: prev.customIndustries.filter((i) => i !== industry),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required";
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = "Please enter a valid website URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call the server action to update company
      const result = await updateCompanyDetails({
        companyId: company._id,
        name: formData.name,
        tagline: formData.tagline || undefined,
        bio: formData.bio || undefined,
        website: formData.website || undefined,
        teamSize: formData.teamSize || undefined,
        industries: formData.industries,
        customIndustries: formData.customIndustries,
        companyType: formData.companyType,
        logo: logoFile || undefined,
        banner: bannerFile || undefined,
      });

      if (result.success) {
        // Update the company data with the returned result
        if (result.data) {
          onUpdate({
            ...company,
            ...result.data,
            logo: logoPreview ? { asset: { url: logoPreview } } : company.logo,
            banner: bannerPreview
              ? { asset: { url: bannerPreview } }
              : company.banner,
          });
        }
        onClose();
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error("Error updating company:", error);
      setErrors({ submit: "Failed to update company. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Company"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-[75vh]">
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-6">
            {/* Error Display */}
            {errors.submit && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Images Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-violet-200 flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Company Images
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Logo Upload */}
                <div>
                  <Label className="text-violet-200">Company Logo</Label>
                  <div className="mt-2 relative">
                    <div className="w-full h-32 bg-white/5 border-2 border-dashed border-white/20 rounded-lg overflow-hidden relative">
                      {logoPreview || company.logo?.asset?.url ? (
                        <Image
                          src={logoPreview || company.logo?.asset?.url || ""}
                          alt="Company Logo"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Upload className="h-8 w-8 text-white/40" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "logo")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Banner Upload */}
                <div>
                  <Label className="text-violet-200">Company Banner</Label>
                  <div className="mt-2 relative">
                    <div className="w-full h-32 bg-white/5 border-2 border-dashed border-white/20 rounded-lg overflow-hidden relative">
                      {bannerPreview || company.banner?.asset?.url ? (
                        <Image
                          src={
                            bannerPreview || company.banner?.asset?.url || ""
                          }
                          alt="Company Banner"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Upload className="h-8 w-8 text-white/40" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "banner")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-violet-200 flex items-center gap-2">
                <Type className="h-5 w-5" />
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <Label htmlFor="name" className="text-violet-200">
                    Company Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1 bg-white/5 border-white/20 text-white"
                    placeholder="Enter company name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Company Type */}
                <div>
                  <Label className="text-violet-200">Company Type</Label>
                  <Select
                    value={formData.companyType}
                    onValueChange={(value: "agent" | "client") =>
                      handleInputChange("companyType", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">
                        Service Provider (Agent)
                      </SelectItem>
                      <SelectItem value="client">
                        Service Seeker (Client)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <Label htmlFor="tagline" className="text-violet-200">
                  Tagline
                </Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange("tagline", e.target.value)}
                  className="mt-1 bg-white/5 border-white/20 text-white"
                  placeholder="A short, catchy phrase that describes your company"
                />
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio" className="text-violet-200">
                  Company Description
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="mt-1 bg-white/5 border-white/20 text-white min-h-[100px]"
                  placeholder="Describe your company, what you do, and what makes you unique"
                />
              </div>
            </div>

            {/* Business Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-violet-200 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Website */}
                <div>
                  <Label htmlFor="website" className="text-violet-200">
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    className="mt-1 bg-white/5 border-white/20 text-white"
                    placeholder="https://yourcompany.com"
                  />
                  {errors.website && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.website}
                    </p>
                  )}
                </div>

                {/* Team Size */}
                <div>
                  <Label className="text-violet-200">Team Size</Label>
                  <Select
                    value={formData.teamSize}
                    onValueChange={(value) =>
                      handleInputChange("teamSize", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Industries */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-violet-200 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Industries
              </h3>

              {/* Industry Selection */}
              <div>
                <Label className="text-violet-200">Select Industries</Label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {INDUSTRY_DOMAINS.map((industry) => (
                    <div
                      key={industry.value}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.industries.includes(industry.value)
                          ? "bg-violet-500/20 border-violet-500"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                      onClick={() => handleIndustryToggle(industry.value)}
                    >
                      <span className="text-sm text-violet-100">
                        {industry.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Industries */}
              <div>
                <Label className="text-violet-200">Custom Industries</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={newCustomIndustry}
                    onChange={(e) => setNewCustomIndustry(e.target.value)}
                    className="flex-1 bg-white/5 border-white/20 text-white"
                    placeholder="Add custom industry"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomIndustry();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddCustomIndustry}
                    className="bg-violet-600 hover:bg-violet-700 p-2 "
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Display Custom Industries */}
                {formData.customIndustries.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.customIndustries.map((industry, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-violet-500/20 text-violet-200 hover:bg-violet-500/30"
                      >
                        {industry}
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleRemoveCustomIndustry(industry)}
                          className="ml-2 h-4 w-4 p-0 hover:bg-transparent text-violet-200"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-violet-800/30">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 text-violet-200 bg-transparent border-violet-700/50 hover:bg-violet-900/50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </GlassModal>
  );
}
