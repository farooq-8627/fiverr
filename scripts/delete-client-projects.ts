import { createClient } from "@sanity/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID! || "g4uvgkfn",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET! || "production",
  token:
    process.env.SANITY_STUDIO_TOKEN! ||
    "skxFpBkoWhmZEmMM8655OlMiFZzY3ZdzwsR26IEWGf6AxtENBOaalidL07pNLw9ReMO3lOFGQp7wFpqsGuCSy5Z417iOlG5HsYQSWopF6baQnjIrsEPXhoa03cLl45iyBTBjJ2KEf7yzKDdw8WXsP1LAb28OjVUnqOwPTFwMVQ0R9fq65IgM",
  apiVersion: "2024-03-20",
  useCdn: false,
});

async function deleteAllClientProjects() {
  try {
    console.log("=== Starting Client Project Deletion Process ===\n");

    // 1. First get all client profiles that have project references
    const clientProfilesQuery = `*[_type == "clientProfile"]{
      _id,
      "projects": projects[]._ref
    }`;
    const clientProfiles = await client.fetch(clientProfilesQuery);
    console.log(
      `Found ${clientProfiles.length} client profiles with project references\n`
    );

    // 2. Remove project references from client profiles
    for (const profile of clientProfiles) {
      if (profile.projects && profile.projects.length > 0) {
        try {
          await client.patch(profile._id).set({ projects: [] }).commit();
          console.log(
            `✓ Cleared project references from client profile: ${profile._id}`
          );
        } catch (error: any) {
          console.error(
            `✗ Failed to clear references from profile ${profile._id}:`,
            error.message
          );
        }
      }
    }

    // 3. Now get and delete all client projects
    const projectsQuery = `*[_type == "clientProject"]{
      _id,
      title
    }`;
    const projects = await client.fetch(projectsQuery);
    console.log(`\nFound ${projects.length} client projects to delete\n`);

    let deletedCount = 0;
    let errors = [];

    // 4. Delete each project
    for (const project of projects) {
      try {
        console.log(`Processing project: ${project._id} (${project.title})`);

        // Delete both draft and published versions
        const draftId = `drafts.${project._id}`;
        try {
          await client.delete(draftId);
          console.log(`  ✓ Deleted draft version: ${draftId}`);
        } catch (error) {
          // Ignore errors for drafts as they might not exist
        }

        // Delete the published version
        await client.delete(project._id);
        deletedCount++;
        console.log(`  ✓ Deleted published version: ${project._id}\n`);
      } catch (error: any) {
        console.error(
          `✗ Failed to delete project ${project._id}:`,
          error.message
        );
        errors.push({
          type: "project",
          id: project._id,
          error: error.message,
        });
      }
    }

    // 5. Print summary
    console.log("\n=== Deletion Summary ===");
    console.log(`Successfully deleted projects: ${deletedCount}`);
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
deleteAllClientProjects()
  .then(() => {
    console.log("\nScript completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nScript failed:", error);
    process.exit(1);
  });
