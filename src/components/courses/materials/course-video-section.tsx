"use client";

import { FC } from "react";
import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import {
  VideoSection,
  VideoEmbed,
  InstructorBox,
  DownloadSection,
} from "@/components/styles/courses/materials.styles";
import BookmarkCard from "../courses-list/bookmark-card";
import { FullCourse } from "@/services/interfaces/service.interfaces";
import { useAppSelector } from "@/lib/store/hooks";
import { trpc } from "@/lib/trpc/client";
import { selectResource } from "@/lib/store/features/resourceSlice";
import CourseTags from "../course-details/course-tags";
import CategoryIcon from "@mui/icons-material/Category";
import { CategoryChip } from "@/components/styles/courses/course-details.styles";
import CompleteCard from "./complete-card";
import DownloadIcon from "@mui/icons-material/Download";
import { RESOURCE_TYPES } from "@/lib/constants/database-constants";
import { AvatarImage } from "@/components/profile/avatar-image";
import { getInitials } from "@/utils/utils";
import ReviewBanner from "./review-banner";
import {
  LightText,
  StyledButton,
  WhiteText,
} from "@/components/styles/infrastructure/layout.styles";

interface CourseVideoSectionProps {
  course: FullCourse;
}

const CourseVideoSection: FC<CourseVideoSectionProps> = ({ course }) => {
  // General hooks
  const theme = useTheme();

  // Selectors
  const selectedResource = useAppSelector(selectResource);

  // tRPC hooks
  const { mutateAsync: downloadResourceFile, isPending: isResourceLoading } =
    trpc.resources.downloadResourceFile.useMutation();

  // Handelers
  const handleDownload = async () => {
    if (!selectedResource) return;

    try {
      const result = await downloadResourceFile({
        resourceId: selectedResource.id,
      });

      // Convert base64 back to blob
      const binaryString = atob(result.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: result.type });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = selectedResource.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const renderContent = () => {
    if (!selectedResource) {
      return (
        <VideoEmbed>
          <iframe
            width="100%"
            height="360"
            src={course.video_url}
            title={course.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoEmbed>
      );
    }

    if (selectedResource.type === RESOURCE_TYPES.VIDEO) {
      return (
        <VideoEmbed>
          <iframe
            width="100%"
            height="360"
            src={selectedResource.url}
            title={selectedResource.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoEmbed>
      );
    }

    return (
      <DownloadSection>
        <StyledButton
          variant="contained"
          onClick={handleDownload}
          disabled={isResourceLoading}
          startIcon={
            isResourceLoading ? (
              <CircularProgress size={20} />
            ) : (
              <DownloadIcon />
            )
          }
        >
          {isResourceLoading ? "Downloading..." : "Download Resource"}
        </StyledButton>
      </DownloadSection>
    );
  };

  return (
    <VideoSection>
      <ReviewBanner courseId={course.id} isReviewed={course.isReviewed} />
      <WhiteText variant="h5" fontWeight={600} gutterBottom>
        {course.name}
      </WhiteText>

      {renderContent()}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={2}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          style={{ color: theme.palette.custom.text.white }}
        >
          {selectedResource?.name}
        </Typography>
        <Box display="flex" gap={2}>
          {selectedResource && (
            <CompleteCard resourceId={selectedResource.id} />
          )}
          <BookmarkCard
            courseId={course.id}
            initialIsBookmarked={course.isBookmarked}
          />
        </Box>
      </Box>

      <Box mt={1}>
        <CategoryChip label={course.category.name} icon={<CategoryIcon />} />
      </Box>
      <LightText variant="body1" mt={2}>
        {selectedResource?.short_summary || course.description}
      </LightText>
      <CourseTags courseId={course.id} />

      <InstructorBox>
        <AvatarImage
          avatarUrl={course.creator?.avatar_url}
          alt={course.creator?.full_name || "Instructor"}
          size="small"
        >
          {course.creator?.full_name
            ? getInitials(course.creator.full_name)
            : "U"}
        </AvatarImage>
        <Box ml={2}>
          <WhiteText variant="subtitle1" fontWeight={500}>
            {course.creator?.full_name || "Unknown"}
          </WhiteText>
        </Box>
      </InstructorBox>
    </VideoSection>
  );
};

export default CourseVideoSection;
