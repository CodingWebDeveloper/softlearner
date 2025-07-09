import React from 'react';
import { ListItemAvatar, Avatar } from '@mui/material';
import { StyledVideoListItem, StyledListItemText, StyledVideoNumber, VideoListContainer } from '@/components/styles/courses/materials.styles';

interface Video {
  id: number;
  title: string;
  duration: string;
  youtubeId: string;
}

interface VideosListProps {
  videoList: Video[];
  currentVideoId: number;
  handleVideoSelect: (videoId: number) => void;
}

const VideosList: React.FC<VideosListProps> = ({ videoList, currentVideoId, handleVideoSelect }) => (
  <VideoListContainer>
    {videoList.map((video) => (
      <StyledVideoListItem
        key={video.id}
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
  </VideoListContainer>
);

export default VideosList; 