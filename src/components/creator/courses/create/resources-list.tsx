"use client";

import { ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import {
  ResourceList,
  ResourceItem,
  DeleteButton,
} from "@/components/styles/creator/resources-form.styles";
import {
  ResourcesContainer,
  ResourcesHeader,
  ResourceTitle,
  ResourceDescription,
  ResourceTypeLabel,
} from "@/components/styles/creator/resources-list.styles";

interface Resource {
  title: string;
  description: string;
  type: "video" | "downloadable";
  url?: string;
  file?: File | null;
}

interface ResourcesListProps {
  resources: Resource[];
  onDelete: (index: number) => void;
}

const ResourcesList = ({ resources, onDelete }: ResourcesListProps) => {
  if (!resources.length) return null;

  return (
    <ResourcesContainer>
      <ResourcesHeader variant="h6" gutterBottom>
        <InsertDriveFileIcon /> Added Resources
      </ResourcesHeader>
      <ResourceList>
        {resources.map((resource, index) => (
          <ResourceItem key={index}>
            <ListItemText
              primary={
                <ResourceTitle variant="subtitle1">
                  {resource.title}
                </ResourceTitle>
              }
              secondary={
                <>
                  <ResourceDescription variant="body2" color="textSecondary">
                    {resource.description}
                  </ResourceDescription>
                  <ResourceTypeLabel variant="caption">
                    {resource.type === "video" ? (
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
                </>
              }
            />
            <DeleteButton aria-label="delete" onClick={() => onDelete(index)}>
              <DeleteIcon />
            </DeleteButton>
          </ResourceItem>
        ))}
      </ResourceList>
    </ResourcesContainer>
  );
};

export default ResourcesList;
