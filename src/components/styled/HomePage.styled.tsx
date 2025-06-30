import { styled } from "@mui/material/styles";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  TypographyProps,
  LinearProgress,
  Chip,
} from "@mui/material";

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const MainContainer = styled(Box)({
  flexGrow: 1,
});

export const ContentContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: "100vh",
}));

export const WelcomeSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

export const WelcomePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
}));

export const WelcomeTitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    marginBottom: theme.spacing(2),
  })
);

export const WelcomeSubtitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    marginBottom: theme.spacing(2),
  })
);

export const WelcomeButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

export const WelcomeButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

export const CardsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

export const FeatureCard = styled(Card)({
  flex: "1 1 300px",
  minWidth: 0,
});

export const CardTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const CardButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

// Dashboard styled components
export const DashboardContainer = styled(Box)(() => ({
  backgroundColor: "#1a1b23",
  minHeight: "100vh",
  color: "#ffffff",
}));

export const DashboardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#252730",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
}));

export const DashboardTitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: "2.5rem",
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: theme.spacing(1),
    color: "#ffffff",
  })
);

export const DashboardSubtitle = styled(Typography)<TypographyProps>(() => ({
  fontSize: "1.125rem",
  color: "#9ca3af",
  fontWeight: 400,
}));

export const DashboardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: "1200px",
  margin: "0 auto",
}));

export const CourseGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  gap: theme.spacing(3),
  marginTop: theme.spacing(4),
}));

export const CourseCard = styled(Card)(() => ({
  backgroundColor: "#252730",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.1)",
  overflow: "hidden",
  transition: "all 150ms ease",
  "&:hover": {
    backgroundColor: "#2d2f3a",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
}));

export const CourseCardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const CourseHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: theme.spacing(2),
}));

export const CourseTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 600,
  lineHeight: 1.4,
  color: "#ffffff",
  marginBottom: theme.spacing(1),
}));

export const CourseInstructor = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: "0.875rem",
    color: "#9ca3af",
    fontWeight: 400,
  })
);

export const CourseDescription = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: "0.875rem",
    color: "#9ca3af",
    lineHeight: 1.5,
    marginBottom: theme.spacing(3),
  })
);

export const ProgressSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const ProgressHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

export const ProgressText = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: "0.875rem",
    color: "#9ca3af",
    fontWeight: 400,
  })
);

export const ProgressPercentage = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: "0.875rem",
    color: "#4ecdc4",
    fontWeight: 600,
  })
);

export const StyledProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: "6px",
  borderRadius: "9999px",
  backgroundColor: "rgba(255,255,255,0.1)",
  "& .MuiLinearProgress-bar": {
    backgroundColor: "#4ecdc4",
    borderRadius: "9999px",
  },
}));

export const CourseFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(2),
  borderTop: "1px solid rgba(255,255,255,0.1)",
}));

export const LastAccessed = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: "0.75rem",
    color: "#6b7280",
    fontWeight: 400,
  })
);

export const ContinueButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4ecdc4",
  color: "#ffffff",
  padding: "8px 16px",
  borderRadius: "8px",
  fontWeight: 500,
  textTransform: "none",
  fontSize: "0.875rem",
  "&:hover": {
    backgroundColor: "#45b7af",
  },
}));

export const StatusChip = styled(Chip)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 500,
  height: "24px",
  "&.MuiChip-colorSuccess": {
    backgroundColor: "#10b981",
    color: "#ffffff",
  },
  "&.MuiChip-colorWarning": {
    backgroundColor: "#f59e0b",
    color: "#ffffff",
  },
  "&.MuiChip-colorDefault": {
    backgroundColor: "#6b7280",
    color: "#ffffff",
  },
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(8),
  color: "#9ca3af",
}));

export const EmptyStateTitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: "#ffffff",
  })
);

export const EmptyStateText = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: "1rem",
    color: "#9ca3af",
    marginBottom: theme.spacing(3),
  })
);
