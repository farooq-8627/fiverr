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
