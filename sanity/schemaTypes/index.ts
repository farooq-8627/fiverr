import { SchemaTypeDefinition } from "sanity";
<<<<<<< HEAD
import {
  automationExpertiseSchema,
  agentBusinessDetailsSchema,
  automationNeedsSchema,
  agentAvailabilitySchema,
  agentPricingSchema,
  agentCommunicationPreferencesSchema,
  clientCommunicationPreferencesSchema,
  agentProfileSchema,
  clientProfileSchema,
} from "./profileSchema";

import {
  projectImageSchema,
  agentProjectSchema,
  clientProjectSchema,
} from "./projectSchema";

=======
import { userSchema } from "./userSchema";
import { agentProfileSchema } from "./agentProfileSchema";
import { clientProfileSchema } from "./clientProfileSchema";
import { agentProjectSchema } from "./agentProjectSchema";
import { clientProjectSchema } from "./clientProjectSchema";
>>>>>>> main
import { companySchema } from "./companySchema";
import { userSchema } from "./userSchema";
import userProfileDetails from "./userProfileDetails";

<<<<<<< HEAD
// Import the new social feed schemas
import {
  PostSchema,
  MediaSchema,
  CommentSchema,
  LikeSchema,
} from "./feedSchema";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Base types
    projectImageSchema,

    // Company schemas
    companySchema,

    // Project schemas
    agentProjectSchema,
    clientProjectSchema,

    // User schemas
    userSchema,
    userProfileDetails,

    // Social Feed schemas
    PostSchema,
    MediaSchema,
    CommentSchema,
    LikeSchema,

    // Component schemas

    // Agent-specific schemas
    automationExpertiseSchema,
    agentBusinessDetailsSchema,
    agentAvailabilitySchema,
    agentPricingSchema,
    agentCommunicationPreferencesSchema,
    agentProfileSchema,

    // Client-specific schemas
    automationNeedsSchema,
    clientCommunicationPreferencesSchema,
    clientProfileSchema,
  ],
};

export const schemaTypes = [
  automationExpertiseSchema,
  userSchema,
  userProfileDetails,
  agentBusinessDetailsSchema,
  automationNeedsSchema,
  agentAvailabilitySchema,
  agentPricingSchema,
  agentCommunicationPreferencesSchema,
  clientCommunicationPreferencesSchema,
  agentProfileSchema,
  clientProfileSchema,
];
=======
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
>>>>>>> main
