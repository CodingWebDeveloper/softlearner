'use client';

import { FC } from 'react';
import { Box, Typography, Avatar, useTheme } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/index';
import { toggleBookmark } from '@/lib/store/features/courseMaterialsSlice';
import { VideoSection, VideoEmbed, BookmarkButton, InstructorBox } from '@/components/styles/courses/materials.styles';

interface Instructor {
  name: string;
  avatar: string;
  bio: string;
  rating: number;
  reviews: number;
}

interface Video {
  id: number;
  title: string;
  youtubeId: string;
}

interface CourseVideoSectionProps {
  courseTitle: string;
  courseDescription: string;
  instructor: Instructor;
  videoList: Video[];
}

const CourseVideoSection: FC<CourseVideoSectionProps> = ({
  courseTitle,
  courseDescription,
  instructor,
  videoList,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const bookmarked = useSelector((state: RootState) => state.courseMaterials.bookmarked);
  const currentVideoId = useSelector((state: RootState) => state.courseMaterials.currentVideoId);

  const currentVideo = videoList.find((v) => v.id === currentVideoId) || videoList[0];

  const handleBookmark = () => {
    dispatch(toggleBookmark());
  };

  return (
    <VideoSection>
      <VideoEmbed>
        <iframe
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${currentVideo.youtubeId}`}
          title={currentVideo.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </VideoEmbed>
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
        <Typography variant="h5" fontWeight={600} style={{ color: theme.palette.custom.text.white }}>
          {courseTitle}
        </Typography>
        <BookmarkButton
          aria-label={bookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
          onClick={handleBookmark}
        >
          {bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon color="action" />}
        </BookmarkButton>
      </Box>
      <Typography variant="body1" style={{ color: theme.palette.custom.text.light }} mt={2}>
        {courseDescription}
      </Typography>
      <InstructorBox>
        <Avatar src={instructor.avatar} alt={instructor.name} />
        <Box ml={2}>
          <Typography variant="subtitle1" fontWeight={500} style={{ color: theme.palette.custom.text.white }}>{instructor.name}</Typography>
          <Typography variant="body2" style={{ color: theme.palette.custom.text.light }}>{instructor.bio}</Typography>
          <Typography variant="caption" style={{ color: theme.palette.custom.text.light }}>
            {instructor.rating} ★ ({instructor.reviews} reviews)
          </Typography>
        </Box>
      </InstructorBox>
    </VideoSection>
  );
};

export default CourseVideoSection; 