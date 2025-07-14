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
    projectImageSchema,

    // Company schemas
    companySchema,

    // Project schemas
    agentProjectSchema,
    clientProjectSchema,

    // User schemas
    userSchema,

    // Social Feed schemas
    FeedPostSchema,
    FeedMediaSchema,
    FeedCommentSchema,
    FeedLikeSchema,

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
  agentBusinessDetailsSchema,
  automationNeedsSchema,
  agentAvailabilitySchema,
  agentPricingSchema,
  agentCommunicationPreferencesSchema,
  clientCommunicationPreferencesSchema,
  agentProfileSchema,
  clientProfileSchema,
];
