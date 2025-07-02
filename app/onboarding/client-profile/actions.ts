"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema matching your Sanity schema
const clientProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Please select an industry"),
  budget: z.string().min(1, "Please select a budget range"),
  projectTypes: z
    .array(z.string())
    .min(1, "Please select at least one project type"),
  description: z
    .string()
    .min(10, "Please provide a description of at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  timezone: z.string().min(1, "Timezone is required"),
  preferredMethod: z.string().min(1, "Please select a communication method"),
  availability: z.string().min(1, "Please select your availability"),
});

interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export async function submitClientProfile(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Extract form data
    const rawData = {
      companyName: formData.get("companyName") as string,
      industry: formData.get("industry") as string,
      budget: formData.get("budget") as string,
      projectTypes: formData.getAll("projectTypes") as string[],
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      timezone: formData.get("timezone") as string,
      preferredMethod: formData.get("preferredMethod") as string,
      availability: formData.get("availability") as string,
    };

    // Validate the data
    const validatedData = clientProfileSchema.parse(rawData);

    // Simulate API delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you would typically:
    // 1. Create the client profile in your Sanity CMS
    // 2. Handle any additional business logic
    // 3. Send confirmation emails, etc.

    console.log("Client Profile Data:", {
      ...validatedData,
      communicationPreferences: {
        preferredMethod: validatedData.preferredMethod,
        availability: validatedData.availability,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Example: Save to Sanity (you'll need to implement this)
    // const client = getSanityClient();
    // await client.create({
    //   _type: 'clientProfile',
    //   user: { _type: 'reference', _ref: userId }, // You'll need the user ID
    //   companyName: validatedData.companyName,
    //   industry: validatedData.industry,
    //   budget: validatedData.budget,
    //   projectTypes: validatedData.projectTypes,
    //   description: validatedData.description,
    //   location: validatedData.location,
    //   timezone: validatedData.timezone,
    //   communicationPreferences: {
    //     preferredMethod: validatedData.preferredMethod,
    //     availability: validatedData.availability,
    //   },
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // });

    // Revalidate any cached data
    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return {
      success: true,
      message: "Client profile saved successfully! 🎉",
    };
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path[0]] = err.message;
        }
      });

      return {
        success: false,
        message: "Please fix the errors below",
        errors,
      };
    }

    // Handle other errors
    console.error("Error saving client profile:", error);
    return {
      success: false,
      message: "An error occurred while saving your profile. Please try again.",
    };
  }
}

// Additional server action for updating profile
export async function updateClientProfile(
  profileId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const rawData = {
      companyName: formData.get("companyName") as string,
      industry: formData.get("industry") as string,
      budget: formData.get("budget") as string,
      projectTypes: formData.getAll("projectTypes") as string[],
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      timezone: formData.get("timezone") as string,
      preferredMethod: formData.get("preferredMethod") as string,
      availability: formData.get("availability") as string,
    };

    const validatedData = clientProfileSchema.parse(rawData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Example: Update in Sanity
    // const client = getSanityClient();
    // await client.patch(profileId).set({
    //   ...validatedData,
    //   communicationPreferences: {
    //     preferredMethod: validatedData.preferredMethod,
    //     availability: validatedData.availability,
    //   },
    //   updatedAt: new Date().toISOString(),
    // }).commit();

    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return {
      success: true,
      message: "Profile updated successfully! ✅",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path[0]] = err.message;
        }
      });

      return {
        success: false,
        message: "Please fix the errors below",
        errors,
      };
    }

    console.error("Error updating client profile:", error);
    return {
      success: false,
      message:
        "An error occurred while updating your profile. Please try again.",
    };
  }
}
