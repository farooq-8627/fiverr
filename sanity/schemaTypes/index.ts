import { SchemaTypeDefinition } from "sanity";
import { userSchema } from "./userSchema";
import { agentProfileSchema } from "./agentProfileSchema";
import { clientProfileSchema } from "./clientProfileSchema";
import { agentProjectSchema } from "./agentProjectSchema";
import { clientProjectSchema } from "./clientProjectSchema";
import { companySchema } from "./companySchema";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    userSchema,
    agentProfileSchema,
    clientProfileSchema,
    agentProjectSchema,
    clientProjectSchema,
    companySchema,
  ],
};
