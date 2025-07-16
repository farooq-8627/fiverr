import { SocialPlatform, socialPlatforms } from "./social-platforms";

export interface SanityUserSocialLink {
  platform: string;
  url: string;
}

export function SocialIcon({
  platform,
  className = "w-6 h-6",
}: {
  platform: SocialPlatform | undefined;
  className?: string;
}) {
  if (!platform) return null;

  const Icon = platform.icon;
  return <Icon className={className} />;
}

interface ProcessedSocialLink {
  platform: SocialPlatform;
  url: string;
}

export function processSocialLinks(
  socialLinks?: SanityUserSocialLink[]
): ProcessedSocialLink[] {
  // Return empty array if socialLinks is undefined or null
  if (!socialLinks || !Array.isArray(socialLinks)) {
    return [];
  }

  return socialLinks
    .map((link) => {
      // Find the matching platform configuration
      const platform = socialPlatforms.find(
        (p) => p.id.toLowerCase() === link.platform.toLowerCase()
      );

      if (!platform) return null;

      // Ensure the URL is properly formatted
      let formattedUrl = link.url;

      // If the URL doesn't start with http/https and we have a urlPrefix, use it
      if (platform.urlPrefix && !link.url.startsWith("http")) {
        // Remove the urlPrefix from the URL if it's already there
        const username = link.url.replace(platform.urlPrefix, "");
        formattedUrl = `${platform.urlPrefix}${username}`;
      }

      // For platforms without urlPrefix (like Discord), use the URL as is
      return {
        platform,
        url: formattedUrl,
      };
    })
    .filter((link): link is ProcessedSocialLink => link !== null);
}

// Helper component to render a social link with icon
export function SocialLinkIcon({
  platform,
  url,
  className = "",
}: {
  platform: SocialPlatform;
  url: string;
  className?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={platform.name}
    >
      <div className="flex items-center gap-2">
        <SocialIcon
          platform={platform}
          className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors"
        />
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
          {platform.name}
        </span>
      </div>
    </a>
  );
}

// Example usage in a component:
/*
import { processSocialLinks, SocialLinkIcon } from '@/lib/social-media-helper';

function ProfileSocialLinks({ socialLinks }) {
  const processedLinks = processSocialLinks(socialLinks);

  return (
    <div className="flex gap-4">
      {processedLinks.map(({ platform, url }) => (
        <SocialLinkIcon
          key={platform.id}
          platform={platform}
          url={url}
          className="text-gray-400 hover:text-gray-100"
        />
      ))}
    </div>
  );
}
*/
