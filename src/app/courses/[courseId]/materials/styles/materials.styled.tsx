import { styled } from '@mui/material/styles';
import { Box, IconButton, Tab, ListItem, ListItemText, Typography } from '@mui/material';

export const CourseMaterialsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(4),
  width: '100%',
  maxWidth: 1400,
  margin: '0 auto',
  padding: theme.spacing(4, 2),
  background: theme.palette.custom.background.dark,
  color: theme.palette.custom.text.light,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2, 0),
  },
}));

export const VideoSection = styled(Box)(({ theme }) => ({
  flex: 2,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  background: theme.palette.custom.background.card,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  padding: theme.spacing(3),
  color: theme.palette.custom.text.white,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

export const VideoEmbed = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '56.25%', // 16:9 aspect ratio
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  background: theme.palette.custom.background.secondary,
  '& iframe': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 0,
    borderRadius: theme.shape.borderRadius,
  },
}));

export const BookmarkButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  borderRadius: '50%',
  background: theme.palette.custom.background.tertiary,
  color: theme.palette.custom.accent.blue,
  '&:hover': {
    background: theme.palette.custom.accent.blue,
    color: theme.palette.custom.text.white,
  },
}));

export const InstructorBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(3),
  gap: theme.spacing(2),
  color: theme.palette.custom.text.light,
}));

export const VideoListSection = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 320,
  background: theme.palette.custom.background.card,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  padding: theme.spacing(3),
  color: theme.palette.custom.text.light,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
    minWidth: 0,
  },
}));

export const TabPanel = ({ children, value, index, ...other }: any) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box pt={2}>{children}</Box>}
    </div>
  );
};

export const StyledTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  textTransform: 'none',
  color: selected ? theme.palette.custom.text.white : theme.palette.custom.text.light,
  fontWeight: selected ? 600 : 400,
}));

export const StyledVideoListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  background: selected ? theme.palette.action.selected : 'none',
}));

export const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  '& .MuiListItemText-primary': {
    color: selected ? theme.palette.custom.text.white : theme.palette.custom.text.light,
    fontWeight: selected ? 600 : 400,
  },
  '& .MuiListItemText-secondary': {
    color: theme.palette.custom.text.light,
  },
}));

export const StyledVideoNumber = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  color: theme.palette.custom.text.light,
  fontWeight: selected ? 600 : 400,
})); 