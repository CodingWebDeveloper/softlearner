import { styled } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Tab,
  ListItem,
  ListItemText,
  Typography,
  LinearProgress,
  Card,
  Button,
  Paper,
} from "@mui/material";
import type { ButtonProps } from "@mui/material/Button";

interface OptionButtonProps extends ButtonProps {
  $selected?: boolean;
}

export const CourseMaterialsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(4),
  width: "100%",
  maxWidth: 1400,
  margin: "0 auto",
  padding: theme.spacing(4, 2),
  background: theme.palette.custom.background.dark,
  color: theme.palette.custom.text.light,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    gap: theme.spacing(2),
    padding: theme.spacing(2, 0),
  },
}));

export const VideoSection = styled(Box)(({ theme }) => ({
  flex: 2,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  background: theme.palette.custom.background.card,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  padding: theme.spacing(3),
  color: theme.palette.custom.text.white,
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
}));

export const VideoEmbed = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  paddingTop: "56.25%", // 16:9 aspect ratio
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  background: theme.palette.custom.background.secondary,
  "& iframe": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: 0,
    borderRadius: theme.shape.borderRadius,
  },
}));

export const BookmarkButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  borderRadius: "50%",
  background: theme.palette.custom.background.tertiary,
  color: theme.palette.custom.accent.blue,
  "&:hover": {
    background: theme.palette.custom.accent.blue,
    color: theme.palette.custom.text.white,
  },
}));

export const InstructorBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
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
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
    minWidth: 0,
  },
}));

export const StyledTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected?: boolean }>(({ theme, selected }) => ({
  textTransform: "none",
  color: selected
    ? theme.palette.custom.text.white
    : theme.palette.custom.text.light,
  fontWeight: selected ? 600 : 400,
}));

export const ResourceMaterialItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: "pointer",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  background: selected ? theme.palette.action.selected : "none",
}));

export const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected?: boolean }>(({ theme, selected }) => ({
  "& .MuiListItemText-primary": {
    color: selected
      ? theme.palette.custom.text.white
      : theme.palette.custom.text.light,
    fontWeight: selected ? 600 : 400,
  },
  "& .MuiListItemText-secondary": {
    color: theme.palette.custom.text.light,
  },
}));

export const StyledVideoNumber = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected?: boolean }>(({ theme, selected }) => ({
  color: theme.palette.custom.text.black,
  fontWeight: selected ? 600 : 400,
}));

export const ResourcesListContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.custom.background.card,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2, 0),
  overflowY: "auto",
  maxHeight: "500px",
}));

export const ResourceListItem = styled(ListItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1, 0),
  cursor: "pointer",
  "&:hover": {
    background: theme.palette.custom.background.secondary,
  },
}));

export const ResourceIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.custom.accent.blue,
  marginRight: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  fontSize: 22,
}));

export const ResourceTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  fontWeight: 500,
  fontSize: 16,
}));

export const ResourceDuration = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

export const ResourceSummary = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  fontStyle: "italic",
}));

export const QuizzesListContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: "100%",
  padding: "16px",
}));

export const QuizListItem = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  backgroundColor: theme.palette.custom.background.card,
  borderRadius: "8px",
  cursor: "pointer",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: theme.palette.custom.background.tertiary,
  },

  "&:focus": {
    outline: `2px solid ${theme.palette.custom.accent.teal}`,
    outlineOffset: "2px",
  },
}));

export const QuizTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  fontSize: "1rem",
  fontWeight: 500,
  marginBottom: "12px",
}));

export const QuizProgressBar = styled(LinearProgress)(({ theme }) => ({
  flexGrow: 1,
  height: "8px",
  borderRadius: "4px",
  backgroundColor: theme.palette.custom.background.tertiary,

  "& .MuiLinearProgress-bar": {
    backgroundColor: theme.palette.custom.accent.teal,
    borderRadius: "4px",
  },
}));

// Quiz Dialog Styles
export const QuizDialogCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "24px",
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
  height: "100%",
  backgroundColor: theme.palette.custom.background.card,
  borderRadius: "12px",
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
    gap: "16px",
  },
}));

