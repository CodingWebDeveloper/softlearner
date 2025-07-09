// Course Details Page for [courseId]
'use client';

import React from 'react';
import { useTheme } from '@mui/material/styles';

import { CourseDetailsContainer } from '@/components/styles/courses/course-details.styles';
import { Grid, useMediaQuery } from '@mui/material';
import CourseHeader from '@/components/courses/course-header';
import CourseTabs from '@/components/courses/course-tabs';
import CourseSidebar from '@/components/courses/course-sidebar';
import { SidebarContainer } from '@/components/styles/courses/courses.styles';

// Mock data
const mockCourse = {
  title: 'Advanced Funnels with Google Analytics',
  price: 399,
  discount: 0.2, // 20% off
  image: '/public/globe.svg', // Placeholder
 
  instructor: {
    name: 'Sophie Moore',
    role: 'UI/UX Designer',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  meta: {
    level: 'Advanced',
    duration: '5hr 42min',
    videos: 67,
    files: 8,
    lifetime: true,
    deviceAccess: true,
  },
};

const CourseDetailsPage: React.FC = () => {
  // General hooks
  const theme = useTheme();
  const mobileMatches = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <CourseDetailsContainer>
      <Grid container spacing={6} alignItems="start">
        <Grid size={{xs: 12, md: 8}}>
          <CourseHeader title={mockCourse.title} instructor={mockCourse.instructor} />
          {
            mobileMatches && (
              <SidebarContainer>
                <CourseSidebar price={mockCourse.price} discount={mockCourse.discount} meta={mockCourse.meta} image={mockCourse.image} />
              </SidebarContainer>
            )
          }
         
          <CourseTabs />
        </Grid>
        {
          !mobileMatches && (
            <Grid size={{xs: 12, md: 4}}>
              <CourseSidebar price={mockCourse.price} discount={mockCourse.discount} meta={mockCourse.meta} image={mockCourse.image} />
            </Grid>
          )
        }
        
      </Grid>
    </CourseDetailsContainer>
  );
};

export default CourseDetailsPage; 