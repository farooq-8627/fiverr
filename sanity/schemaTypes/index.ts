import { type SchemaTypeDefinition } from "sanity";
import {
  socialLinkSchema,
  personalDetailsSchema,
  coreIdentitySchema,
  automationExpertiseSchema,
  agentBusinessDetailsSchema,
  automationNeedsSchema,
  agentProfileSchema,
  clientProfileSchema,
  // Additional schema types
  agentAvailabilitySchema,
  agentPricingSchema,
  agentCommunicationPreferencesSchema,
  clientCommunicationPreferencesSchema,
  clientMustHaveRequirementsSchema,
} from "./profileSchema";

import {
  projectImageSchema,
  agentProjectSchema,
  clientProjectSchema,
} from "./projectSchema";

import { companySchema } from "./companySchema";

// Import the new social feed schemas
import {
  FeedPostSchema,
  FeedMediaSchema,
  FeedCommentSchema,
  FeedLikeSchema,
} from "./socialFeedSchema";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Base types
    socialLinkSchema,
    projectImageSchema,

    // Company schemas
    companySchema,

    // Project schemas
    agentProjectSchema,
    clientProjectSchema,

    // Social Feed schemas
    FeedPostSchema,
    FeedMediaSchema,
    FeedCommentSchema,
    FeedLikeSchema,

    // Component schemas
    personalDetailsSchema,
    coreIdentitySchema,

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
    clientMustHaveRequirementsSchema,
    clientProfileSchema,
  ],
};

// Remove this as we've added user to the main schema types array
export const schemaTypes = [];
