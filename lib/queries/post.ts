import { PostFilter } from "@/types/post";

const postProjection = `{
  ...,
  "author": coalesce(
    author->{
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
      },
      mustHaveRequirements {
        industryDomain
      }
    },
    author->userId->{
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
      },
      mustHaveRequirements {
        industryDomain
      }
    }
  ),
  media[] {
    type,
    caption,
    altText,
    "file": {
      "asset": {
        "url": file.asset->url
      }
    }
  },
  comments[] {
    _key,
    text,
    createdAt,
    "author": coalesce(
      author->{
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
          fullName
        }
      },
      {
        "_id": author._id,
        "personalDetails": author.personalDetails,
        "coreIdentity": author.coreIdentity
      }
    ),
  },
  likes[] {
    _id,
    personalDetails {
      username,
      profilePicture {
        asset-> {
          url
        }
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
    return `*[_type == "post" && author->personalDetails.username == "${username}" || author->userId->personalDetails.username == "${username}"] | order(createdAt desc)[0...${limit}]${postProjection}`;
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

  getPostComments: (postId: string) => {
    console.log("Building comment query for post:", postId);
    const authorProjection = `{
      "_id": _id,
      "personalDetails": {
        "username": personalDetails.username,
        "profilePicture": personalDetails.profilePicture {
          "asset": {
            "url": asset->url
          }
        }
      },
      "coreIdentity": {
        "fullName": coreIdentity.fullName
      }
    }`;

    const query = `*[_type == "post" && _id == "${postId}"][0] {
      "comments": comments[] {
        _key,
        "text": coalesce(content, text),
        createdAt,
        isEdited,
        updatedAt,
        "author": coalesce(
          author->${authorProjection},
          {
            "_id": author._id,
            "personalDetails": author.personalDetails,
            "coreIdentity": author.coreIdentity
          }
        ),
        "replies": replies[] {
          _key,
          "text": coalesce(content, text),
          createdAt,
          isEdited,
          updatedAt,
          "author": coalesce(
            author->${authorProjection},
            {
              "_id": author._id,
              "personalDetails": author.personalDetails,
              "coreIdentity": author.coreIdentity
            }
          )
        }
      }
    }`;
    console.log("Generated GROQ query:", query);
    return query;
  },

  getPostLikes: (postId: string) => {
    return `*[_type == "post" && _id == "${postId}"][0] {
      "likes": likes[] {
        _id,
        "personalDetails": personalDetails {
          username,
          profilePicture {
            asset-> {
              url
            }
          }
        }
      }
    }`;
  },
};
