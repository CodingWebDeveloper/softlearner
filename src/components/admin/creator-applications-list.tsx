"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { trpc } from "@/lib/trpc/client";
import ApplicationReviewDialog from "./application-review-dialog";
import { formatDate } from "@/utils/date.utils";

const CreatorApplicationsList = () => {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null
  );
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const {
    data: applications,
    isLoading,
    error,
    refetch,
  } = trpc.creatorApplications.getApplications.useQuery(
    { page: 1, pageSize: 50, },
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );

  const updateStatusMutation =
    trpc.creatorApplications.updateApplicationStatus.useMutation({
      onSuccess: () => {
        refetch();
        setIsReviewDialogOpen(false);
        setSelectedApplication(null);
      },
    });

  const handleViewApplication = (applicationId: string) => {
    setSelectedApplication(applicationId);
    setIsReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setIsReviewDialogOpen(false);
    setSelectedApplication(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load applications: {error.message}
      </Alert>
    );
  }

  if (!applications?.data || applications.data.length === 0) {
    return (
      <Box textAlign="center" p={3}>
        <Typography variant="body1" color="text.secondary">
          No creator applications found.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Applicant</TableCell>
              <TableCell>Content Type</TableCell>
              <TableCell>Experience Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.data.map((application) => (
              <TableRow key={application.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {application.user?.full_name || "Unknown User"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {application.content_type}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={application.experience_level}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(application.status)}
                    color={
                      getStatusColor(application.status) as
                        | "warning"
                        | "success"
                        | "error"
                        | "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(application.created_at)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewApplication(application.id)}
                    title="View Application"
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedApplication && (
        <ApplicationReviewDialog
          open={isReviewDialogOpen}
          onClose={handleCloseReviewDialog}
          applicationId={selectedApplication}
          onUpdateStatus={updateStatusMutation.mutate}
          isUpdating={updateStatusMutation.isPending}
        />
      )}
    </>
  );
};

export default CreatorApplicationsList;
