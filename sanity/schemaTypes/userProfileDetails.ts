export default {
  name: "profileDetails",
  type: "object",
  title: "User Profile Details",
  fields: [
    {
      name: "location",
      type: "object",
      title: "Location",
      fields: [
        {
          name: "cityState",
          type: "string",
          title: "City/State",
          description: "City and state/province",
        },
        {
          name: "country",
          type: "string",
          title: "Country",
          description: "Country name",
        },
      ],
    },
    {
      name: "yearsOfExperience",
      type: "string",
      title: "Years of Experience",
      description: "Number of years of professional experience",
    },
    {
      name: "specialties",
      type: "string",
      title: "Specialties",
      description: "User specialties (comma separated)",
    },
    {
      name: "education",
      type: "string",
      title: "Education",
      description: "User education background",
    },
    {
      name: "certifications",
      type: "string",
      title: "Certifications",
      description: "Professional certifications (comma separated)",
    },
    {
      name: "languages",
      type: "string",
      title: "Languages",
      description: "Languages the user speaks (comma separated)",
    },
    {
      name: "extraDetailsJson",
      type: "text",
      title: "Extra Details JSON",
      description: "Additional profile details stored as JSON string",
      hidden: true,
    },
  ],
};
