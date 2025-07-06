// Course Details Page for [courseId]
'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import CourseHeader from './CourseHeader';
import CourseSidebar from './CourseSidebar';
import CourseTabs from './CourseTabs';
import { SidebarSticky, CourseDetailsContainer } from './courseDetails.styled';
import DefaultViewCourseDetails from './DefaultViewCourseDetails';

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
  const hasPurchased = false;
  const theme = useTheme();
  
  if(!hasPurchased){
    return <DefaultViewCourseDetails />;
  }
  
  return (
    <CourseDetailsContainer>
      Purchased Course Details
    </CourseDetailsContainer>
  );
};

export default CourseDetailsPage; 