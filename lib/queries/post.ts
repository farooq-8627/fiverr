import { PostFilter } from "@/types/post";

const postProjection = `{
  ...,
  "author": author->{
    _id,
    personalDetails {
      username,
      profilePicture {
        asset-> {
          url
        }
      }
    },
    coreIdentity {
      fullName,
      tagline,
      bio
    }
  },
  media[] {
    type,
    caption,
    altText,
    "file": {
      "asset": {
        "url": file.asset->url
      }
    }
  }
}`;

export const postQueries = {
  getAllPosts: (filter?: PostFilter) => {
    const {
      username,
      limit = 10,
      sortBy = "latest",
      tag,
      achievementOnly,
    } = filter || {};

    let query = `*[_type == "post"`;

    // Add filters
    const filters = [];
    if (username)
      filters.push(`author->personalDetails.username == "${username}"`);
    if (tag) filters.push(`"${tag}" in tags`);
    if (achievementOnly) filters.push("isAchievement == true");

    if (filters.length > 0) {
      query += ` && ${filters.join(" && ")}`;
    }
    query += "]";

    // Add sorting
    query +=
      sortBy === "latest"
        ? " | order(createdAt desc)"
        : " | order(length(likes) desc, createdAt desc)";

    // Add limit and projection
    query += `[0...${limit}]${postProjection}`;

    return query;
  },

  getPostById: (postId: string) => {
    return `*[_type == "post" && _id == "${postId}"]${postProjection}[0]`;
  },

  getLatestPosts: (limit: number = 5) => {
    return `*[_type == "post"] | order(createdAt desc)[0...${limit}]${postProjection}`;
  },

  getUserPosts: (username: string, limit: number = 10) => {
    return `*[_type == "post" && author->personalDetails.username == "${username}"] | order(createdAt desc)[0...${limit}]${postProjection}`;
  },

  getUserAchievements: (username: string, limit: number = 10) => {
    return `*[_type == "post" && author->personalDetails.username == "${username}" && isAchievement == true] | order(createdAt desc)[0...${limit}]${postProjection}`;
  },

  getPostsByTag: (tag: string, limit: number = 10) => {
    return `*[_type == "post" && "${tag}" in tags] | order(createdAt desc)[0...${limit}]${postProjection}`;
  },

  getPopularPosts: (limit: number = 10) => {
    return `*[_type == "post"] | order(length(likes) desc, createdAt desc)[0...${limit}]${postProjection}`;
  },
};