export const DialogContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  height: "fit-content",
  padding: "24px",
  // backgroundColor: theme.palette.custom.background.dark,
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
  },
}));

export const QuizTopBar = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  width: "100%",
}));

export const CloseIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  "&:hover": {
    color: theme.palette.custom.text.white,
    backgroundColor: theme.palette.custom.background.tertiary,
  },
}));

export const MobileCloseButton = styled(Button)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  "&:hover": {
    color: theme.palette.custom.text.white,
    backgroundColor: "transparent",
  },
}));

export const QuizDialogPercent = styled(Typography)(({ theme }) => ({
  fontSize: "48px",
  fontWeight: "bold",
  color: theme.palette.custom.accent.teal,
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "36px",
  },
}));

export const QuizDialogAnswers = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  color: theme.palette.custom.text.light,
  textAlign: "center",
  marginTop: "-16px",
}));

export const QuizDialogNofX = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  textAlign: "center",
  fontSize: "14px",
}));

export const QuizQuestionText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.white,
  fontSize: "20px",
  lineHeight: 1.4,
  textAlign: "left",
  [theme.breakpoints.down("sm")]: {
    fontSize: "18px",
  },
}));

export const OptionListBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "100%",
}));

export const OptionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "$selected",
})<OptionButtonProps>(({ theme, $selected }) => ({
  padding: "16px",
  textAlign: "left",
  justifyContent: "flex-start",
  lineHeight: 1.4,
  textTransform: "none",
  backgroundColor: $selected
    ? theme.palette.custom.background.tertiary
    : "transparent",
  color: $selected
    ? theme.palette.custom.accent.teal
    : theme.palette.custom.text.light,
  border: `1px solid ${
    $selected
      ? theme.palette.custom.accent.teal
      : theme.palette.custom.background.tertiary
  }`,

  "&:hover": {
    backgroundColor: theme.palette.custom.background.tertiary,
    borderColor: theme.palette.custom.accent.teal,
  },
}));

export const DialogActionsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  marginTop: "auto",
  width: "100%",
}));

const BaseButton = styled(Button)(({ theme }) => ({
  padding: "12px 24px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: 500,
  borderRadius: "8px",
}));

export const StartButton = styled(BaseButton)(({ theme }) => ({
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.custom.text.white,
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.tealDark,
  },
}));

export const PreviousButton = styled(BaseButton)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  borderColor: theme.palette.custom.background.tertiary,
  "&:hover": {
    borderColor: theme.palette.custom.accent.teal,
    backgroundColor: theme.palette.custom.background.tertiary,
  },
  "&.Mui-disabled": {
    color: theme.palette.custom.text.light,
    backgroundColor: "transparent",
    opacity: 0.5,
  },
}));

export const NextButton = styled(BaseButton)(({ theme }) => ({
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.custom.text.white,
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.tealDark,
  },
  "&.Mui-disabled": {
    backgroundColor: theme.palette.custom.background.tertiary,
    color: theme.palette.custom.text.light,
  },
}));

export const SubmitButton = styled(NextButton)``;

export const QuizProgressContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  width: "100%",
}));

export const QuizProgressText = styled(Typography)(({ theme }) => ({
  color: theme.palette.custom.text.light,
  minWidth: "45px",
  textAlign: "right",
}));

export const VideoListContainer = styled(Box)({
  overflowY: "auto",
  maxHeight: "500px",
});

export const DownloadSection = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 360,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.custom.background.secondary,
  borderRadius: theme.shape.borderRadius,
  gap: theme.spacing(2),
}));

export const DownloadLink = styled("a")(({ theme }) => ({
  backgroundColor: theme.palette.custom.accent.teal,
  color: theme.palette.custom.text.white,
  padding: theme.spacing(2, 4),
  borderRadius: theme.shape.borderRadius,
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontFamily: theme.typography.button.fontFamily,
  fontWeight: theme.typography.button.fontWeight,
  fontSize: theme.typography.button.fontSize,
  "&:hover": {
    backgroundColor: theme.palette.custom.accent.tealDark,
  },
}));
