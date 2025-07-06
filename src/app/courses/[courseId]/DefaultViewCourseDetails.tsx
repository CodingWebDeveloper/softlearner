import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import CourseHeader from './CourseHeader';
import CourseSidebar from './CourseSidebar';
import CourseTabs from './CourseTabs';
import { SidebarSticky, CourseDetailsContainer } from './courseDetails.styled';

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

const DefaultViewCourseDetails: React.FC = () => {
  const theme = useTheme();
  
  return (
    <CourseDetailsContainer>
      <Grid container spacing={6} alignItems="start">
        <Grid size={{xs: 12, md: 8}}>
          <CourseHeader title={mockCourse.title} instructor={mockCourse.instructor} />
          <CourseTabs />
        </Grid>
        <Grid size={{xs: 12, md: 4}}>
          <SidebarSticky>
            <CourseSidebar price={mockCourse.price} discount={mockCourse.discount} meta={mockCourse.meta} image={mockCourse.image} />
          </SidebarSticky>
        </Grid>
      </Grid>
    </CourseDetailsContainer>
  );
};

export default DefaultViewCourseDetails; 