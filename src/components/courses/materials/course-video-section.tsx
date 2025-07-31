"use client";

import { FC } from "react";
import { Box, Typography, Avatar, useTheme } from "@mui/material";
import {
  VideoSection,
  VideoEmbed,
  InstructorBox,
  DownloadSection,
  DownloadLink,
} from "@/components/styles/courses/materials.styles";
import BookmarkCard from "../courses-list/bookmark-card";
import { FullCourse } from "@/services/interfaces/service.interfaces";
import { useAppSelector } from "@/lib/store/hooks";
import { selectResource } from "@/lib/store/features/resourceSlice";
import CourseTags from "../course-details/course-tags";
import CategoryIcon from "@mui/icons-material/Category";
import { CategoryChip } from "@/components/styles/courses/course-details.styles";
import CompleteCard from "./complete-card";
import DownloadIcon from "@mui/icons-material/Download";
import { RESOURCE_TYPES } from "@/lib/constants/database-constants";

interface CourseVideoSectionProps {
  course: FullCourse;
}

const CourseVideoSection: FC<CourseVideoSectionProps> = ({ course }) => {
  // General hooks
  const theme = useTheme();

  // Selectors
  const selectedResource = useAppSelector(selectResource);

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
        <DownloadLink href={selectedResource.url} download>
          <DownloadIcon />
          Download Resource
        </DownloadLink>
      </DownloadSection>
    );
  };

  return (
    <VideoSection>
      <Typography
        variant="h5"
        fontWeight={600}
        style={{ color: theme.palette.custom.text.white }}
      >
        {course.name}
      </Typography>
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
      <Typography
        variant="body1"
        style={{ color: theme.palette.custom.text.light }}
        mt={2}
      >
        {selectedResource?.short_summary || course.description}
      </Typography>
      <CourseTags courseId={course.id} />

      <InstructorBox>
        <Avatar
          src={course.creator.avatar_url || undefined}
          alt={course.creator.full_name || "Instructor"}
        />
        <Box ml={2}>
          <Typography
            variant="subtitle1"
            fontWeight={500}
            style={{ color: theme.palette.custom.text.white }}
          >
            {course.creator.full_name}
          </Typography>
        </Box>
      </InstructorBox>
    </VideoSection>
  );
};

export default CourseVideoSection;
