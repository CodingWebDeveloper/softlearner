"use client";

import { FC } from "react";
import {
  selectResource,
  setResource,
} from "@/lib/store/features/resourceSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { ListItemAvatar } from "@mui/material";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { BasicResource } from "@/services/interfaces/service.interfaces";
import {
  StyledListItemText,
  ResourceTitle,
  ResourceMaterialItem,
} from "@/components/styles/courses/materials.styles";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

interface ResourceCardProps {
  resource: BasicResource;
}

const ResourceCard: FC<ResourceCardProps> = ({ resource }) => {
  // General hooks
  const dispatch = useAppDispatch();
  const selectedResource = useAppSelector(selectResource);

  // Other variables
  const isVideo = resource.type === "video";
  const isSelected = selectedResource?.id === resource.id;

  // Handlers
  const handleVideoSelect = () => {
    dispatch(setResource({ id: resource.id, videoUrl: resource.url }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleVideoSelect();
    }
  };

  if (isVideo) {
    return (
      <ResourceMaterialItem
        role="button"
        tabIndex={0}
        onClick={handleVideoSelect}
        onKeyDown={handleKeyDown}
        aria-label={`Play ${resource.name}`}
        selected={isSelected}
      >
        <ListItemAvatar>
          <PlayCircleOutlineIcon fontSize="large" />
        </ListItemAvatar>
        <StyledListItemText
          primary={resource.name}
          secondary={resource.duration}
          selected={isSelected}
        />
      </ResourceMaterialItem>
    );
  }

  return (
    <a href={resource.url} download style={{ textDecoration: "none" }}>
      <ResourceMaterialItem>
        <ListItemAvatar>
          <MenuBookRoundedIcon fontSize="large" />
        </ListItemAvatar>
        <ResourceTitle>{resource.name}</ResourceTitle>
      </ResourceMaterialItem>
    </a>
  );
};

export default ResourceCard;
