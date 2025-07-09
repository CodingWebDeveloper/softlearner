import { styled } from '@mui/material/styles';
import { Box, Card, CardMedia, Chip, Typography, Divider, IconButton, TextField, CardContent, Select, InputLabel, Autocomplete, Alert, FormControl } from '@mui/material';
import MuiPagination from '@mui/material/Pagination';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

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
  color: theme.palette.custom.text.white
}));

export const TagChip = styled(Chip)(({ theme }) => ({
  background: theme.palette.custom.background.filter,
  color: theme.palette.custom.accent.teal,
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
  background: theme.palette.custom.background.card,
  border: '1.5px solid rgba(255,255,255,0.08)',
  color: theme.palette.custom.text.white,
  borderRadius: '16px',
  padding: theme.spacing(3),
  boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
  width: '100%',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  alignItems: isMobile ? 'stretch' : 'flex-start',
  position: 'relative',
  cursor: 'pointer',
  "&:hover": {
    backgroundColor: theme.palette.custom.background.tertiary,
    transform: "translateY(-2px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
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
  color: theme.palette.custom.accent.teal,
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
  background: theme.palette.custom.background.dark,
  minHeight: '100vh',
  overflowX: 'hidden',
}));

export const SearchTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& input': { color: theme.palette.custom.text.white },
  '& label': { color: theme.palette.custom.text.white },
  '& .MuiOutlinedInput-root': {
    background: theme.palette.custom.background.secondary,
    color: theme.palette.custom.text.white,
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

export const TagsContainer = styled(Box)(({ theme }) => ({
  marginBottom: 16,
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
}));

export const RatingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 8,
}));

export const BookmarkIconStyled = styled(BookmarkIcon)(({ theme }) => ({
  color: theme.palette.custom.accent.teal,
}));

export const PersonIconStyled = styled(PersonIcon)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  marginRight: theme.spacing(1),
}));

export const NoCoursesMessage = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  textAlign: 'center',
}));

export const CategorySelect = styled(Select)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  background: theme.palette.custom.background.secondary,
  '& .MuiSelect-icon': {
    color: theme.palette.custom.accent.teal
  },
  height: "100%"
}));

export const CategoryInputLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.custom.text.white,
}));

export const TagsAutocompleteContainer = styled(Box)(({ theme }) => ({
  minWidth: 160,
  background: theme.palette.custom.background.secondary,
  color: theme.palette.custom.text.white,
  '& .MuiAutocomplete-endAdornment': {
    color: theme.palette.custom.accent.teal
  },
}));

export const TagsTextField = styled(TextField)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  background: theme.palette.custom.background.secondary,
  minWidth: 160,
  '& .MuiAutocomplete-endAdornment': {
    color: theme.palette.custom.accent.teal
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.custom.text.white
  },
}));

export const TagChipStyled = styled(Chip)(({ theme }) => ({
  background: theme.palette.custom.background.filter,
  color: theme.palette.custom.accent.teal,
  fontWeight: 500,
  fontSize: 15,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: 2,
  paddingBottom: 2,
  borderRadius: '20px',
}));

export const CloseIconStyled = styled(CloseRoundedIcon)(({ theme }) => ({
  color: theme.palette.custom.accent.teal,
  fontSize: 18,
}));

export const ExtraTagChip = styled(Chip)(({ theme }) => ({
  background: theme.palette.custom.background.filter,
  color: theme.palette.custom.text.white,
  fontWeight: 500,
  fontSize: 15,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: 2,
  paddingBottom: 2,
  borderRadius: '20px',
}));

export const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(4),
}));

export const StyledPagination = styled(MuiPagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    color: theme.palette.custom.text.white,
    borderColor: theme.palette.custom.accent.teal,
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.custom.accent.teal,
    color: theme.palette.custom.background.card,
  },
}));

export const SidebarContainer = styled(Box)(({ theme }) => ({
  paddingBlock: theme.spacing(2),
}));

export const AlertStyled = styled(Alert)({
  marginBottom: "16px"
})

export const TextLightText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light
}));

export const BookmarkBorderIconStyled = styled(BookmarkBorderIcon)(({ theme }) => ({
  color: theme.palette.custom.accent.teal,
}));

export const FormControlStyled = styled(FormControl)(({ theme }) => ({
  minWidth: 120,
}));

export const ArrowDropDownIconStyled = styled(ArrowDropDownIcon)(({ theme }) => ({
  color: theme.palette.custom.accent.teal,
}));
