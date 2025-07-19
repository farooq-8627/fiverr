import { createClient } from "@sanity/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID! || "g4uvgkfn",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET! || "production",
  token:
    process.env.SANITY_STUDIO_TOKEN! ||
    "skxFpBkoWhmZEmMM8655OlMiFZzY3ZdzwsR26IEWGf6AxtENBOaalidL07pNLw9ReMO3lOFGQp7wFpqsGuCSy5Z417iOlG5HsYQSWopF6baQnjIrsEPXhoa03cLl45iyBTBjJ2KEf7yzKDdw8WXsP1LAb28OjVUnqOwPTFwMVQ0R9fq65IgM", // Make sure you have a token with write permissions
  apiVersion: "2024-03-20", // Use current date YYYY-MM-DD
  useCdn: false,
});

async function deleteAllClientProfiles() {
  try {
    console.log("=== Starting Client Profile Deletion Process ===\n");

    // 1. Query all client profiles
    const query = `*[_type == "clientProfile"]{ _id, userId, projects[] }`;
    const clientProfiles = await client.fetch(query);

    console.log(`Found ${clientProfiles.length} client profiles to delete\n`);

    let deletedProfiles = 0;
    let deletedProjects = 0;
    let errors = [];

    // 2. Process each profile
    for (const profile of clientProfiles) {
      try {
        console.log(`Processing profile: ${profile._id}`);

        // 2a. Delete associated projects first
        if (profile.projects && profile.projects.length > 0) {
          console.log(`- Found ${profile.projects.length} associated projects`);

          for (const project of profile.projects) {
            try {
              if (project._ref) {
                await client.delete(project._ref);
                deletedProjects++;
                console.log(`  ✓ Deleted project: ${project._ref}`);
              }
            } catch (projectError: any) {
              console.error(
                `  ✗ Failed to delete project ${project._ref}:`,
                projectError.message
              );
              errors.push({
                type: "project",
                id: project._ref,
                error: projectError.message,
              });
            }
          }
        }

        // 2b. Update user document to remove profile reference
        if (profile.userId?._ref) {
          try {
            const userDoc = await client.getDocument(profile.userId._ref);
            if (userDoc && userDoc.clientProfiles) {
              const updatedProfiles = userDoc.clientProfiles.filter(
                (p: any) => p._ref !== profile._id
              );

              await client
                .patch(profile.userId._ref)
                .set({ clientProfiles: updatedProfiles })
                .commit();

              console.log(`- Updated user document: ${profile.userId._ref}`);
            }
          } catch (userError: any) {
            console.error(
              `- Failed to update user document:`,
              userError.message
            );
            errors.push({
              type: "user",
              id: profile.userId._ref,
              error: userError.message,
            });
          }
        }

        // 2c. Delete the profile itself
        await client.delete(profile._id);
        deletedProfiles++;
        console.log(`✓ Deleted profile: ${profile._id}\n`);
      } catch (profileError: any) {
        console.error(
          `✗ Failed to process profile ${profile._id}:`,
          profileError.message
        );
        errors.push({
          type: "profile",
          id: profile._id,
          error: profileError.message,
        });
      }
    }

    // 3. Print summary
    console.log("\n=== Deletion Summary ===");
    console.log(`Total profiles processed: ${clientProfiles.length}`);
    console.log(`Successfully deleted profiles: ${deletedProfiles}`);
    console.log(`Successfully deleted projects: ${deletedProjects}`);
    console.log(`Errors encountered: ${errors.length}`);

    if (errors.length > 0) {
      console.log("\n=== Error Details ===");
      errors.forEach((error, index) => {
        console.log(`\n${index + 1}. ${error.type.toUpperCase()} ERROR:`);
        console.log(`   ID: ${error.id}`);
        console.log(`   Message: ${error.error}`);
      });
    }
  } catch (error: any) {
    console.error("\n=== FATAL ERROR ===");
    console.error("Script failed:", error.message);
  }
}

// Run the script
console.log("Starting deletion script...\n");
deleteAllClientProfiles()
  .then(() => {
    console.log("\nScript completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nScript failed:", error);
    process.exit(1);
  });
