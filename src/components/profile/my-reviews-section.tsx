"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  Box,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Rating,
  Typography,
  Skeleton,
  Snackbar,
  Alert,
  Stack,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ProfileCard,
  ProfileCardHeader,
  ProfileCardTitle,
} from "@/components/styles/profile/profile.styles";
import { trpc } from "@/lib/trpc/client";
import ReviewModal from "@/components/reviews/review-modal";
import ConfirmAlert from "@/components/confirm-alert";
import { REVIEWS_PER_PAGE } from "@/utils/constants";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function MyReviewsSection() {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const utils = trpc.useUtils();

  // Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const closeSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  // Edit state
  const [editing, setEditing] = useState<{
    open: boolean;
    id?: string;
    content?: string;
    rating?: number;
  }>({ open: false });

  // Delete state
  const [deleting, setDeleting] = useState<{
    open: boolean;
    id?: string;
  }>({ open: false });

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    trpc.reviews.getUserReviews.useInfiniteQuery(
      { limit: REVIEWS_PER_PAGE },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const { mutateAsync: updateReview, isPending: isUpdating } =
    trpc.reviews.updateReview.useMutation({
      onMutate: async (opts) => {
        await utils.reviews.getUserReviews.cancel();
        utils.reviews.getUserReviews.setInfiniteData(
          { limit: REVIEWS_PER_PAGE },
          (data) => {
            if (!data) return { pages: [], pageParams: [] };
            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                data: page.data.map((item) =>
                  item.id === opts.reviewId
                    ? {
                        ...item,
                        content: opts.content,
                        rating: opts.rating,
                        updated_at: new Date().toISOString(),
                      }
                    : item
                ),
              })),
            };
          }
        );
      },
      onError: () => {
        utils.reviews.getUserReviews.invalidate({
          limit: REVIEWS_PER_PAGE,
          direction: "forward",
        });
      },
      onSettled: () => {
        utils.reviews.getUserReviews.invalidate({
          limit: REVIEWS_PER_PAGE,
          direction: "forward",
        });
      },
    });

  const { mutateAsync: deleteReview, isPending: isDeleting } =
    trpc.reviews.deleteReview.useMutation({
      onMutate: async (opts) => {
        await utils.reviews.getUserReviews.cancel();
        utils.reviews.getUserReviews.setInfiniteData(
          { limit: REVIEWS_PER_PAGE, direction: "forward" },
          (data) => {
            if (!data) return { pages: [], pageParams: [] };
            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                data: page.data.filter((item) => item.id !== opts.reviewId),
              })),
            };
          }
        );
      },
      onError: () => {
        utils.reviews.getUserReviews.invalidate({
          limit: REVIEWS_PER_PAGE,
          direction: "forward",
        });
      },
      onSettled: () => {
        utils.reviews.getUserReviews.invalidate({
          limit: REVIEWS_PER_PAGE,
          direction: "forward",
        });
      },
    });

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  // Intersection Observer to load next page
  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleOpenEdit = (r: {
    id: string;
    content: string;
    rating: number;
  }) => {
    setEditing({ open: true, id: r.id, content: r.content, rating: r.rating });
  };

  const handleSubmitEdit = async (values: {
    content: string;
    rating: number;
  }) => {
    if (!editing.id) return;
    try {
      await updateReview({
        reviewId: editing.id,
        content: values.content,
        rating: values.rating,
      });
      // Reset and refetch from first page to reflect update ordering/content
      await utils.reviews.getUserReviews.invalidate();
      setEditing({ open: false });
      setSnackbar({
        open: true,
        message: "Review updated successfully",
        severity: "success",
      });
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to update review";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  const handleConfirmDelete = (id: string) => setDeleting({ open: true, id });

  const handleDelete = async () => {
    if (!deleting.id) return;
    try {
      await deleteReview({ reviewId: deleting.id });
      await utils.reviews.getUserReviews.invalidate();
      setDeleting({ open: false });
      setSnackbar({
        open: true,
        message: "Review deleted",
        severity: "success",
      });
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to delete review";
      setSnackbar({ open: true, message, severity: "error" });
    }
  };

  return (
    <ProfileCard>
      <CardContent>
        <ProfileCardHeader>
          <ProfileCardTitle>My Reviews</ProfileCardTitle>
        </ProfileCardHeader>

        {isLoading ? (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height={72} />
            ))}
          </Stack>
        ) : items.length === 0 ? (
          <Typography color="text.secondary">
            You haven&#39;t posted any reviews yet.
          </Typography>
        ) : (
          <>
            <List>
              {items.map((r) => (
                <ListItem
                  key={r.id}
                  secondaryAction={
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            handleOpenEdit({
                              id: r.id,
                              content: r.content,
                              rating: r.rating,
                            })
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          onClick={() => handleConfirmDelete(r.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      {(r.user?.full_name || "A")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Rating
                          name={`rating-${r.id}`}
                          value={r.rating}
                          readOnly
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(r.created_at)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2">{r.content}</Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box ref={loaderRef} sx={{ height: 8 }} />
            {isFetchingNextPage && (
              <Box mt={2}>
                <Skeleton variant="rectangular" height={56} />
              </Box>
            )}
            {!hasNextPage && items.length > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                mt={2}
              >
                No more reviews to load
              </Typography>
            )}
          </>
        )}
      </CardContent>

      {/* Edit Modal */}
      <ReviewModal
        open={editing.open}
        onClose={() => setEditing({ open: false })}
        onSubmit={async (values) => handleSubmitEdit(values)}
        initialValues={{ content: editing.content, rating: editing.rating }}
        title="Edit Review"
        submitText={isUpdating ? "Saving..." : "Save Changes"}
      />

      {/* Delete Confirm */}
      <ConfirmAlert
        open={deleting.open}
        onConfirm={handleDelete}
        onClose={() => setDeleting({ open: false })}
        title="Delete review?"
        content="This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ProfileCard>
  );
}
