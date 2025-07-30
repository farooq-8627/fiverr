"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { Comment, Author } from "@/types/post";
import { revalidatePath } from "next/cache";

export interface CommentActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Add a new comment to a post
 */
export async function addComment(
  postId: string,
  text: string,
  author: Author,
  parentCommentKey?: string
): Promise<CommentActionResult> {
  try {
    console.log("=== Starting comment submission ===");
    console.log("Input data:", { postId, text, author, parentCommentKey });

    // Create a reference to the user document
    const authorRef = {
      _type: "reference",
      _ref: author._id.startsWith("user-") ? author._id : `user-${author._id}`,
    };

    const newComment = {
      _key: new Date().toISOString(),
      content: text,
      author: authorRef,
      authorType: "agent",
      createdAt: new Date().toISOString(),
      isEdited: false,
      replies: [],
    };
    console.log("Created comment object:", newComment);

    let patch;
    if (parentCommentKey) {
      // Add as a reply to existing comment
      patch = backendClient
        .patch(postId)
        .setIfMissing({
          [`comments[_key == "${parentCommentKey}"].replies`]: [],
        })
        .append(`comments[_key == "${parentCommentKey}"].replies`, [
          newComment,
        ]);
    } else {
      // Add as a top-level comment
      patch = backendClient
        .patch(postId)
        .setIfMissing({ comments: [] })
        .append("comments", [newComment]);
    }

    console.log("Submitting to Sanity...");
    const result = await patch.commit({ autoGenerateArrayKeys: true });
    console.log("Sanity mutation result:", result);

    // Revalidate the feed page to show new comment
    revalidatePath("/feed");
    revalidatePath("/dashboard/[username]", "layout");
    revalidatePath("/dashboard/[username]/posts", "page");

    // Return the comment with expanded author data for immediate UI update
    const responseData = {
      _key: newComment._key,
      text: text,
      createdAt: newComment.createdAt,
      isEdited: false,
      replies: [],
      author: {
        _id: author._id,
        personalDetails: author.personalDetails,
        coreIdentity: author.coreIdentity,
      },
    };
    console.log("Returning response data:", responseData);
    console.log("=== Comment submission complete ===");

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error("=== Comment submission failed ===");
    console.error("Detailed error:", {
      error,
      postId,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add comment",
    };
  }
}

/**
 * Edit an existing comment
 */
export async function editComment(
  postId: string,
  commentKey: string,
  text: string,
  isReply?: boolean,
  parentCommentKey?: string
): Promise<CommentActionResult> {
  try {
    console.log("=== Starting comment edit ===");
    console.log("Input data:", {
      postId,
      commentKey,
      text,
      isReply,
      parentCommentKey,
    });

    let patch;
    if (isReply && parentCommentKey) {
      // Edit a reply
      patch = backendClient.patch(postId).set({
        [`comments[_key == "${parentCommentKey}"].replies[_key == "${commentKey}"].content`]:
          text,
        [`comments[_key == "${parentCommentKey}"].replies[_key == "${commentKey}"].isEdited`]: true,
        [`comments[_key == "${parentCommentKey}"].replies[_key == "${commentKey}"].updatedAt`]:
          new Date().toISOString(),
      });
    } else {
      // Edit a top-level comment
      patch = backendClient.patch(postId).set({
        [`comments[_key == "${commentKey}"].content`]: text,
        [`comments[_key == "${commentKey}"].isEdited`]: true,
        [`comments[_key == "${commentKey}"].updatedAt`]:
          new Date().toISOString(),
      });
    }

    const result = await patch.commit();
    console.log("Edit result:", result);

    // Revalidate the feed page to show edited comment
    revalidatePath("/feed");
    revalidatePath("/dashboard/[username]", "layout");
    revalidatePath("/dashboard/[username]/posts", "page");

    return {
      success: true,
      data: {
        text,
        isEdited: true,
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("=== Comment edit failed ===");
    console.error("Error editing comment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to edit comment",
    };
  }
}

/**
 * Delete a comment or reply
 */
export async function deleteComment(
  postId: string,
  commentKey: string,
  isReply?: boolean,
  parentCommentKey?: string
): Promise<CommentActionResult> {
  try {
    console.log("=== Starting comment deletion ===");
    console.log("Input data:", {
      postId,
      commentKey,
      isReply,
      parentCommentKey,
    });

    let patch;
    if (isReply && parentCommentKey) {
      // Remove a reply from a comment
      patch = backendClient
        .patch(postId)
        .unset([
          `comments[_key == "${parentCommentKey}"].replies[_key == "${commentKey}"]`,
        ]);
    } else {
      // Remove a top-level comment
      patch = backendClient
        .patch(postId)
        .unset([`comments[_key == "${commentKey}"]`]);
    }

    const result = await patch.commit();
    console.log("Delete result:", result);

    // Revalidate the feed page
    revalidatePath("/feed");
    revalidatePath("/dashboard/[username]", "layout");
    revalidatePath("/dashboard/[username]/posts", "page");
    return {
      success: true,
    };
  } catch (error) {
    console.error("=== Comment deletion failed ===");
    console.error("Error deleting comment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete comment",
    };
  }
}

/**
 * Update an existing comment
 */
export async function updateComment(
  postId: string,
  commentKey: string,
  text: string
): Promise<CommentActionResult> {
  try {
    console.log("Updating comment:", { postId, commentKey, text });

    const result = await backendClient
      .patch(postId)
      .set({
        [`comments[_key == "${commentKey}"].content`]: text,
        [`comments[_key == "${commentKey}"].updatedAt`]:
          new Date().toISOString(),
      })
      .commit();

    console.log("Update comment result:", result);

    // Revalidate the feed page to show updated comment
    revalidatePath("/feed");
    revalidatePath("/dashboard/[username]", "layout");
    revalidatePath("/dashboard/[username]/posts", "page");
    return { success: true };
  } catch (error) {
    console.error("Error updating comment:", {
      error,
      postId,
      commentKey,
      text,
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update comment",
    };
  }
}
