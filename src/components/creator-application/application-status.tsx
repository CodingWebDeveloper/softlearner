"use client";

import { useState } from "react";
import {
  Typography,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { trpc } from "@/lib/trpc/client";
import { ApplicationForm } from "./application-form";
import {
  LoadingContainer,
  StatusHeader,
  StatusDescription,
  AdminNotesAlert,
  ApplicationDetails,
  ContentTypeChips,
  ReapplyMessage,
  ApplyButton,
} from "@/components/styles/creator-application/application-status.styles";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return {
        color: "warning" as const,
        icon: <ScheduleIcon />,
        label: "Pending Review",
        description: "Your application is being reviewed by our team.",
      };
    case "approved":
      return {
        color: "success" as const,
        icon: <CheckCircleIcon />,
        label: "Approved",
        description:
          "Congratulations! Your application has been approved. You can now create courses.",
      };
    case "rejected":
      return {
        color: "error" as const,
        icon: <CancelIcon />,
        label: "Rejected",
        description: "Your application was not approved at this time.",
      };
    default:
      return {
        color: "default" as const,
        icon: <ScheduleIcon />,
        label: "Unknown",
        description: "Unknown status.",
      };
  }
};

export const ApplicationStatus = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    data: application,
    isLoading,
    refetch,
  } = trpc.creatorApplications.getUserApplication.useQuery();

  const handleFormSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </Card>
    );
  }

  if (!application) {
    return (
      <>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Become a Creator
            </Typography>
            <StatusDescription variant="body2" color="text.secondary">
              Share your knowledge and expertise by creating courses for our
              community. Apply now to start your journey as a content creator.
            </StatusDescription>
            <ContentTypeChips>
              <Chip label="Programming" size="small" />
              <Chip label="Design" size="small" />
              <Chip label="Business" size="small" />
              <Chip label="Marketing" size="small" />
              <Chip label="And more..." size="small" />
            </ContentTypeChips>
          </CardContent>
          <CardActions>
            <ApplyButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsFormOpen(true)}
            >
              Apply to Become a Creator
            </ApplyButton>
          </CardActions>
        </Card>

        {isFormOpen && (
          <ApplicationForm
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSuccess={handleFormSuccess}
          />
        )}
      </>
    );
  }

  const statusConfig = getStatusConfig(application.status);

  return (
    <Card>
      <CardContent>
        <StatusHeader>
          <Typography variant="h6">Creator Application Status</Typography>
          <Chip
            icon={statusConfig.icon}
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
          />
        </StatusHeader>

        <StatusDescription variant="body2" color="text.secondary">
          {statusConfig.description}
        </StatusDescription>

        {application.admin_notes && (
          <AdminNotesAlert severity="info">
            <Typography variant="body2">
              <strong>Admin Notes:</strong> {application.admin_notes}
            </Typography>
          </AdminNotesAlert>
        )}

        <ApplicationDetails>
          <Typography variant="body2">
            <strong>Content Type:</strong> {application.content_type}
          </Typography>
          <Typography variant="body2">
            <strong>Experience Level:</strong> {application.experience_level}
          </Typography>
          <Typography variant="body2">
            <strong>Submitted:</strong>{" "}
            {new Date(application.created_at).toLocaleDateString()}
          </Typography>
          {application.reviewed_at && (
            <Typography variant="body2">
              <strong>Reviewed:</strong>{" "}
              {new Date(application.reviewed_at).toLocaleDateString()}
            </Typography>
          )}
        </ApplicationDetails>

        {application.status === "rejected" && (
          <ReapplyMessage>
            <Typography variant="body2" color="text.secondary">
              You can reapply after 30 days from the rejection date.
            </Typography>
          </ReapplyMessage>
        )}
      </CardContent>
    </Card>
  );
};
