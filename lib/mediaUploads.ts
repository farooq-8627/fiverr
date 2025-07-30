import { backendClient } from "@/sanity/lib/backendClient";
import { handleAsyncImageUploads } from "./ImageUploads";

export async function uploadMediaToSanity(file: File) {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Always use 'file' type for upload to maintain consistency
    const assetType = "file";

    // Log file details for debugging
    console.log(
      `Uploading media: ${file.name}, size: ${file.size} bytes, type: ${file.type}`
    );

    // Upload to Sanity with retry logic
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const result = await backendClient.assets.upload(assetType, buffer, {
          filename: file.name,
          contentType: file.type,
        });

        console.log(
          `Successfully uploaded media: ${file.name}, id: ${result._id}`
        );

        // Return a structured response that matches your FeedMedia type
        return {
          _key: Math.random().toString(36).substr(2, 9),
          type: file.type.startsWith("image/")
            ? "image"
            : file.type.startsWith("video/")
              ? "video"
              : "pdf",
          file: {
            asset: {
              _ref: result._id,
              _type: "reference",
            },
            url: result.url,
          },
          caption: file.name, // Using filename as default caption
          altText: file.name,
        };
      } catch (error) {
        attempts++;
        console.error(
          `Upload attempt ${attempts} failed for ${file.name}:`,
          error
        );

        if (attempts >= maxAttempts) {
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    console.error(`Failed to upload media ${file.name}:`, error);
    throw error;
  }
}

export async function handleMediaUploads(
  profileId: string,
  files: File[],
  path: string = "media"
) {
  const mediaArray = [];

  // Separate files by type
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));
  const otherFiles = files.filter((file) => !file.type.startsWith("image/"));

  // Handle image uploads
  if (imageFiles.length > 0) {
    const imageUploads = imageFiles.map((file) => ({
      type: "array",
      file,
      path,
      additionalData: {
        _key: Math.random().toString(36).substr(2, 9),
        alt: file.name,
      },
    }));

    await handleAsyncImageUploads(profileId, imageUploads);
  }

  // Handle videos and PDFs
  for (const file of otherFiles) {
    try {
      const result = await uploadMediaToSanity(file);
      if (result) {
        mediaArray.push(result);
      }
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
    }
  }

  return mediaArray;
}
