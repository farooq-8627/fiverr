import { useState } from "react";
import { Button } from "../../UI/button";
import { Input } from "../../UI/input";
import { Textarea } from "../../UI/textarea";
import { Label } from "../../UI/label";
import { SanityUserSocialLink } from "@/lib/social-media-helper";
import { socialPlatforms } from "@/lib/social-platforms";
import {
  Plus,
  Trash2,
  Upload,
  User,
  Tag,
  Globe,
  MapPin,
  Share2,
  MessageSquare,
  UserPlus,
  FileText,
} from "lucide-react";
import { GlassModal } from "../../UI/GlassModal";
import Image from "next/image";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../UI/select";
import { updateUserProfileDetails } from "@/app/user-details/actions";
import { useToast } from "@/hooks/useToast";

interface ExtendedSocialLink extends SanityUserSocialLink {
  platform: string;
  url: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void; // Updated to accept form data
  initialData: {
    fullName: string;
    tagline: string;
    website: string;
    location: {
      cityState: string;
      country: string;
    };
    bio: string;
    socialLinks?: ExtendedSocialLink[];
    profileImage?: string;
    bannerImage?: string;
  };
  isCurrentUser: boolean;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isCurrentUser,
}: ProfileEditModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [socialLinks, setSocialLinks] = useState<ExtendedSocialLink[]>(
    initialData.socialLinks || []
  );
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // If not current user, don't render the modal
  if (!isCurrentUser) {
    return null;
  }

  // Create refs for file inputs
  const profileImageRef = React.useRef<HTMLInputElement>(null);
  const bannerImageRef = React.useRef<HTMLInputElement>(null);

  const handleProfileImageClick = () => {
    profileImageRef.current?.click();
  };

  const handleBannerImageClick = () => {
    bannerImageRef.current?.click();
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setFormData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      setFormData((prev) => ({
        ...prev,
        bannerImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleAddSocialLink = (e: React.MouseEvent) => {
    e.preventDefault();
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsSubmitting(true);

      // Clean up location data to only include non-empty values
      const location = {
        cityState: formData.location?.cityState?.trim() || "",
        country: formData.location?.country?.trim() || "",
      };

      const result = await updateUserProfileDetails({
        ...formData,
        location:
          location.cityState || location.country ? location : formData.location,
        socialLinks,
        profileImage: profileImageFile || undefined,
        bannerImage: bannerImageFile || undefined,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        // Pass the complete updated data including new image URLs from result
        onSave?.({
          ...formData,
          socialLinks,
          profileImage: result.data?.profileImage || formData.profileImage,
          bannerImage: result.data?.bannerImage || formData.bannerImage,
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            {/* Profile Images Section */}
            <div className="relative">
              {/* Banner Image */}
              <div
                className="relative w-full h-32 bg-white/5 rounded-t-lg overflow-hidden cursor-pointer group"
                onClick={handleBannerImageClick}
              >
                {formData.bannerImage ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent z-10" />
                    <Image
                      src={formData.bannerImage}
                      alt="Banner"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <Upload className="h-8 w-8 text-white/40" />
                  </div>
                )}
                <input
                  ref={bannerImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageChange}
                  className="hidden"
                />
              </div>

              {/* Profile Image */}
              <div className="absolute -bottom-12 left-8">
                <div
                  className="relative w-24 h-24 rounded-full bg-white/5 overflow-hidden border-4 border-black cursor-pointer group"
                  onClick={handleProfileImageClick}
                >
                  {formData.profileImage ? (
                    <>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors z-10" />
                      <Image
                        src={formData.profileImage}
                        alt="Profile"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <Upload className="h-6 w-6 text-white/40" />
                    </div>
                  )}
                  <input
                    ref={profileImageRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Spacing for profile image overflow */}
            <div className="h-6" />

            {/* Basic Info Section */}
            <div className="space-y-4 p-6 border-t border-white/10">
              <h2 className="text-lg font-semibold text-violet-200 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-violet-400" />
                Personal Details
              </h2>

              <div className="space-y-4 bg-white/5 p-4 rounded-lg">
                <div className="grid grid-cols-[120px,1fr] items-center gap-4">
                  <Label className="flex items-center gap-2 text-violet-200 text-sm">
                    <User className="h-4 w-4 text-violet-400" />
                    Full Name
                  </Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white h-9 w-full"
                  />
                </div>

                <div className="grid grid-cols-[120px,1fr] items-center gap-4">
                  <Label className="flex items-center gap-2 text-violet-200 text-sm">
                    <Tag className="h-4 w-4 text-violet-400 " />
                    Tagline
                  </Label>
                  <Input
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white h-9 w-full"
                  />
                </div>

                <div className="grid grid-cols-[120px,1fr] items-center gap-4">
                  <Label className="flex items-center gap-2 text-violet-200 text-sm">
                    <Globe className="h-4 w-4 text-violet-400" />
                    Website
                  </Label>
                  <Input
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white h-9 w-full"
                  />
                </div>

                <div className="grid grid-cols-[120px,1fr] items-center gap-4">
                  <Label className="flex items-center gap-2 text-violet-200 text-sm">
                    <MapPin className="h-4 w-4 text-violet-400" />
                    City/State
                  </Label>
                  <Input
                    value={formData.location?.cityState || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          cityState: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. San Francisco, CA"
                    className="bg-white/5 border-white/10 text-white h-9 w-full"
                  />
                </div>

                <div className="grid grid-cols-[120px,1fr] items-center gap-4">
                  <Label className="flex items-center gap-2 text-violet-200 text-sm">
                    <Globe className="h-4 w-4 text-violet-400" />
                    Country
                  </Label>
                  <Input
                    value={formData.location?.country || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          country: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. United States"
                    className="bg-white/5 border-white/10 text-white h-9 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-4 p-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-violet-200 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-violet-400 " />
                  Social Links
                </h2>
                <Button
                  type="button"
                  onClick={handleAddSocialLink}
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 px-3 py-1 text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Link
                </Button>
              </div>

              <div className="space-y-3">
                {socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Select
                        value={link.platform}
                        onValueChange={(value) => {
                          const newLinks = [...socialLinks];
                          const platform = socialPlatforms.find(
                            (p) => p.id === value
                          );
                          newLinks[index] = {
                            ...newLinks[index],
                            platform: value,
                            url: platform?.urlPrefix || "",
                          };
                          setSocialLinks(newLinks);
                        }}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-9">
                          <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {socialPlatforms.map((platform) => (
                            <SelectItem key={platform.id} value={platform.id}>
                              {platform.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...socialLinks];
                          newLinks[index].url = e.target.value;
                          setSocialLinks(newLinks);
                        }}
                        placeholder={
                          socialPlatforms.find((p) => p.id === link.platform)
                            ?.placeholder || "URL"
                        }
                        className="bg-white/5 border-white/10 text-white h-9"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleRemoveSocialLink(index)}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10 p-2 h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="mt-auto p-4 border-t border-white/10 bg-black/20">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-violet-200 bg-transparent border-violet-700/50 hover:bg-violet-900/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </form>
    </GlassModal>
  );
}
