'use client'
import CourseVideoSection from './CourseVideoSection';
import CourseMaterialsTabs from './CourseMaterialsTabs';

// --- Constants ---
const COURSE_TITLE = 'The Ultimate Guide to Usability Testing and UX Law';
const COURSE_DESCRIPTION = `In this comprehensive course, we'll delve into the fundamentals of usability testing and explore the critical principles of UX law. Whether you're a seasoned UX professional or just starting your journey, this course is designed to provide you with the essential skills and knowledge needed to excel in the field.`;
const INSTRUCTOR = {
  name: 'David Travis',
  avatar: '/public/globe.svg', // Replace with actual avatar if available
  bio: `I'm on a mission to create more user experience professionals. Perhaps you'd like a job in user experience. Or maybe you already work in the field but you've never had any formal training.`,
  rating: 4.7,
  reviews: 1534,
};
const VIDEO_LIST = [
  { id: 1, title: 'Introduction to Usability Testing', duration: '0:23', youtubeId: 'dQw4w9WgXcQ' },
  { id: 2, title: 'Usability Tests: Goals and More', duration: '0:11', youtubeId: '3JZ_D3ELwOQ' },
  { id: 3, title: 'Creating Usability Testing Scenarios', duration: '7:32', youtubeId: 'V-_O7nl0Ii0' },
  { id: 4, title: 'Analyzing Usability Test Results', duration: '6:43', youtubeId: 'e-ORhEE9VVg' },
  { id: 5, title: 'Iterative Design and Usability Testing', duration: '2:56', youtubeId: 'L_jWHffIx5E' },
  { id: 6, title: 'Introduction to UX Law', duration: '1:23', youtubeId: 'hY7m5jjJ9mM' },
  { id: 7, title: 'Privacy Laws and User Data Protection', duration: '2:34', youtubeId: 'tVj0ZTS4WF4' },
  { id: 8, title: 'Accessibility Standards and Guidelines', duration: '8:21', youtubeId: 'kXYiU_JCYtU' },
  { id: 9, title: 'Usability Testing and Legal Compliance', duration: '2:11', youtubeId: 'RgKAFK5djSk' },
  { id: 10, title: 'Designing Ethical User Experiences', duration: '3:42', youtubeId: 'OPf0YbXqDm0' },
  { id: 11, title: 'Managing Legal Risks in UX Design', duration: '1:34', youtubeId: 'YQHsXMglC9A' },
  { id: 12, title: 'Creating a UX Law Compliance Plan', duration: '1:23', youtubeId: '60ItHLz5WEA' },
];

import { CourseMaterialsContainer } from './styles/materials.styled';

const CourseMaterialsPage = () => {
  return (
    <CourseMaterialsContainer>
      <CourseVideoSection
        courseTitle={COURSE_TITLE}
        courseDescription={COURSE_DESCRIPTION}
        instructor={INSTRUCTOR}
        videoList={VIDEO_LIST}
      />
      <CourseMaterialsTabs
        videoList={VIDEO_LIST}
      />
    </CourseMaterialsContainer>
  );
};

export default CourseMaterialsPage; 