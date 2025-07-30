import React, { useState } from "react";
import { GlassModal } from "@/components/UI/GlassModal";
import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";
import { updateUserProfileDetails } from "@/app/user-details/actions";
import { useToast } from "@/components/UI/use-toast";

interface AboutEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBio: string;
  onBioUpdate: (newBio: string) => void;
}

export const AboutEditModal = ({
  isOpen,
  onClose,
  currentBio,
  onBioUpdate,
}: AboutEditModalProps) => {
  const [bio, setBio] = useState(currentBio);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateUserProfileDetails({
        bio: bio,
      });

      if (result.success) {
        // Update the UI instantly
        onBioUpdate(bio);

        toast({
          title: "Success",
          description: result.message,
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating bio:", error);
      toast({
        title: "Error",
        description: "Failed to update bio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="About">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write something about yourself..."
          className="min-h-[200px] bg-white/5 border-white/20 text-white"
        />
        <div className="flex justify-end space-x-4 pt-4 border-t border-violet-800/30">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 text-violet-200 bg-transparent border-violet-700/50 hover:bg-violet-900/50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </GlassModal>
  );
};
