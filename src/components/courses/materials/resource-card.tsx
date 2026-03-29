"use client";

import { FC } from "react";
import { ListItemAvatar } from "@mui/material";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import { BasicResource } from "@/services/interfaces/service.interfaces";
import {
  StyledListItemText,
  ResourceMaterialItem,
} from "@/components/styles/courses/materials.styles";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { RESOURCE_TYPES } from "@/lib/constants/database-constants";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectResource,
  setResource,
} from "@/lib/store/features/resourceSlice";
import { useSearchParams, useRouter } from "next/navigation";
import { ResourceCompletedIcon } from "@/components/styles/courses/materials.styles";

interface ResourceCardProps {
  resource: BasicResource;
}

const ResourceCard: FC<ResourceCardProps> = ({ resource }) => {
  const dispatch = useAppDispatch();
  const selectedResource = useAppSelector(selectResource);
  const router = useRouter();
  const searchParams = useSearchParams();

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
        data-resource-id={resource.id}
      >
        <ListItemAvatar>
          <PlayCircleOutlineIcon fontSize="large" />
        </ListItemAvatar>
        <StyledListItemText
          primary={resource.name}
          secondary={resource.duration}
          selected={isSelected}
        />
        {resource.completed && <ResourceCompletedIcon />}
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
      data-resource-id={resource.id}
    >
      <ListItemAvatar>
        <MenuBookRoundedIcon fontSize="large" />
      </ListItemAvatar>
      <StyledListItemText primary={resource.name} selected={isSelected} />
      {resource.completed && <ResourceCompletedIcon />}
    </ResourceMaterialItem>
  );
};

export default ResourceCard;
