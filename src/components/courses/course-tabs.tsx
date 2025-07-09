import React from 'react';
import { Tabs, Tab, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TabsContainer, CustomTab, SectionTitle, ListItemStyled, ListItemTextStyled, DurationText, QuestionsText, TabPanelContainer, ListItemIconStyled, ResourcesDivider } from '@/components/styles/courses/course-details.styles';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import CourseReviews from './course-reviews';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
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
const modules = [
  { title: 'Module 1: HTML and CSS' },
  { title: 'Module 2: JavaScript Fundamentals' },
  { title: 'Module 3: Web Application Development' },
];
const lectures = [
  { title: 'Introduction to HTML', duration: '45 min' },
  { title: 'CSS Basics', duration: '60 min' },
  { title: 'JavaScript Fundamentals', duration: '90 min' },
];
const quizzes = [
  { title: 'HTML and CSS Quiz', questions: 20 },
];

// About the Course Markdown description
const ABOUT_COURSE_MD = `
This is a **comprehensive course** on _advanced funnels_ with Google Analytics.

You will learn how to:
- Set up funnels
- Analyze funnel performance
- Optimize for maximum conversion

> _Master your analytics and boost your results!_
`;

const CourseTabs: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const DESCRIPTION_LABEL = isMobile ? 'Description' : 'About the Course';
  const RESOURCES_LABEL = isMobile ? 'Resources' : 'Course Content';
  const REVIEWS_LABEL = 'Reviews';
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
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
          aria-label="About the Course Description"
        >
          <Typography
            component="div"
            variant="body1"
            tabIndex={0}
            aria-label="About the Course Markdown Content"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked.parse(ABOUT_COURSE_MD) as string),
            }}
          />
        </Box>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {/* Modules Section */}
        <SectionTitle variant="subtitle2" fontWeight={700}>Modules</SectionTitle>
        <List disablePadding>
          {modules.map((mod, idx) => (
            <ListItemStyled key={mod.title} tabIndex={0} aria-label={mod.title} divider={idx !== modules.length - 1}>
              <ListItemIconStyled>
                <MenuBookOutlinedIcon />
              </ListItemIconStyled>
              <ListItemTextStyled primary={mod.title} />
            </ListItemStyled>
          ))}
        </List>
        <ResourcesDivider />
        {/* Lectures Section */}
        <SectionTitle variant="subtitle2" fontWeight={700}>Lectures</SectionTitle>
        <List disablePadding>
          {lectures.map((lec, idx) => (
            <ListItemStyled key={lec.title} tabIndex={0} aria-label={lec.title} divider={idx !== lectures.length - 1}>
              <ListItemIconStyled>
                <PlayCircleOutlineIcon />
              </ListItemIconStyled>
              <ListItemTextStyled primary={lec.title} />
              <DurationText>{lec.duration}</DurationText>
            </ListItemStyled>
          ))}
        </List>
        <ResourcesDivider />
        {/* Quizzes Section */}
        <SectionTitle variant="subtitle2" fontWeight={700}>Quizzes</SectionTitle>
        <List disablePadding>
          {quizzes.map((quiz, idx) => (
            <ListItemStyled key={quiz.title} tabIndex={0} aria-label={quiz.title} divider={idx !== quizzes.length - 1}>
              <ListItemIconStyled>
                <QuizOutlinedIcon />
              </ListItemIconStyled>
              <ListItemTextStyled primary={quiz.title} />
              <QuestionsText>{quiz.questions} questions</QuestionsText>
            </ListItemStyled>
          ))}
        </List>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <CourseReviews />
      </TabPanel>
    </TabsContainer>
  );
};

export default CourseTabs; 