import { Button } from "@/components/UI/button";
import { GlassCard } from "@/components/UI/GlassCard";
import { PostCard } from "@/components/cards/Feed/PostCard";
import { FeedPost } from "@/types/Posts";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreatePostModal } from "./CreatePostModal";
import { User } from "@/types/User";
import { useUser } from "@/hooks/useUser";

interface PostSectionProps {
  post: FeedPost;
  isCurrentUser?: boolean;
  profileId: string;
}

export function PostSection({
  post,
  isCurrentUser,
  profileId,
}: PostSectionProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);

  const { user } = useUser();

  const handlePostUpdate = (data: FeedPost) => {
    setCurrentPost(data);
  };

  return (
    <>
      <GlassCard>
        <div className="md:px-6 py-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Posts</h2>
            {isCurrentUser && (
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 w-8 p-0 bg-white/5 hover:bg-white/10 rounded-full"
              >
                <Plus className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
        </div>
        <CreatePostModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={{
            profileId,
            user: user as unknown as User,
          }}
          isCurrentUser={isCurrentUser || false}
          onPostUpdate={handlePostUpdate}
        />
      </GlassCard>
    </>
  );
}
