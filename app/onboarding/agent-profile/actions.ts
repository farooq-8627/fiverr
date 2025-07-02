"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema matching your Sanity schema
const agentProfileSchema = z.object({
  title: z.string().min(1, "Professional title is required"),
  bio: z.string().min(50, "Bio must be at least 50 characters long"),
  skills: z
    .array(z.string())
    .min(1, "At least one skill is required")
    .max(10, "Maximum 10 skills allowed"),
  hourlyRate: z.string().min(1, "Hourly rate is required"),
  availability: z.string().min(1, "Availability status is required"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  timezone: z.string().min(1, "Timezone is required"),
  portfolio: z
    .array(
      z.object({
        title: z.string().min(1, "Project title is required"),
        description: z
          .string()
          .min(10, "Project description must be at least 10 characters"),
        url: z.string().url("Invalid URL").optional(),
      })
    )
    .optional(),
});

interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export async function createAgentProfile(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Extract form data
    const rawData = {
      title: formData.get("title") as string,
      bio: formData.get("bio") as string,
      skills: formData.getAll("skills") as string[],
      hourlyRate: formData.get("hourlyRate") as string,
      availability: formData.get("availability") as string,
      languages: formData.getAll("languages") as string[],
      timezone: formData.get("timezone") as string,
      portfolio: parsePortfolioData(formData),
    };

    // Validate the data
    const validatedData = agentProfileSchema.parse(rawData);

    // Simulate API delay (remove in production)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you would typically:
    // 1. Create the agent profile in your Sanity CMS
    // 2. Handle any additional business logic
    // 3. Send confirmation emails, etc.

    console.log("Agent Profile Data:", {
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Example: Save to Sanity (you'll need to implement this)
    // const client = getSanityClient();
    // await client.create({
    //   _type: 'agentProfile',
    //   user: { _type: 'reference', _ref: userId }, // You'll need the user ID
    //   title: validatedData.title,
    //   bio: validatedData.bio,
    //   skills: validatedData.skills,
    //   hourlyRate: validatedData.hourlyRate,
    //   availability: validatedData.availability,
    //   languages: validatedData.languages,
    //   timezone: validatedData.timezone,
    //   portfolio: validatedData.portfolio,
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // });

    // Revalidate any cached data
    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return {
      success: true,
      message: "Agent profile saved successfully! 🎉",
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
    console.error("Error saving agent profile:", error);
    return {
      success: false,
      message: "An error occurred while saving your profile. Please try again.",
    };
  }
}

// Additional server action for updating profile
export async function updateAgentProfile(
  profileId: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const rawData = {
      title: formData.get("title") as string,
      bio: formData.get("bio") as string,
      skills: formData.getAll("skills") as string[],
      hourlyRate: formData.get("hourlyRate") as string,
      availability: formData.get("availability") as string,
      languages: formData.getAll("languages") as string[],
      timezone: formData.get("timezone") as string,
      portfolio: parsePortfolioData(formData),
    };

    const validatedData = agentProfileSchema.parse(rawData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Example: Update in Sanity
    // const client = getSanityClient();
    // await client.patch(profileId).set({
    //   ...validatedData,
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

    console.error("Error updating agent profile:", error);
    return {
      success: false,
      message:
        "An error occurred while updating your profile. Please try again.",
    };
  }
}

// Helper function to parse portfolio data from FormData
function parsePortfolioData(formData: FormData) {
  const portfolioItems = [];
  let index = 0;

  while (formData.has(`portfolio[${index}].title`)) {
    portfolioItems.push({
      title: formData.get(`portfolio[${index}].title`) as string,
      description: formData.get(`portfolio[${index}].description`) as string,
      url: formData.get(`portfolio[${index}].url`) as string,
    });
    index++;
  }

  return portfolioItems.length > 0 ? portfolioItems : undefined;
}
