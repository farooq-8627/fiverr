import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "g4uvgkfn",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token:
    process.env.SANITY_API_TOKEN ||
    "skxFpBkoWhmZEmMM8655OlMiFZzY3ZdzwsR26IEWGf6AxtENBOaalidL07pNLw9ReMO3lOFGQp7wFpqsGuCSy5Z417iOlG5HsYQSWopF6baQnjIrsEPXhoa03cLl45iyBTBjJ2KEf7yzKDdw8WXsP1LAb28OjVUnqOwPTFwMVQ0R9fq65IgM", // Using SANITY_API_TOKEN instead of SANITY_WRITE_TOKEN
  apiVersion: "2023-05-03",
  useCdn: false,
});

const generateProfileId = (doc: any): string => {
  const timestamp = new Date().getTime();
  const name = doc.coreIdentity?.fullName || doc._type;
  return `${name}-${timestamp}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

async function migrateProfiles() {
  try {
    // Fetch all agent profiles without profileId
    const agentProfiles = await client.fetch(`
      *[_type == "agentProfile" && !defined(profileId)] {
        _id,
        _type,
        coreIdentity
      }
    `);

    // Fetch all client profiles without profileId
    const clientProfiles = await client.fetch(`
      *[_type == "clientProfile" && !defined(profileId)] {
        _id,
        _type,
        coreIdentity
      }
    `);

    console.log(`Found ${agentProfiles.length} agent profiles to migrate`);
    console.log(`Found ${clientProfiles.length} client profiles to migrate`);

    // Migrate agent profiles
    for (const profile of agentProfiles) {
      const profileId = generateProfileId(profile);
      console.log(
        `Migrating agent profile ${profile._id} with new profileId: ${profileId}`
      );

      await client
        .patch(profile._id)
        .set({
          profileId: {
            _type: "slug",
            current: profileId,
          },
        })
        .commit();
    }

    // Migrate client profiles
    for (const profile of clientProfiles) {
      const profileId = generateProfileId(profile);
      console.log(
        `Migrating client profile ${profile._id} with new profileId: ${profileId}`
      );

      await client
        .patch(profile._id)
        .set({
          profileId: {
            _type: "slug",
            current: profileId,
          },
        })
        .commit();
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Run the migration
migrateProfiles();
