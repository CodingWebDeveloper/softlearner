"use client";

import { useState } from "react";
import { ListItemText, Snackbar, Alert, CircularProgress } from "@mui/material";
import ConfirmAlert from "@/components/confirm-alert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import DownloadIcon from "@mui/icons-material/Download";

import {
  ResourceItem,
  DeleteButton,
  EditButton,
  ButtonGroup,
  DownloadButton,
} from "@/components/styles/creator/resources-form.styles";
import {
  ResourceTitle,
  ResourceDescription,
  ResourceTypeLabel,
} from "@/components/styles/creator/resources-list.styles";
import { SimpleResource } from "@/services/interfaces/service.interfaces";
import { RESOURCE_TYPES } from "@/lib/constants/database-constants";
import EditResourceDialog from "../edit-resource-dialog";
import { trpc } from "@/lib/trpc/client";

interface ResourceCardProps {
  resource: SimpleResource;
  courseId: string;
  showActions?: boolean;
}

const ResourceCard = ({
  resource,
  courseId,
  showActions = true,
}: ResourceCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const utils = trpc.useUtils();
  const { mutateAsync: updateResource } =
    trpc.resources.updateResource.useMutation({
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: "Resource updated successfully",
          severity: "success",
        });
        utils.resources.getAllResourcesByCourseId.invalidate({
          courseId: courseId,
        });
        setIsEditDialogOpen(false);
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: error.message || "Failed to update resource",
          severity: "error",
        });
      },
    });

  const { mutateAsync: downloadFile, isPending: isDownloading } =
    trpc.resources.downloadResourceFile.useMutation({
      onError: (error) => {
        setSnackbar({
          open: true,
          message: error.message || "Failed to download file",
          severity: "error",
        });
      },
    });

  // Handlers
  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditSave = async (formData: FormData) => {
    formData.append("id", resource.id);
    await updateResource(formData);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const { mutateAsync: deleteResource, isPending: isDeleting } =
    trpc.resources.deleteResource.useMutation({
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: "Resource deleted successfully",
          severity: "success",
        });
        utils.resources.getAllResourcesByCourseId.invalidate({
          courseId: courseId,
        });
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: error.message || "Failed to delete resource",
          severity: "error",
        });
      },
    });

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteResource({ resourceId: resource.id });
  };

  const handleDownload = async () => {
    try {
      const { data, type } = await downloadFile({ resourceId: resource.id });

      // Convert base64 back to Blob
      const blob = new Blob([Buffer.from(data, "base64")], { type });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = resource.name; // Use resource name as filename
      a.click();
      URL.revokeObjectURL(url);

      // Show success message
      setSnackbar({
        open: true,
        message: "File downloaded successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <>
      <ConfirmAlert
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Resource"
        content={`Are you sure you want to delete "${resource.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        label="delete-resource"
      />
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
        {showActions && (
          <ButtonGroup>
            {resource.type === RESOURCE_TYPES.DOWNLOADABLE_FILE && (
              <DownloadButton
                aria-label="download"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <DownloadIcon />
                )}
              </DownloadButton>
            )}
            <EditButton aria-label="edit" onClick={handleEditClick}>
              <EditIcon />
            </EditButton>
            <DeleteButton
              aria-label="delete"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <DeleteIcon />
              )}
            </DeleteButton>
          </ButtonGroup>
        )}
      </ResourceItem>
      <EditResourceDialog
        open={isEditDialogOpen}
        onClose={handleEditClose}
        resource={resource}
        onSave={handleEditSave}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ResourceCard;
