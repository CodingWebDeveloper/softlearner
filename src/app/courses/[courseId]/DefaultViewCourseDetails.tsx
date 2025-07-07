import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import CourseHeader from './CourseHeader';
import CourseSidebar from './CourseSidebar';
import CourseTabs from './CourseTabs';
import { SidebarSticky, CourseDetailsContainer } from './courseDetails.styled';
import { useMediaQuery } from '@mui/material';
import { SidebarContainer } from '../courses.styled';

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

export default DefaultViewCourseDetails; 