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
  ],
};
