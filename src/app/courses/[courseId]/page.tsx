// Course Details Page for [courseId]
"use client";

import { FC } from "react";
import { useTheme } from "@mui/material/styles";

import { CourseDetailsContainer } from "@/components/styles/courses/course-details.styles";
import { Grid, useMediaQuery } from "@mui/material";
import CourseHeader from "@/components/courses/course-details/course-header";
import CourseTabs from "@/components/courses/course-details/course-tabs";
import CourseSidebar from "@/components/courses/course-details/course-sidebar";
import CourseTags from "@/components/courses/course-details/course-tags";
import { SidebarContainer } from "@/components/styles/courses/courses.styles";
import { trpc } from "@/lib/trpc/client";
import { useParams } from "next/navigation";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";

const CourseDetailsPage: FC = () => {
  // General hooks
  const theme = useTheme();
  const desktopMatches = useMediaQuery(theme.breakpoints.up("lg"));
  const params = useParams();
  const courseId =
    typeof params?.courseId === "string"
      ? params.courseId
      : Array.isArray(params?.courseId)
        ? params.courseId[0]
        : "";

  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = trpc.courses.getCourseById.useQuery(courseId, {
    enabled: !!courseId,
  });

  if (isCourseLoading) {
    return (
      <CourseDetailsContainer>
        <Grid container spacing={6} alignItems="start">
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Header Skeleton */}
            <Skeleton variant="text" width={320} height={48} sx={{ mb: 2 }} />
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{ mb: 2 }}
            />
            {/* Tabs Skeleton */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={320}
              sx={{ mb: 2, borderRadius: 2 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Sidebar Skeleton */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={320}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
        </Grid>
      </CourseDetailsContainer>
    );
  }

  if (courseError || !course) {
    return (
      <CourseDetailsContainer>
        <Alert severity="error">Failed to load course details.</Alert>
      </CourseDetailsContainer>
    );
  }

  const instructor = course.creator
    ? {
        name: course.creator?.full_name || "",
        role: "Instructor",
        avatar: course.creator?.avatar_url || "",
      }
    : {
        name: "Unknown",
        role: "Instructor",
        avatar: "",
      };

  return (
    <CourseDetailsContainer>
      <Grid container spacing={6} alignItems="start">
        <Grid size={{ xs: 12, md: 10, lg: 8 }}>
          <CourseHeader course={course} instructor={instructor} />
          <CourseTags courseId={courseId} />
          {!desktopMatches && (
            <SidebarContainer>
              <CourseSidebar course={course} />
            </SidebarContainer>
          )}
          <CourseTabs course={course} />
        </Grid>
        {desktopMatches && (
          <Grid
            sx={{ top: 0, right: 0, position: "sticky" }}
            size={{ xs: 12, md: 5, lg: 4 }}
          >
            <CourseSidebar course={course} />
          </Grid>
        )}
      </Grid>
    </CourseDetailsContainer>
  );
};

export default CourseDetailsPage;
