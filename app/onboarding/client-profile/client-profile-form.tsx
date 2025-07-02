"use client";

import { useActionState, useOptimistic } from "react";
import { submitClientProfile } from "./actions";
import {
  industryOptions,
  budgetOptions,
  projectTypeOptions,
  communicationMethods,
  availabilityOptions,
} from "../constants/client-options";
import { timezoneOptions } from "../constants/timezone-options";
import {
  ClientProfileData,
  FormState,
  initialFormState,
} from "../constants/types";

export default function ClientProfileForm() {
  const [state, formAction, isPending] = useActionState(
    submitClientProfile,
    initialFormState
  );
  const [optimisticMessage, addOptimisticMessage] = useOptimistic(
    state.message,
    (state, newMessage: string) => newMessage
  );

  const handleSubmit = async (formData: FormData) => {
    addOptimisticMessage("Saving profile...");
    formAction(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Client Profile</h1>

      {/* Status Messages */}
      {optimisticMessage && (
        <div
          className={`mb-6 p-4 rounded-md ${
            state.success
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          {optimisticMessage}
        </div>
      )}

      <form action={handleSubmit} className="space-y-8">
        {/* Company Information */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Company Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your company name"
              />
              {state.errors?.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.companyName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Industry
              </label>
              <select
                id="industry"
                name="industry"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select an industry</option>
                {industryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.title}
                  </option>
                ))}
              </select>
              {state.errors?.industry && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.industry}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              About Your Business
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about your business..."
            />
            {state.errors?.description && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.description}
              </p>
            )}
          </div>
        </section>

        {/* Project Information */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Project Information
          </h2>

          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Typical Budget Range
            </label>
            <select
              id="budget"
              name="budget"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select budget range</option>
              {budgetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>
            {state.errors?.budget && (
              <p className="mt-1 text-sm text-red-600">{state.errors.budget}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Types of Projects (Select all that apply)
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {projectTypeOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    name="projectTypes"
                    value={option.value}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.title}</span>
                </label>
              ))}
            </div>
            {state.errors?.projectTypes && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.projectTypes}
              </p>
            )}
          </div>
        </section>

        {/* Location & Contact */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Location & Contact
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, Country"
              />
              {state.errors?.location && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.location}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="timezone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Timezone
              </label>
              <input
                type="text"
                id="timezone"
                name="timezone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., UTC+5:30, EST, PST"
              />
              {state.errors?.timezone && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.timezone}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Communication Preferences */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Communication Preferences
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="preferredMethod"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Preferred Communication Method
              </label>
              <select
                id="preferredMethod"
                name="preferredMethod"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select communication method</option>
                {communicationMethods.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.title}
                  </option>
                ))}
              </select>
              {state.errors?.preferredMethod && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.preferredMethod}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="availability"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Availability
              </label>
              <select
                id="availability"
                name="availability"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select availability</option>
                {availabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.title}
                  </option>
                ))}
              </select>
              {state.errors?.availability && (
                <p className="mt-1 text-sm text-red-600">
                  {state.errors.availability}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Saving Profile..." : "Save Client Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
