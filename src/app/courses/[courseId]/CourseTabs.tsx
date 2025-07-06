import React from 'react';
import { Tabs, Tab, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TabsContainer, CustomTab, TabIndicator, SectionTitle, ListItemStyled, ListItemTextStyled, DurationText, QuestionsText } from './courseDetails.styled';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';

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
    {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
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

const CourseTabs: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  const theme = useTheme();
  
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
        <CustomTab label="About the Course" id="course-tab-0" aria-controls="course-tabpanel-0" tabIndex={0} />
        <CustomTab label="Course Content" id="course-tab-1" aria-controls="course-tabpanel-1" tabIndex={0} />
        <CustomTab label="Reviews" id="course-tab-2" aria-controls="course-tabpanel-2" tabIndex={0} />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <Typography variant="body1">
          This is a comprehensive course on advanced funnels with Google Analytics. You will learn how to set up, analyze, and optimize funnels for maximum conversion.
        </Typography>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {/* Modules Section */}
        <SectionTitle variant="subtitle2" fontWeight={700}>Modules</SectionTitle>
        <List disablePadding>
          {modules.map((mod, idx) => (
            <ListItemStyled key={mod.title} tabIndex={0} aria-label={mod.title} divider={idx !== modules.length - 1}>
              <ListItemIcon sx={{ minWidth: 36, color: theme.palette.custom.accent.blue }}>
                <MenuBookOutlinedIcon />
              </ListItemIcon>
              <ListItemTextStyled primary={mod.title} />
            </ListItemStyled>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        {/* Lectures Section */}
        <SectionTitle variant="subtitle2" fontWeight={700}>Lectures</SectionTitle>
        <List disablePadding>
          {lectures.map((lec, idx) => (
            <ListItemStyled key={lec.title} tabIndex={0} aria-label={lec.title} divider={idx !== lectures.length - 1}>
              <ListItemIcon sx={{ minWidth: 36, color: theme.palette.custom.accent.blue }}>
                <PlayCircleOutlineIcon />
              </ListItemIcon>
              <ListItemTextStyled primary={lec.title} />
              <DurationText>{lec.duration}</DurationText>
            </ListItemStyled>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        {/* Quizzes Section */}
        <SectionTitle variant="subtitle2" fontWeight={700}>Quizzes</SectionTitle>
        <List disablePadding>
          {quizzes.map((quiz, idx) => (
            <ListItemStyled key={quiz.title} tabIndex={0} aria-label={quiz.title} divider={idx !== quizzes.length - 1}>
              <ListItemIcon sx={{ minWidth: 36, color: theme.palette.custom.accent.blue }}>
                <QuizOutlinedIcon />
              </ListItemIcon>
              <ListItemTextStyled primary={quiz.title} />
              <QuestionsText>{quiz.questions} questions</QuestionsText>
            </ListItemStyled>
          ))}
        </List>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Typography variant="body1">Reviews go here (mock).</Typography>
      </TabPanel>
    </TabsContainer>
  );
};

export default CourseTabs; 