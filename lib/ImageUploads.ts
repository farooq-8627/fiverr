import { backendClient } from "@/sanity/lib/backendClient";

// Helper function to upload an image to Sanity's asset store
export async function uploadImageToSanity(file: File) {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Log file details for debugging
    console.log(
      `Uploading image: ${file.name}, size: ${file.size} bytes, type: ${file.type}`
    );

    // Upload to Sanity with retry logic
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const result = await backendClient.assets.upload("image", buffer, {
          filename: file.name,
          contentType: file.type,
        });

        console.log(
          `Successfully uploaded image: ${file.name}, id: ${result._id}`
        );
        return result;
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
    console.error(`Failed to upload image ${file.name}:`, error);
    throw error;
  }
}

// Async function to handle image uploads with retries
export async function handleAsyncImageUploads(
  profileId: string,
  files: {
    type: string;
    file: File;
    path: string;
    additionalData?: any;
    documentId?: string;
  }[]
) {
  for (const { type, file, path, additionalData, documentId } of files) {
    if (!file || file.size === 0) continue;

    // Add retry logic for image uploads
    let retries = 0;
    const maxRetries = 3;
    let success = false;

    while (!success && retries < maxRetries) {
      try {
        console.log(
          `Uploading image ${file.name} (attempt ${retries + 1}/${maxRetries})...`
        );
        const imageAsset = await uploadImageToSanity(file);

        if (imageAsset) {
          // Create image reference
          const imageRef = {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset._id,
            },
          };

          // Determine which document to patch
          const targetDocId = documentId || profileId;
          console.log(
            `Updating document ${targetDocId} with image at path: ${path}`
          );

          // Patch the document with the new image
          if (type === "array") {
            // For array types, we need to get the current array and append to it
            try {
              // First get the current document to see what's already in the array
              const doc = await backendClient.getDocument(targetDocId);

              if (doc) {
                // Create a new array with existing items + new item
                const currentArray = doc[path] || [];

                // Check if this is a projectImage type (from additionalData._type)
                let newItem;
                if (additionalData && additionalData._type === "projectImage") {
                  // For projectImage type, we need to structure it according to the schema
                  newItem = {
                    _type: "projectImage",
                    _key: additionalData._key,
                    alt: additionalData.alt || "Project image",
                    image: imageRef, // Nest the image reference inside the 'image' field
                  };
                } else {
                  // For regular images, just add the imageRef with additionalData
                  newItem = { ...imageRef, ...additionalData };
                }

                const updatedArray = [...currentArray, newItem];

                // Update with the new array
                await backendClient
                  .patch(targetDocId)
                  .set({ [path]: updatedArray })
                  .commit();
              } else {
                console.error(`Document not found for ID: ${targetDocId}`);
                throw new Error(`Document not found for ID: ${targetDocId}`);
              }
            } catch (error) {
              console.error(`Error updating array at path ${path}:`, error);
              throw error; // Rethrow to trigger retry
            }
          } else {
            // For simple object types
            await backendClient
              .patch(targetDocId)
              .set({ [path]: imageRef })
              .commit();
          }

          console.log(
            `Successfully added ${file.name} to document ${targetDocId} at path: ${path}`
          );
          success = true; // Mark as successful to exit retry loop
        } else {
          throw new Error("Image asset upload failed");
        }
      } catch (error) {
        retries++;
        console.error(
          `Attempt ${retries}/${maxRetries} failed for ${file.name}:`,
          error
        );

        if (retries >= maxRetries) {
          console.error(
            `Failed to upload and attach image ${file.name} after ${maxRetries} attempts:`,
            error
          );
        } else {
          // Wait before retrying (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, retries), 10000);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }
}

// Process project images asynchronously
export async function processProjectImagesAsync(
  profileId: string,
  projects: any[]
) {
  // For each project that's been created
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    if (
      !project._id ||
      !project.imageFiles ||
      project.imageFiles.length === 0
    ) {
      console.log(
        `Skipping project with no images or invalid ID: ${project.title}`
      );
      continue;
    }

    console.log(
      `Processing ${project.imageFiles.length} images for project: ${project.title} (${project._id})`
    );

    // Collect all images for this project
    const imagesToUpload = [];
    for (let j = 0; j < project.imageFiles.length; j++) {
      const imageFile = project.imageFiles[j];

      if (imageFile && imageFile.size > 0) {
        try {
          imagesToUpload.push({
            type: "array",
            file: imageFile,
            path: "images",
            documentId: project._id,
            additionalData: {
              _type: "projectImage", // Changed from "image" to "projectImage"
              _key: `image_${j}_${Date.now()}`,
              alt: project.title || "Project image",
            },
          });
        } catch (error) {
          console.error(
            `Error preparing image ${j} for project ${project._id}:`,
            error
          );
        }
      }
    }

    // Upload images for this project if there are any
    if (imagesToUpload.length > 0) {
      try {
        await handleAsyncImageUploads(project._id, imagesToUpload);
      } catch (error) {
        console.error(
          `Failed to process images for project ${project._id}:`,
          error
        );
      }
    }
  }
}
