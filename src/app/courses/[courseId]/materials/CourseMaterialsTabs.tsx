'use client';
import React from 'react';
import { Tabs, Typography, List, ListItemAvatar, Avatar, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/index';
import { setTab, setCurrentVideo, selectCurrentVideoId } from '@/lib/store/features/courseMaterialsSlice';
import { VideoListSection, TabPanel, StyledTab, StyledVideoListItem, StyledListItemText, StyledVideoNumber } from './styles/materials.styled';

interface Video {
  id: number;
  title: string;
  duration: string;
  youtubeId: string;
}

interface CourseMaterialsTabsProps {
  videoList: Video[];
}

const TABS = [
  { label: 'All Videos', value: 0 },
  { label: 'Resources', value: 1 },
  { label: 'Quizzes', value: 2 },
];

const CourseMaterialsTabs: React.FC<CourseMaterialsTabsProps> = ({ videoList }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const tab = useSelector((state: RootState) => state.courseMaterials.tab);
  const currentVideoId = useSelector(selectCurrentVideoId);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
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
        <List>
          {videoList.map((video) => (
            <StyledVideoListItem
              key={video.id}
              component="div"
              role="button"
              tabIndex={0}
              onClick={() => handleVideoSelect(video.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleVideoSelect(video.id);
              }}
              aria-label={`Play ${video.title}`}
              selected={currentVideoId === video.id}
            >
              <ListItemAvatar>
                <Avatar>
                  <StyledVideoNumber selected={currentVideoId === video.id}>{video.id}</StyledVideoNumber>
                </Avatar>
              </ListItemAvatar>
              <StyledListItemText
                primary={video.title}
                secondary={video.duration}
                selected={currentVideoId === video.id}
              />
            </StyledVideoListItem>
          ))}
        </List>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Typography variant="body2" color="inherit">
          Resources will be available soon.
        </Typography>
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Typography variant="body2" color="inherit">
          Quizzes will be available soon.
        </Typography>
      </TabPanel>
    </VideoListSection>
  );
};

export default CourseMaterialsTabs; 