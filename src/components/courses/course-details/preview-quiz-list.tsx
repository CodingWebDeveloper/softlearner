import { FC } from "react";
import List from "@mui/material/List";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import { trpc } from "@/lib/trpc/client";
import {
  SectionTitle,
  ListItemStyled,
  ListItemIconStyled,
  ListItemTextStyled,
} from "@/components/styles/courses/course-details.styles";
import { LightText } from "@/components/styles/infrastructure/layout.styles";

interface PreviewQuizzesListProps {
  courseId: string;
}

const LoadingSkeleton: FC = () => (
  <>
    {[1, 2, 3].map((idx) => (
      <ListItemStyled key={idx} divider={idx !== 3}>
        <ListItemIconStyled>
          <Skeleton variant="circular" width={24} height={24} />
        </ListItemIconStyled>
        <ListItemTextStyled primary={<Skeleton variant="text" width="60%" />} />
        <Skeleton variant="text" width={80} />
      </ListItemStyled>
    ))}
  </>
);

const PreviewQuizzesList: FC<PreviewQuizzesListProps> = ({ courseId }) => {
  const getVariantColor = (
    variant: string,
  ):
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    switch (variant) {
      case "knowledge":
        return "info";
      case "skill":
        return "success";
      case "competence":
        return "secondary";
      default:
        return "default";
    }
  };

  const getVariantLabel = (variant: string) => {
    switch (variant) {
      case "knowledge":
        return "Knowledge";
      case "skill":
        return "Skill";
      case "competence":
        return "Competence";
      default:
        return variant;
    }
  };

  const {
    data: tests,
    isLoading,
    error,
  } = trpc.tests.getTests.useQuery(courseId);

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          mt: 2,
          "& .MuiAlert-icon": {
            color: (theme) => theme.palette.custom.status.error,
          },
        }}
      >
        Failed to load quizzes: {error.message}
      </Alert>
    );
  }

  return (
    <>
      <SectionTitle variant="subtitle2">Quizzes</SectionTitle>
      <List disablePadding>
        {isLoading ? (
          <LoadingSkeleton />
        ) : tests && tests.length > 0 ? (
          tests.map((test, idx) => (
            <ListItemStyled
              key={test.id}
              tabIndex={0}
              aria-label={test.title}
              divider={idx !== tests.length - 1}
            >
              <ListItemIconStyled>
                <QuizOutlinedIcon
                  sx={{ color: (theme) => theme.palette.custom.accent.blue }}
                />
              </ListItemIconStyled>
              <ListItemTextStyled
                primary={
                  <LightText
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {test.title}
                  </LightText>
                }
              />
              <Chip
                label={getVariantLabel(test.variant)}
                color={getVariantColor(test.variant)}
                size="small"
              />
            </ListItemStyled>
          ))
        ) : (
          <LightText variant="body2" sx={{ mt: 1, ml: 1 }}>
            No quizzes available for this course
          </LightText>
        )}
      </List>
    </>
  );
};

export default PreviewQuizzesList;
