import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Always set to false for write operations
  //  revalidation
  token: process.env.SANITY_API_TOKEN,
});
