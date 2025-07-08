import { styled } from '@mui/material/styles';
import { Box, IconButton, Tab, ListItem, ListItemText, Typography, LinearProgress, Card, Button } from '@mui/material';
import type { ButtonProps } from '@mui/material/Button';

interface OptionButtonProps extends ButtonProps {
  $selected?: boolean;
}

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
  color: theme.palette.custom.text.black,
  fontWeight: selected ? 600 : 400,
}));

export const ResourcesListContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.custom.background.card,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2, 0),
  overflowY: 'auto',
  maxHeight: '500px',
}));

export const ResourceListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
  cursor: 'pointer',
  '&:hover': {
    background: theme.palette.custom.background.secondary,
  },
}));

export const ResourceIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.custom.accent.blue,
  marginRight: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  fontSize: 22,
}));

export const ResourceTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  fontWeight: 500,
  fontSize: 16,
}));

export const QuizzesListContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.custom.background.card,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2, 0),
}));

export const QuizListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1, 0),
  cursor: 'pointer',
  '&:hover': {
    background: theme.palette.custom.background.secondary,
  },
}));

export const QuizTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  fontWeight: 500,
  fontSize: 16,
  flex: 1,
}));

export const QuizProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: theme.palette.custom.background.secondary,
  border: `1px solid ${theme.palette.custom.accent.blue}`,
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.custom.accent.blue,
  },
  flex: 1,
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
}));

export const QuizDialogCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  background: theme.palette.custom.background.card || theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4, 2),
  color: theme.palette.custom.text.light,
  position: 'relative',
}));

export const QuizDialogPercent = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
  textAlign: 'center',
}));

export const QuizDialogAnswers = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  color: theme.palette.custom.text.light,
  marginBottom: theme.spacing(2),
  textAlign: 'center',
}));

export const QuizDialogNofX = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.custom.text.light,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const QuizQuestionText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
  fontWeight: 500,
  textAlign: 'left',
}));

export const CloseIconButton = styled(IconButton)(({ theme }) => ({
  position: 'relative',
  color: theme.palette.custom.text.light,
  zIndex: 1,
  marginLeft: 'auto',
}));

export const StartButton = styled(Button)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  textTransform: 'none',
}));

export const PreviousButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.custom.text.white,
  '&:hover': {
    background: theme.palette.custom.accent.gray,
    opacity: 0.85,
  },
  '&&.Mui-disabled': {
    background: (theme.palette.custom.accent.gray || '#6b7280') + '99',
    color: theme.palette.custom.text.white,
    opacity: 0.5,
  },
}));

export const NextButton = styled(Button)(({ theme }) => ({
  background: theme.palette.custom.accent.blue,
  color: theme.palette.custom.text.white,
  '&:hover': {
    background: theme.palette.custom.accent.blue,
    opacity: 0.85,
  },
  '&&.Mui-disabled': {
    background: (theme.palette.custom.accent.blue || '#4a90e2') + '99',
    color: theme.palette.custom.text.white,
    opacity: 0.5,
  },
  textTransform: 'none',

}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  background: theme.palette.custom.accent.green,
  color: theme.palette.custom.text.white,
  '&:hover': {
    background: theme.palette.custom.accent.green,
    opacity: 0.85,
  },
  '&&.Mui-disabled': {
    background: (theme.palette.custom.accent.green || '#10b981') + '99',
    color: theme.palette.custom.text.white,
    opacity: 0.5,
  },
}));

export const OptionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== '$selected',
})<OptionButtonProps>(({ theme, $selected }) => ({
  justifyContent: 'flex-start',
  fontSize: '1rem',
  fontWeight: 400,
  textTransform: 'none',
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  boxShadow: $selected ? theme.shadows[2] : 'none',
  background: $selected ? theme.palette.primary.main : 'transparent',
  color: $selected ? theme.palette.custom.text.white : theme.palette.custom.text.light,
  border: $selected ? 'none' : `1.5px solid ${theme.palette.primary.main}`,
  transition: 'background 0.2s, color 0.2s, border 0.2s',
  '&:hover': {
    background: $selected ? theme.palette.primary.dark : theme.palette.action.hover,
    color: theme.palette.custom.text.white,
    border: $selected ? 'none' : `1.5px solid ${theme.palette.primary.dark}`,
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.main}`,
  },
  textAlign: 'start',
}));

export const DialogActionsRow = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
}));

export const OptionListBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const DialogContentBox = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'none',
}));

export const MobileCloseButton = styled(Button)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  marginBottom: 16,
})); 