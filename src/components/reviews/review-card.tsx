"use client";

import { Box, ListItem, ListItemAvatar, Avatar, ListItemText, Rating, Typography, Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export interface ReviewUser {
  full_name?: string | null;
}

export interface ReviewItem {
  id: string;
  content: string;
  rating: number;
  created_at: string; // ISO
  user?: ReviewUser | null;
}

interface ReviewCardProps {
  review: ReviewItem;
  onEdit?: (payload: { id: string; content: string; rating: number }) => void;
  onDelete?: (id: string) => void;
}

function getInitials(name?: string | null) {
  const source = name && name.trim().length > 0 ? name : "A";
  return source
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function isWithin24Hours(iso: string) {
  const created = new Date(iso).getTime();
  const now = Date.now();
  const diff = now - created;
  return diff <= 24 * 60 * 60 * 1000;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const showActions = isWithin24Hours(review.created_at);

  return (
    <ListItem
      secondaryAction={
        showActions && (onEdit || onDelete) ? (
          <Box>
            {onEdit && (
              <Tooltip title="Edit">
                <IconButton
                  edge="end"
                  onClick={() =>
                    onEdit({ id: review.id, content: review.content, rating: review.rating })
                  }
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Delete">
                <IconButton edge="end" onClick={() => onDelete(review.id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ) : undefined
      }
    >
      <ListItemAvatar>
        <Avatar>{getInitials(review.user?.full_name)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={1}>
            <Rating name={`rating-${review.id}`} value={review.rating} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              {formatDate(review.created_at)}
            </Typography>
          </Box>
        }
        secondary={<Typography variant="body2">{review.content}</Typography>}
      />
    </ListItem>
  );
}
