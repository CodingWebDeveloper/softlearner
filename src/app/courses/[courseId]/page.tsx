// Course Details Page for [courseId]
'use client';

import { FC } from 'react';
import { useTheme } from '@mui/material/styles';

import { CourseDetailsContainer } from '@/components/styles/courses/course-details.styles';
import { Grid, useMediaQuery } from '@mui/material';
import CourseHeader from '@/components/courses/course-details/course-header';
import CourseTabs from '@/components/courses/course-details/course-tabs';
import CourseSidebar from '@/components/courses/course-details/course-sidebar';
import { SidebarContainer } from '@/components/styles/courses/courses.styles';
import { trpc } from '@/lib/trpc/trpc';
import { useParams } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';

const CourseDetailsPage: FC = () => {
  // General hooks
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));
  const params = useParams();
  const courseId = typeof params?.courseId === 'string' ? params.courseId : Array.isArray(params?.courseId) ? params.courseId[0] : '';

  const { data: course, isLoading, error } = trpc.courses.getCourseById.useQuery(courseId, {
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <CourseDetailsContainer>
        <Grid container spacing={6} alignItems="start">
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Header Skeleton */}
            <Skeleton variant="text" width={320} height={48} sx={{ mb: 2 }} />
            <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
            {/* Tabs Skeleton */}
            <Skeleton variant="rectangular" width="100%" height={320} sx={{ mb: 2, borderRadius: 2 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Sidebar Skeleton */}
            <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </CourseDetailsContainer>
    );
  }

  if (error || !course) {
    return (
      <CourseDetailsContainer>
        <Alert severity="error">Failed to load course details.</Alert>
      </CourseDetailsContainer>
    );
  }

  // Prepare instructor and meta data for child components
  const instructor = course.creator
    ? {
        name: course.creator.full_name || '',
        role: 'Instructor',
        avatar: course.creator.avatar_url || '',
      }
    : {
        name: 'Unknown',
        role: 'Instructor',
        avatar: '',
      };

  // Placeholder meta, adapt as needed
  const meta = {
    level: 'N/A',
    duration: 'N/A',
    videos: 0,
    files: 0,
    lifetime: true,
    deviceAccess: true,
  };

  const discount = 0; // Adjust if discount logic is available

  return (
    <CourseDetailsContainer>
      <Grid container spacing={6} alignItems="start">
        <Grid size={{xs: 12, md: 8}}>
          <CourseHeader title={course.name} instructor={instructor} />
          {mobileMatches && (
            <SidebarContainer>
              <CourseSidebar price={course.price} discount={discount} meta={meta} image={course.thumbnail_image_url || ''} />
            </SidebarContainer>
          )}
          <CourseTabs course={course} />
        </Grid>
        {!mobileMatches && (
          <Grid size={{xs: 12, md: 4}}>
            <CourseSidebar price={course.price} discount={discount} meta={meta} image={course.thumbnail_image_url || ''} />
          </Grid>
        )}
      </Grid>
    </CourseDetailsContainer>
  );
};

export default CourseDetailsPage; 