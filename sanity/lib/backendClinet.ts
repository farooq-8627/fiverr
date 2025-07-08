import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { apiVersion, dataset, projectId } from "../env";

// Get the token from environment variables
const sanityToken = process.env.SANITY_API_TOKEN;

// Log token availability (not the actual token for security)
if (!sanityToken) {
  console.warn("⚠️ SANITY_API_TOKEN is missing in environment variables");
} else {
  console.log("✅ SANITY_API_TOKEN is available");
}

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Always set to false for write operations
  token: sanityToken,
  // Enable more detailed error messages for debugging
  perspective: "published",
});

// Set up the image URL builder for getting image URLs from Sanity
const builder = imageUrlBuilder(backendClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
