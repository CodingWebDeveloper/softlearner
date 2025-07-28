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
  ResourceMaterialItem,
} from "@/components/styles/courses/materials.styles";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { RESOURCE_TYPES } from "@/constants/database-constants";
import { useSearchParams, useRouter } from "next/navigation";

interface ResourceCardProps {
  resource: BasicResource;
}

const ResourceCard: FC<ResourceCardProps> = ({ resource }) => {
  // General hooks
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selectors
  const selectedResource = useAppSelector(selectResource);

  // Other variables
  const isVideo = resource.type === RESOURCE_TYPES.VIDEO;
  const isSelected = selectedResource?.id === resource.id;

  const handleSelect = () => {
    dispatch(setResource(resource));
    const params = new URLSearchParams(searchParams);
    params.set("resourceId", resource.id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelect();
    }
  };

  if (isVideo) {
    return (
      <ResourceMaterialItem
        role="button"
        tabIndex={0}
        onClick={handleSelect}
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
    <ResourceMaterialItem
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      aria-label={`Download ${resource.name}`}
      selected={isSelected}
    >
      <ListItemAvatar>
        <MenuBookRoundedIcon fontSize="large" />
      </ListItemAvatar>
      <StyledListItemText primary={resource.name} selected={isSelected} />
    </ResourceMaterialItem>
  );
};

export default ResourceCard;
