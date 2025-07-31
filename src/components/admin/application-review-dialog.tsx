"use client";

import { useState, useEffect } from "react";
import { CircularProgress, Alert, Grid } from "@mui/material";
import { CheckCircle, Cancel, Close } from "@mui/icons-material";
import { trpc } from "@/lib/trpc/client";
import { formatDate } from "@/utils/date.utils";
import {
  ReviewDialog,
  ReviewDialogTitle,
  ReviewDialogContent,
  ReviewDialogActions,
  InfoSection,
  InfoValue,
  SectionTitle,
  AdminNotesSection,
  ApproveButton,
  RejectButton,
  CancelButton,
  CloseButton,
  PortfolioChip,
  ExperienceChip,
  StatusChip,
  LogEntry,
  LogAction,
  LogMeta,
  LogNotes,
  NotesTextField,
  SectionDivider,
} from "@/components/styles/admin/application-review-dialog.styles";

interface ApplicationReviewDialogProps {
  open: boolean;
  onClose: () => void;
  applicationId: string;
  onUpdateStatus: (params: {
    applicationId: string;
    status: "approved" | "rejected";
    admin_notes?: string;
  }) => void;
  isUpdating: boolean;
}

const ApplicationReviewDialog = ({
  open,
  onClose,
  applicationId,
  onUpdateStatus,
  isUpdating,
}: ApplicationReviewDialogProps) => {
  const [adminNotes, setAdminNotes] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);

  const {
    data: application,
    isLoading,
    error,
  } = trpc.creatorApplications.getApplicationById.useQuery(applicationId, {
    enabled: open && !!applicationId,
  });

  const { data: logs } = trpc.creatorApplications.getApplicationLogs.useQuery(
    applicationId,
    { enabled: open && !!applicationId }
  );

  useEffect(() => {
    if (open) {
      setAdminNotes("");
      setAction(null);
    }
  }, [open]);

  const handleApprove = () => {
    setAction("approve");
  };

  const handleReject = () => {
    setAction("reject");
  };

  const handleConfirmAction = () => {
    if (!action) return;

    onUpdateStatus({
      applicationId,
      status: action === "approve" ? "approved" : "rejected",
      admin_notes: adminNotes.trim() || undefined,
    });
  };

  const handleCancelAction = () => {
    setAction(null);
    setAdminNotes("");
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
      <ReviewDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <ReviewDialogTitle>Review Application</ReviewDialogTitle>
        <ReviewDialogContent>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "24px",
            }}
          >
            <CircularProgress />
          </div>
        </ReviewDialogContent>
      </ReviewDialog>
    );
  }

  if (error || !application) {
    return (
      <ReviewDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <ReviewDialogTitle>Review Application</ReviewDialogTitle>
        <ReviewDialogContent>
          <Alert severity="error">
            Failed to load application:{" "}
            {error?.message || "Application not found"}
          </Alert>
        </ReviewDialogContent>
        <ReviewDialogActions>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </ReviewDialogActions>
      </ReviewDialog>
    );
  }

  return (
    <ReviewDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <ReviewDialogTitle>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SectionTitle variant="h6">Review Creator Application</SectionTitle>
          <StatusChip
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
        </div>
      </ReviewDialogTitle>

      <ReviewDialogContent>
        <Grid container spacing={3}>
          {/* Applicant Information */}
          <Grid size={{ xs: 12 }}>
            <SectionTitle variant="h6" gutterBottom>
              Applicant Information
            </SectionTitle>
            <InfoSection>
              <InfoValue variant="body2">
                <strong>Name:</strong>{" "}
                {application.user?.full_name || "Unknown"}
              </InfoValue>
              <InfoValue variant="body2">
                <strong>Submitted:</strong> {formatDate(application.created_at)}
              </InfoValue>
            </InfoSection>
          </Grid>

          {/* Application Details */}
          <Grid size={{ xs: 12 }}>
            <SectionTitle variant="h6" gutterBottom>
              Application Details
            </SectionTitle>
            <InfoSection>
              <InfoValue variant="body2" gutterBottom>
                <strong>Content Type:</strong> {application.content_type}
              </InfoValue>
              <InfoValue variant="body2" gutterBottom>
                <strong>Experience Level:</strong>{" "}
                <ExperienceChip
                  label={application.experience_level}
                  size="small"
                  variant="outlined"
                />
              </InfoValue>
              <InfoValue variant="body2" gutterBottom>
                <strong>Bio:</strong>
              </InfoValue>
              <InfoValue variant="body2" paragraph>
                {application.bio}
              </InfoValue>
              <InfoValue variant="body2" gutterBottom>
                <strong>Motivation:</strong>
              </InfoValue>
              <InfoValue variant="body2" paragraph>
                {application.motivation}
              </InfoValue>
              {application.portfolio_links &&
                application.portfolio_links.length > 0 && (
                  <>
                    <InfoValue variant="body2" gutterBottom>
                      <strong>Portfolio Links:</strong>
                    </InfoValue>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      {application.portfolio_links.map((link, index) => (
                        <PortfolioChip
                          key={index}
                          label={link}
                          size="small"
                          variant="outlined"
                          component="a"
                          href={link}
                          target="_blank"
                          clickable
                        />
                      ))}
                    </div>
                  </>
                )}
            </InfoSection>
          </Grid>

          {/* Admin Notes */}
          {application.admin_notes && (
            <Grid size={{ xs: 12 }}>
              <SectionTitle variant="h6" gutterBottom>
                Previous Admin Notes
              </SectionTitle>
              <AdminNotesSection>
                <InfoValue variant="body2">{application.admin_notes}</InfoValue>
              </AdminNotesSection>
            </Grid>
          )}

          {/* Action Section */}
          {application.status === "pending" && (
            <Grid size={{ xs: 12 }}>
              <SectionDivider />
              <SectionTitle variant="h6" gutterBottom>
                Review Decision
              </SectionTitle>

              {action ? (
                <div>
                  <NotesTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Admin Notes (Optional)"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about your decision..."
                    style={{ marginBottom: "16px" }}
                  />
                  <div style={{ display: "flex", gap: "16px" }}>
                    <ApproveButton
                      variant="contained"
                      onClick={handleConfirmAction}
                      disabled={isUpdating}
                      startIcon={
                        isUpdating ? <CircularProgress size={20} /> : undefined
                      }
                    >
                      {isUpdating
                        ? "Processing..."
                        : `Confirm ${
                            action === "approve" ? "Approval" : "Rejection"
                          }`}
                    </ApproveButton>
                    <CancelButton
                      variant="outlined"
                      onClick={handleCancelAction}
                      disabled={isUpdating}
                    >
                      Cancel
                    </CancelButton>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "16px" }}>
                  <ApproveButton
                    variant="contained"
                    onClick={handleApprove}
                    startIcon={<CheckCircle />}
                  >
                    Approve Application
                  </ApproveButton>
                  <RejectButton
                    variant="contained"
                    onClick={handleReject}
                    startIcon={<Cancel />}
                  >
                    Reject Application
                  </RejectButton>
                </div>
              )}
            </Grid>
          )}

          {/* Application Logs */}
          {logs && logs.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <SectionDivider />
              <SectionTitle variant="h6" gutterBottom>
                Activity Log
              </SectionTitle>
              <div>
                {logs.map((log, index) => (
                  <LogEntry key={index}>
                    <LogAction variant="body2" fontWeight="medium">
                      {log.action}
                    </LogAction>
                    <LogMeta variant="caption" color="text.secondary">
                      {formatDate(log.created_at)} by{" "}
                      {/* TODO: Add admin name */}
                      {/* {log.admin?.full_name || "Unknown Admin"} */}
                    </LogMeta>
                    {log.notes && (
                      <LogNotes variant="body2">{log.notes}</LogNotes>
                    )}
                  </LogEntry>
                ))}
              </div>
            </Grid>
          )}
        </Grid>
      </ReviewDialogContent>

      <ReviewDialogActions>
        <CloseButton onClick={onClose} startIcon={<Close />}>
          Close
        </CloseButton>
      </ReviewDialogActions>
    </ReviewDialog>
  );
};

export default ApplicationReviewDialog;
