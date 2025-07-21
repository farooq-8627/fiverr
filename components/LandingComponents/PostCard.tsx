import { PostCard } from "../cards/PostCard";

const examplePosts = [
  {
    id: "1",
    title: "Honored to be part of ICMAT 2025 | Singapore",
    content:
      "I'm incredibly grateful for the opportunity to deliver a talk on my research at ICMAT 2025, the 12th International Conference on Materials for Advanced Technologies. Looking forward to sharing insights and connecting with fellow researchers! 🎓🔬",
    tags: [
      "ICMAT2025",
      "Research",
      "MaterialScience",
      "Conference",
      "Singapore",
    ],
    createdAt: "2024-03-14T12:00:00Z",
    likes: 142,
    comments: 27,
    reposts: 13,
    media: [
      {
        type: "image" as const,
        file: {
          asset: {
            url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=2000&auto=format&fit=crop",
          },
        },
        caption: "Conference Main Hall",
      },
      {
        type: "image" as const,
        file: {
          asset: {
            url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2000&auto=format&fit=crop",
          },
        },
        caption: "Research Presentation",
      },
      {
        type: "image" as const,
        file: {
          asset: {
            url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop",
          },
        },
        caption: "Team Discussion",
      },
    ],
    author: {
      name: "Dr. Sarah Chen",
      username: "sarahchen_research",
      portfolio: "https://sarahchen.com",
      roles: ["agent", "client"],
      profilePicture: {
        asset: {
          url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        },
      },
      title: "Materials Science Researcher",
      verified: true,
    },
  },
  {
    id: "2",
    title: "Introducing Our Latest Automation Framework",
    content:
      "Just released our latest automation framework! 🚀\n\nExcited to share our new open-source project that simplifies workflow automation. Check out the demo video and documentation. Would love to hear your thoughts!",
    tags: [
      "OpenSource",
      "Automation",
      "TechInnovation",
      "Development",
      "Framework",
    ],
    createdAt: "2024-03-13T15:30:00Z",
    likes: 89,
    comments: 15,
    reposts: 23,
    media: [
      {
        type: "video" as const,
        file: {
          asset: {
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
        },
        caption: "Framework Demo",
      },
      {
        type: "pdf" as const,
        file: {
          asset: {
            url: "https://example.com/documentation.pdf",
          },
        },
        caption: "Framework Documentation",
      },
    ],
    author: {
      name: "Alex Rivera",
      username: "arivera_dev",
      portfolio: "https://arivera.dev",
      roles: ["agent"],
      profilePicture: {
        asset: {
          url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
        },
      },
      title: "Senior Software Engineer",
      verified: true,
    },
  },
  {
    id: "3",
    title: "New Company Headquarters Unveiled! 🏢",
    content:
      "Thrilled to unveil our new company headquarters!\n\nA space designed for collaboration, innovation, and creativity. This marks a new chapter in our journey. Special thanks to our amazing team who made this possible.",
    tags: [
      "NewBeginnings",
      "CompanyCulture",
      "Innovation",
      "Workspace",
      "Growth",
    ],
    createdAt: "2024-03-12T09:15:00Z",
    likes: 234,
    comments: 42,
    reposts: 31,
    media: [
      {
        type: "image" as const,
        file: {
          asset: {
            url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
          },
        },
        caption: "Office Exterior",
      },
      {
        type: "image" as const,
        file: {
          asset: {
            url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2000&auto=format&fit=crop",
          },
        },
        caption: "Meeting Area",
      },
      {
        type: "image" as const,
        file: {
          asset: {
            url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop",
          },
        },
        caption: "Collaborative Space",
      },
      {
        type: "image" as const,
        file: {
          asset: {
            url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
          },
        },
        caption: "Recreation Zone",
      },
      {
        type: "image" as const,
        file: {
          asset: {
            url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2000&auto=format&fit=crop",
          },
        },
        caption: "Cafeteria",
      },
    ],
    author: {
      name: "Emily Zhang",
      username: "emily_ceo",
      portfolio: "https://emilyzhang.com",
      roles: ["client"],
      profilePicture: {
        asset: {
          url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200&auto=format&fit=crop",
        },
      },
      title: "CEO & Founder",
      verified: true,
    },
  },
];

export default function PostCardExample() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {examplePosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
