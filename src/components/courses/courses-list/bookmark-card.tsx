import { useState, useCallback, useEffect } from "react";
import {
  BookmarkBorderIconStyled,
  BookmarkIconStyled,
  BookmarkButton,
} from "@/components/styles/courses/courses.styles";
import { trpc } from "@/lib/trpc/client";
import { debounce } from "@mui/material/utils";

interface BookmarkCardProps {
  courseId: string;
  initialIsBookmarked: boolean;
}

const BookmarkCard = ({
  courseId,
  initialIsBookmarked = false,
}: BookmarkCardProps) => {
  // State
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  // TRPC mutations
  const createBookmarkMutation = trpc.bookmarks.createBookmark.useMutation({
    onSuccess: () => {
      setIsBookmarked(true);
    },
    onError: (error) => {
      console.error("Failed to create bookmark:", error);
      // TODO: Show error toast
    },
  });

  const deleteBookmarkMutation = trpc.bookmarks.deleteBookmark.useMutation({
    onSuccess: () => {
      setIsBookmarked(false);
    },
    onError: (error) => {
      console.error("Failed to delete bookmark:", error);
      // TODO: Show error toast
    },
  });

  // Handlers
  const handleToggleBookmark = useCallback(() => {
    if (isBookmarked) {
      deleteBookmarkMutation.mutate({ courseId });
    } else {
      createBookmarkMutation.mutate({ courseId });
    }
  }, [courseId, isBookmarked, createBookmarkMutation, deleteBookmarkMutation]);

  // Create debounced version of toggle handler
  const debouncedToggleBookmark = debounce(handleToggleBookmark, 300);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedToggleBookmark.clear();
    };
  }, [debouncedToggleBookmark]);

  const isLoading =
    createBookmarkMutation.isPending || deleteBookmarkMutation.isPending;

  return (
    <BookmarkButton
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        if (!isLoading) {
          debouncedToggleBookmark();
        }
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter" && !isLoading) {
          debouncedToggleBookmark();
        }
      }}
      disabled={isLoading}
    >
      {isBookmarked ? <BookmarkIconStyled /> : <BookmarkBorderIconStyled />}
    </BookmarkButton>
  );
};

export default BookmarkCard;
