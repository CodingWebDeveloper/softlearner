import { styled } from '@mui/material/styles';
import { Box, Card, CardMedia, Chip, Typography, Divider, IconButton, TextField, CardContent } from '@mui/material';

export const FilterBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  marginBottom: theme.spacing(3),
}));

export const FilterLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginRight: theme.spacing(1),
}));

export const TagChip = styled(Chip)(({ theme }) => ({
  background: '#263238',
  color: '#4ecdc4',
  fontWeight: 500,
  fontSize: 15,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: 2,
  paddingBottom: 2,
  borderRadius: '20px',
  marginRight: theme.spacing(1),
}));

export const CourseCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{
  isMobile?: boolean;
}>(({ isMobile, theme }) => ({
  background: '#23242a',
  border: '1.5px solid rgba(255,255,255,0.08)',
  color: '#fff',
  borderRadius: '16px',
  padding: theme.spacing(3),
  boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
  width: '100%',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  alignItems: isMobile ? 'stretch' : 'flex-start',
  position: 'relative',
}));

export const CardImage = styled(CardMedia, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{
  isMobile?: boolean;
}>(({ isMobile, theme }) => ({
  width: isMobile ? '100%' : 120,
  height: isMobile ? 160 : 120,
  borderRadius: 2,
  objectFit: 'cover',
  marginBottom: isMobile ? theme.spacing(2) : 0,
  marginRight: isMobile ? 0 : theme.spacing(3),
}));

export const BottomRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(3),
}));

export const BookmarkButton = styled(IconButton)(({ theme }) => ({
  color: '#4ecdc4',
  background: 'rgba(36,37,44,0.7)',
  borderRadius: '50%',
  padding: theme.spacing(1),
  marginRight: theme.spacing(2),
}));

export const EnrolledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(2),
}));

export const VerticalDivider = styled(Divider)(({ theme }) => ({
  borderColor: 'rgba(255,255,255,0.12)',
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  height: 28,
}));

export const CoursesPageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '0 auto',
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  background: '#1a1b23',
  minHeight: '100vh',
  overflowX: 'hidden',
}));

export const SearchTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& input': { color: '#fff' },
  '& label': { color: '#fff' },
  '& .MuiOutlinedInput-root': {
    background: '#252730',
    color: '#fff',
  },
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

export const CardContentTop = styled(Box)(({ theme }) => ({
  // No extra styles for now, but can be extended
}));

export const CoursesListContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}));

export const CourseListItemBox = styled(Box)(({ theme }) => ({
  width: '100%',
})); 