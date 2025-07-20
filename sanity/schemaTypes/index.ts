import { SchemaTypeDefinition } from "sanity";
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

import { companySchema } from "./companySchema";
import { userSchema } from "./userSchema";
import userProfileDetails from "./userProfileDetails";

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
