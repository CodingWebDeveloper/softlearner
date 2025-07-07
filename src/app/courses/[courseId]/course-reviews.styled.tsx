import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar, LinearProgress, TextField, IconButton, List, ListItem, Divider, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export const ReviewsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(4),
  width: '100%',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export const RatingsSummary = styled(Box)(({ theme }) => ({
  minWidth: 260,
  maxWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const RatingValue = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 28,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const RatingCount = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  fontWeight: 500,
  fontSize: 18,
}));

export const RatingBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  flex: 1,
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    backgroundColor: theme.palette.custom.accent.blue,
  },
}));

export const RatingRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const ReviewsList = styled(List)(({ theme }) => ({
  width: '100%',
  background: 'none',
  padding: 0,
}));

export const ReviewItem = styled(ListItem)(({ theme }) => ({
  alignItems: 'flex-start',
  padding: theme.spacing(2, 0),
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },
}));

export const ReviewAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  fontWeight: 700,
  fontSize: 20,
  background: theme.palette.custom.accent.blue,
  color: theme.palette.getContrastText(theme.palette.custom.accent.blue),
}));

export const ReviewContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const ReviewHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const ReviewName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 16,
}));

export const ReviewDate = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  fontSize: 14,
}));

export const ReviewText = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.custom.text.white,
}));

export const HelpfulActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const SearchBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  width: '100%',
  maxWidth: 320,
}));

export const NoReviewsBox = styled(Box)(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  color: theme.palette.custom.text.light,
  padding: theme.spacing(4, 0),
}));

export const SearchInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: theme.palette.custom.background.tertiary,
    color: theme.palette.custom.text.white,
    borderRadius: 8,
    border: `1px solid ${theme.palette.custom.background.filter}`,
  },
  '& .MuiInputBase-input': {
    color: theme.palette.custom.text.white,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.custom.background.filter,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.custom.accent.blue,
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.custom.text.light,
  },
}));

export const HelpfulText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  fontSize: 15,
  marginRight: theme.spacing(1),
}));

export const HelpfulButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  '&:hover': {
    color: theme.palette.custom.accent.blue,
    backgroundColor: theme.palette.action.hover,
  },
  borderRadius: 6,
  padding: theme.spacing(0.5),
}));

export const ShowMoreContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

export const ShowMoreButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.custom.accent.blue,
  color: theme.palette.custom.text.white,
  fontWeight: 600,
  borderRadius: 8,
  padding: theme.spacing(1.2, 4),
  textTransform: 'none',
  fontSize: 16,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: theme.palette.custom.accent.tealDark,
    color: theme.palette.custom.text.white,
  },
}));

export const StarRatingRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(1),
}));

export const StarIconStyled = styled(StarIcon)<{ filled?: boolean }>(({ theme, filled }) => ({
  color: filled ? theme.palette.custom.accent.yellow : theme.palette.custom.text.light,
  fontSize: 18,
}));

export const ReviewStarsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(1),
})); 