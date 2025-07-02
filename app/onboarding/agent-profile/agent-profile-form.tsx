"use client";

import { useActionState, useOptimistic, startTransition } from "react";
import { createAgentProfile } from "./actions";
import { useState, useRef } from "react";
import {
  skillOptions,
  hourlyRateOptions,
  availabilityOptions,
  languageOptions,
  experienceLevelOptions,
  responseTimeOptions,
  portfolioTypeOptions,
  workingDaysOptions,
} from "../constants/agent-options";
import { timezoneOptions } from "../constants/timezone-options";
import {
  AgentProfileData,
  FormState,
  initialFormState,
} from "../constants/types";

interface Portfolio {
  title: string;
  description: string;
  url: string;
  technologies: string;
}

interface Language {
  language: string;
  proficiency: string;
}

export default function AgentProfileForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createAgentProfile,
    initialFormState
  );

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Optimistic updates
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (state: FormState, newState: FormState) => newState
  );

  const [optimisticMessage, addOptimisticMessage] = useOptimistic(
    state.message,
    (state, newMessage: string) => newMessage
  );

  const handleSubmit = (formData: FormData) => {
    // Add dynamic fields to formData
    selectedSkills.forEach((skill) => {
      formData.append("skills", skill);
    });

    portfolio.forEach((item, index) => {
      formData.append(`portfolio[${index}].title`, item.title);
      formData.append(`portfolio[${index}].description`, item.description);
      formData.append(`portfolio[${index}].url`, item.url);
      formData.append(`portfolio[${index}].technologies`, item.technologies);
    });

    languages.forEach((item, index) => {
      formData.append(`languages[${index}].language`, item.language);
      formData.append(`languages[${index}].proficiency`, item.proficiency);
    });

    selectedDays.forEach((day) => {
      formData.append("workingDays", day);
    });

    startTransition(() => {
      addOptimistic({
        success: false,
        message: "Creating profile...",
      });
      formAction(formData);
    });
  };

  const addPortfolioItem = () => {
    setPortfolio([
      ...portfolio,
      { title: "", description: "", url: "", technologies: "" },
    ]);
  };

  const removePortfolioItem = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const updatePortfolioItem = (
    index: number,
    field: keyof Portfolio,
    value: string
  ) => {
    const updated = [...portfolio];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolio(updated);
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", proficiency: "basic" }]);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const updateLanguage = (
    index: number,
    field: keyof Language,
    value: string
  ) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    setLanguages(updated);
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else if (selectedSkills.length < 10) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-8">
      {/* Status Message */}
      {optimisticState.message && (
        <div
          className={`p-4 rounded-md ${
            optimisticState.success
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {optimisticState.message}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Basic Information
        </h2>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Professional Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            placeholder="e.g., Full Stack Developer, UI/UX Designer, Digital Marketer"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {optimisticState.errors?.title && (
            <p className="mt-1 text-sm text-red-600">
              {optimisticState.errors.title[0]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Skills * (Select up to 10)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {skillOptions.map((skill) => (
              <button
                key={skill.value}
                type="button"
                onClick={() => toggleSkill(skill.value)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  selectedSkills.includes(skill.value)
                    ? "bg-blue-100 border-blue-300 text-blue-800"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {skill.title}
              </button>
            ))}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Selected: {selectedSkills.length}/10
          </p>
          {optimisticState.errors?.skills && (
            <p className="mt-1 text-sm text-red-600">
              {optimisticState.errors.skills[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-700"
            >
              Years of Experience
            </label>
            <input
              type="number"
              id="experience"
              name="experience"
              min="0"
              max="50"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="hourlyRate"
              className="block text-sm font-medium text-gray-700"
            >
              Hourly Rate ($)
            </label>
            <input
              type="number"
              id="hourlyRate"
              name="hourlyRate"
              min="5"
              max="500"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700"
          >
            Professional Bio * (50-1000 characters)
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={6}
            required
            minLength={50}
            maxLength={1000}
            placeholder="Tell clients about your experience, expertise, and what makes you unique."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {optimisticState.errors?.bio && (
            <p className="mt-1 text-sm text-red-600">
              {optimisticState.errors.bio[0]}
            </p>
          )}
        </div>
      </div>

      {/* Portfolio */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Portfolio</h2>
          <button
            type="button"
            onClick={addPortfolioItem}
            disabled={portfolio.length >= 6}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Add Project
          </button>
        </div>

        {portfolio.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900">Project {index + 1}</h3>
              <button
                type="button"
                onClick={() => removePortfolioItem(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Title"
                value={item.title}
                onChange={(e) =>
                  updatePortfolioItem(index, "title", e.target.value)
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="Project URL (optional)"
                value={item.url}
                onChange={(e) =>
                  updatePortfolioItem(index, "url", e.target.value)
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <textarea
              rows={3}
              placeholder="Project Description"
              value={item.description}
              onChange={(e) =>
                updatePortfolioItem(index, "description", e.target.value)
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />

            <input
              type="text"
              placeholder="Technologies Used (comma-separated)"
              value={item.technologies}
              onChange={(e) =>
                updatePortfolioItem(index, "technologies", e.target.value)
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      {/* Languages */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Languages</h2>
          <button
            type="button"
            onClick={addLanguage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Language
          </button>
        </div>

        {languages.map((item, index) => (
          <div key={index} className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Language"
              value={item.language}
              onChange={(e) =>
                updateLanguage(index, "language", e.target.value)
              }
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <select
              value={item.proficiency}
              onChange={(e) =>
                updateLanguage(index, "proficiency", e.target.value)
              }
              className="w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {experienceLevelOptions.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeLanguage(index)}
              className="text-red-600 hover:text-red-800 px-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Availability & Working Hours */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Availability & Working Hours
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="availability"
              className="block text-sm font-medium text-gray-700"
            >
              Availability *
            </label>
            <select
              id="availability"
              name="availability"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select availability</option>
              {availabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="responseTime"
              className="block text-sm font-medium text-gray-700"
            >
              Typical Response Time
            </label>
            <select
              id="responseTime"
              name="responseTime"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select response time</option>
              {responseTimeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g., New York, USA"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-gray-700"
            >
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select timezone</option>
              {timezoneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Working Days
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {workingDaysOptions.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  selectedDays.includes(day.value)
                    ? "bg-blue-100 border-blue-300 text-blue-800"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {day.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700"
            >
              Start Time
            </label>
            <select
              id="startTime"
              name="startTime"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select start time</option>
              <option value="06:00">6:00 AM</option>
              <option value="07:00">7:00 AM</option>
              <option value="08:00">8:00 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700"
            >
              End Time
            </label>
            <select
              id="endTime"
              name="endTime"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select end time</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
              <option value="21:00">9:00 PM</option>
              <option value="22:00">10:00 PM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating Profile..." : "Create Agent Profile"}
        </button>
      </div>
    </form>
  );
}
