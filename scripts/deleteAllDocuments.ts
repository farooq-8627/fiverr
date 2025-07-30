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

async function deleteAllDocuments() {
  try {
    // Fetch all documents
    const query = `*[!(_type match "system.*") && !(_type match "sanity.*")]._id`;
    const documentIds = await client.fetch(query);

    if (documentIds.length === 0) {
      console.log("No documents found to delete.");
      return;
    }

    console.log(`Found ${documentIds.length} documents to delete.`);

    // Delete documents in batches of 50
    const batchSize = 50;
    const batches = Math.ceil(documentIds.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = start + batchSize;
      const batch = documentIds.slice(start, end);

      // Create a transaction for the batch
      const transaction = client.transaction();

      batch.forEach((id: string) => {
        transaction.delete(id);
      });

      // Commit the transaction
      await transaction.commit();
      console.log(
        `Deleted batch ${i + 1}/${batches} (${batch.length} documents)`
      );
    }

    console.log("Successfully deleted all documents.");
  } catch (error) {
    console.error("Error deleting documents:", error);
  }
}

// Run the deletion
deleteAllDocuments();
