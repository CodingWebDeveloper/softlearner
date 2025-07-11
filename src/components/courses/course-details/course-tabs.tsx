import { FC, ReactNode, SyntheticEvent, useState } from 'react';
import { Tabs, Typography, Box, List, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TabsContainer, CustomTab, TabPanelContainer, ResourcesDivider } from '@/components/styles/courses/course-details.styles';
import CourseReviews from './course-reviews';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import QuizzesList from './quizzes-list';
import type { BasicCourse } from '@/services/interfaces/service.interfaces';
import PreviewResourceList from './preview-resource-list';

interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`course-tabpanel-${index}`}
    aria-labelledby={`course-tab-${index}`}
    {...other}
  >
    {value === index && <TabPanelContainer>{children}</TabPanelContainer>}
  </div>
);

// Mock data for course content
const quizzes = [
  { title: 'HTML and CSS Quiz', questions: 20 },
];

const CourseTabs: FC<{ course: BasicCourse }> = ({ course }) => {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const DESCRIPTION_LABEL = isMobile ? 'Description' : 'About the Course';
  const RESOURCES_LABEL = isMobile ? 'Resources' : 'Course Content';
  const REVIEWS_LABEL = 'Reviews';
  
    const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <TabsContainer>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="Course Details Tabs"
        TabIndicatorProps={{ style: { backgroundColor: theme.palette.custom.accent.blue, height: 3, borderRadius: 2 } }}
      >
        <CustomTab label={DESCRIPTION_LABEL} id="course-tab-0" aria-controls="course-tabpanel-0" tabIndex={0} />
        <CustomTab label={RESOURCES_LABEL} id="course-tab-1" aria-controls="course-tabpanel-1" tabIndex={0} />
        <CustomTab label={REVIEWS_LABEL} id="course-tab-2" aria-controls="course-tabpanel-2" tabIndex={0} />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <Box
          component="section"
          aria-label="Description"
        >
          <Typography
            component="div"
            variant="body1"
            tabIndex={0}
            aria-label="Markdown Content"
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(course.description || '') as string),
            }}
          />
        </Box>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {/* Modules Section */}
        <PreviewResourceList courseId={course.id || ''} />
        <ResourcesDivider />
        <QuizzesList quizzes={quizzes} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
     <CourseReviews />
      </TabPanel>
    </TabsContainer>
  );
};

export default CourseTabs; 