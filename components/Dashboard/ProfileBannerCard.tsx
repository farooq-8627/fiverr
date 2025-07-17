import {
  ArrowUpRight,
  Edit,
  MapPin,
  Pencil,
  ShieldCheck,
  Globe,
  Mail,
  UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../UI/avatar";
import { GlassCard } from "../UI/GlassCard";
import { socialPlatforms } from "@/lib/social-platforms";
import {
  processSocialLinks,
  SanityUserSocialLink,
  SocialLinkIcon,
} from "@/lib/social-media-helper";
import { Button } from "../UI/button";
import { useState } from "react";
import { ProfileEditModal } from "./Edit/ProfileEditModal";

interface ProfileBannerCardProps {
  bannerImage: string;
  profilePicture: string;
  fullName: string;
  username: string;
  website: string;
  bio: string;
  tagline: string;
  location?: { cityState: string; country: string };
  socialLinks?: SanityUserSocialLink[];
  extraDetails?: Record<string, any>;
  onSave?: (data: any) => void;
  isCurrentUser?: boolean;
}

export const ProfileBannerCard = ({
  bannerImage: initialBannerImage,
  profilePicture: initialProfilePicture,
  fullName: initialFullName,
  username,
  website: initialWebsite,
  tagline: initialTagline,
  bio: initialBio,
  location: initialLocation,
  socialLinks: initialSocialLinks,
  extraDetails = {},
  onSave,
  isCurrentUser,
}: ProfileBannerCardProps) => {
  // State for UI updates
  const [bannerImage, setBannerImage] = useState(initialBannerImage);
  const [profilePicture, setProfilePicture] = useState(initialProfilePicture);
  const [fullName, setFullName] = useState(initialFullName);
  const [website, setWebsite] = useState(initialWebsite);
  const [tagline, setTagline] = useState(initialTagline);
  const [bio, setBio] = useState(initialBio);
  const [location, setLocation] = useState(initialLocation);
  const [socialLinks, setSocialLinks] = useState(initialSocialLinks);

  const processedLinks = processSocialLinks(socialLinks);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveProfile = (data: any) => {
    // Update local state
    setBannerImage(data.bannerImage);
    setProfilePicture(data.profileImage);
    setFullName(data.fullName);
    setWebsite(data.website);
    setTagline(data.tagline);
    setBio(data.bio);
    setLocation(data.location);
    setSocialLinks(data.socialLinks);

    // Call parent onSave if provided
    if (onSave) {
      onSave(data);
    }
    handleCloseEditModal();
  };

  return (
    <GlassCard className="relative overflow-hidden" padding="p-0">
      {/* Banner */}
      <div className="h-40 md:h-48 relative group">
        <div className="absolute inset-0 z-10" />
        {bannerImage ? (
          <img
            src={bannerImage}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient-x" />
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <Button
            className="bg-black/40 hover:bg-black/60 text-white border-none p-2 h-9 w-9 rounded-full backdrop-blur-sm transition-all hover:scale-105"
            onClick={() => {
              /* Share Profile */
            }}
          >
            <Globe className="h-4 w-4" />
          </Button>
          <Button
            className="bg-black/40 hover:bg-black/60 text-white border-none p-2 h-9 w-9 rounded-full backdrop-blur-sm transition-all hover:scale-105"
            onClick={() => {
              /* Message */
            }}
          >
            <Mail className="h-4 w-4" />
          </Button>
          {isCurrentUser && (
            <Button
              className="bg-black/40 hover:bg-black/60 text-white border-none p-2 h-9 w-9 rounded-full backdrop-blur-sm transition-all hover:scale-105"
              onClick={handleOpenEditModal}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 md:px-12 pb-8">
        <div className="flex flex-col items-start">
          {/* Profile Picture */}
          <div className="relative -mt-16 md:-mt-20 group">
            <Avatar className="w-28 h-28 md:w-32 md:h-32 border-2 border-black/50">
              <AvatarImage src={profilePicture} className="object-cover" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500">
                {fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Info */}
          <div className="mt-4 space-y-2 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  {fullName}
                </h1>
                <ShieldCheck className="h-6 w-6 text-blue-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-base md:text-lg text-gray-300 font-medium">
                {tagline}
              </p>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="text-sm md:text-base">@{username}</span>
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm md:text-base">Portfolio</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            {location && (
              <div className="flex items-center gap-2 text-gray-300 text-sm md:text-base">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{location.cityState}</span>
                <span>•</span>
                <span>{location.country}</span>
              </div>
            )}

            <div className="h-2" />

            {/* Social Links */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {processedLinks.map((link, index) => (
                  <SocialLinkIcon
                    key={index}
                    platform={link.platform}
                    url={link.url}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveProfile}
          initialData={{
            bannerImage: bannerImage || "",
            profileImage: profilePicture || "",
            fullName,
            tagline,
            website,
            location: location || { cityState: "", country: "" },
            bio: bio || "",
            socialLinks:
              processedLinks.map(({ platform, url }) => ({
                platform: platform.id,
                url,
              })) || [],
            ...extraDetails,
          }}
          isCurrentUser={isCurrentUser ?? false}
        />
      )}
    </GlassCard>
  );
};
