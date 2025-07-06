import { Box, Typography, TypographyProps, Button, Tab, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

export const DiscountedPrice = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.custom.accent.teal,
  fontWeight: 700,
  fontSize: '2rem',
}));

export const OldPrice = styled(Typography)<TypographyProps>(({ theme }) => ({
  textDecoration: 'line-through',
  color: theme.palette.custom.text.light,
  marginLeft: theme.spacing(1),
  fontSize: '1.1rem',
}));

export const FeatureBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginRight: theme.spacing(4),
  marginBottom: theme.spacing(2),
}));

export const InstructorBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
}));

export const MetaItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  color: theme.palette.custom.text.light,
}));

export const TabsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  maxWidth: 800,
  color: theme.palette.custom.text.white,
}));

export const SidebarPreviewBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 120,
  background: theme.palette.custom.background.tertiary,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

export const CardStyled = styled(Box)(({ theme }) => ({
  background: theme.palette.custom.background.secondary,
  borderRadius: 12,
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  color: theme.palette.custom.text.white,
  padding: theme.spacing(3),
}));

export const SidebarSticky = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: 32,
  zIndex: 2,
  width: '100%',
  height: '100vh',
  maxHeight: 'calc(100vh - 32px)',
  overflowY: 'auto',
  background: 'inherit',
  [theme.breakpoints.down('md')]: {
    position: 'static',
    top: 'auto',
    height: 'auto',
    maxHeight: 'none',
    overflowY: 'visible',
  },
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

export const CourseTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
}));

export const InstructorName = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
}));

export const InstructorRole = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.accent.blue,
}));

export const AddToCartButton = styled(Button)(({ theme }) => ({
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  fontWeight: 600,
  fontSize: '1.1rem',
  marginBottom: theme.spacing(2),
}));

export const MetaItemText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  variant: 'body2',
}));

export const PreviewIcon = styled(PlayCircleOutlineIcon)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  fontSize: 48,
}));

export const CustomTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  '&.Mui-selected': {
    color: theme.palette.custom.accent.blue,
  },
  fontWeight: 500,
  fontSize: '1rem',
  textTransform: 'none',
  letterSpacing: 0.5,
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  color: theme.palette.custom.text.light,
}));

export const ListItemStyled = styled(ListItem)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  paddingLeft: 0,
  paddingRight: 0,
}));

export const ListItemTextStyled = styled(ListItemText)(({ theme }) => ({
  '& .MuiListItemText-primary': {
    fontWeight: 500,
    color: theme.palette.custom.text.light,
  },
}));

export const DurationText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  variant: 'body2',
  minWidth: 60,
  textAlign: 'right',
}));

export const QuestionsText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  variant: 'body2',
  minWidth: 80,
  textAlign: 'right',
}));

export const CourseDetailsContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2, 6),
  background: theme.palette.custom.background.dark,
  minHeight: '100vh',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
})); 