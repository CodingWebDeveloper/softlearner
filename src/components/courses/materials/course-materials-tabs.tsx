'use client';

import { FC, SyntheticEvent } from 'react';
import { Tabs, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/index';
import { setTab, setCurrentVideo, selectCurrentVideoId } from '@/lib/store/features/courseMaterialsSlice';
import {
  VideoListSection,
  TabPanel,
  StyledTab,
  SectionTitle,
} from '@/components/styles/courses/materials.styles';
import QuizList from './quiz-list';
import ResourceList from './resource-list';
import VideosList from './videos-list';

interface Video {
  id: number;
  title: string;
  duration: string;
  youtubeId: string;
}

interface Resource {
  id: number;
  title: string;
  url: string;
}

interface Quiz {
  id: number;
  title: string;
  progress: number; // percent
}

interface CourseMaterialsTabsProps {
  videoList: Video[];
}

const TABS = [
  { label: 'All Videos', value: 0 },
  { label: 'Resources', value: 1 },
  { label: 'Quizzes', value: 2 },
];

const MOCK_RESOURCES: Resource[] = [
  { id: 1, title: 'Module 1: HTML and CSS', url: '/downloads/module1.pdf' },
  { id: 2, title: 'Module 2: JavaScript Fundamentals', url: '/downloads/module2.pdf' },
  { id: 3, title: 'Module 3: Web Application Development', url: '/downloads/module3.pdf' },
];

const MOCK_QUIZZES: Quiz[] = [
  { id: 1, title: 'Quiz 1: HTML Basics', progress: 100 },
  { id: 2, title: 'Quiz 2: CSS Selectors', progress: 60 },
  { id: 3, title: 'Quiz 3: JavaScript Variables', progress: 0 },
];

const CourseMaterialsTabs: FC<CourseMaterialsTabsProps> = ({ videoList }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const tab = useSelector((state: RootState) => state.courseMaterials.tab);
  const currentVideoId = useSelector(selectCurrentVideoId);

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    dispatch(setTab(newValue));
  };

  const handleVideoSelect = (videoId: number) => {
    dispatch(setCurrentVideo(videoId));
  };

  return (
    <VideoListSection>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="Course Materials Tabs"
        variant="fullWidth"
        TabIndicatorProps={{ style: { backgroundColor: theme.palette.custom.accent.blue } }}
        textColor="inherit"
      >
        {TABS.map((tabItem) => (
          <StyledTab
            key={tabItem.value}
            label={tabItem.label}
            id={`tab-${tabItem.value}`}
            aria-controls={`tabpanel-${tabItem.value}`}
            selected={tab === tabItem.value}
          />
        ))}
      </Tabs>
      <TabPanel value={tab} index={0}>
        <VideosList
          videoList={videoList}
          currentVideoId={currentVideoId}
          handleVideoSelect={handleVideoSelect}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <SectionTitle variant="subtitle1">
          Modules
        </SectionTitle>
        <ResourceList resources={MOCK_RESOURCES} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <QuizList quizzes={MOCK_QUIZZES} />
      </TabPanel>
    </VideoListSection>
  );
};

export default CourseMaterialsTabs; 