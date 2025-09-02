"use client";

import { ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { IconButton } from "@mui/material";
import {
  ResourceItem,
  DeleteButton,
} from "@/components/styles/creator/resources-form.styles";
import {
  ResourceTitle,
  ResourceDescription,
  ResourceTypeLabel,
} from "@/components/styles/creator/resources-list.styles";
import { SimpleResource } from "@/services/interfaces/service.interfaces";
import { RESOURCE_TYPES } from "@/lib/constants/database-constants";

interface ResourceCardProps {
  resource: SimpleResource;
  onDelete?: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
  showDelete?: boolean;
}

const ResourceCard = ({
  resource,
  onDelete,
  showDelete = true,
}: ResourceCardProps) => {
  return (
    <ResourceItem>
      <ListItemText
        primary={
          <div>
            <ResourceTitle variant="subtitle1">{resource.name}</ResourceTitle>
          </div>
        }
        secondary={
          <>
            <div>
              <ResourceDescription variant="body2" color="textSecondary">
                {resource.short_summary}
              </ResourceDescription>
            </div>
            <div>
              <ResourceTypeLabel variant="caption">
                {resource.type === RESOURCE_TYPES.VIDEO ? (
                  <>
                    <VideoFileIcon fontSize="small" />
                    Video
                  </>
                ) : (
                  <>
                    <InsertDriveFileIcon fontSize="small" />
                    File
                  </>
                )}
              </ResourceTypeLabel>
            </div>
          </>
        }
      />
      {showDelete && onDelete && (
        <DeleteButton aria-label="delete" onClick={() => onDelete(resource.id)}>
          <DeleteIcon />
        </DeleteButton>
      )}
    </ResourceItem>
  );
};

export default ResourceCard;
