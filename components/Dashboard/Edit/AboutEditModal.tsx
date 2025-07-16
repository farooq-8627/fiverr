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
        <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="border-white/20 text-white hover:bg-white/10 p-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-white/10 hover:bg-white/20 p-2"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </GlassModal>
  );
};
