"use client";
import { FC, useState, KeyboardEvent } from "react";
import {
  QuizzesListContainer,
  QuizListItem,
  QuizTitle,
  QuizProgressBar,
  QuizProgressContainer,
  QuizProgressText,
} from "@/components/styles/courses/materials.styles";
import { Box, Skeleton, Chip } from "@mui/material";
import { trpc } from "@/lib/trpc/client";
import { LightText } from "@/components/styles/infrastructure/layout.styles";
import QuizDialog from "./quiz-dialog";
import { TestWithProgress } from "@/services/interfaces/service.interfaces";

interface QuizListProps {
  courseId: string;
}

const LoadingSkeleton: FC = () => (
  <Box sx={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
    <QuizzesListContainer>
      {[1, 2, 3].map((index) => (
        <QuizListItem key={index}>
          <QuizTitle variant="h6">
            <Skeleton width="60%" />
          </QuizTitle>
          <QuizProgressContainer>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={8}
              sx={{ borderRadius: 1 }}
            />
            <Box sx={{ minWidth: 80 }}>
              <Skeleton width={80} />
            </Box>
          </QuizProgressContainer>
        </QuizListItem>
      ))}
    </QuizzesListContainer>
  </Box>
);

const QuizList: FC<QuizListProps> = ({ courseId }) => {
  const [selectedTest, setSelectedTest] = useState<TestWithProgress | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const { data: tests, isLoading } =
    trpc.tests.getTestMaterials.useQuery(courseId);

  const handleQuizClick = (test: TestWithProgress) => {
    setSelectedTest(test);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTest(null);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!tests || tests.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <LightText>No quizzes available for this course</LightText>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <QuizzesListContainer>
        {tests.map((test) => (
          <QuizListItem
            key={test.id}
            onClick={() => handleQuizClick(test)}
            tabIndex={0}
            role="button"
            aria-label={`Open quiz ${test.title}, progress: ${test.progress}%, contains ${test.questionsCount} questions`}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleQuizClick(test);
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <QuizTitle variant="h6">{test.title}</QuizTitle>
              <Chip
                label={getVariantLabel(test.variant)}
                color={getVariantColor(test.variant)}
                size="small"
              />
            </Box>
            <QuizProgressContainer>
              <QuizProgressBar variant="determinate" value={test.progress} />
              <QuizProgressText>{test.progress}%</QuizProgressText>
            </QuizProgressContainer>
          </QuizListItem>
        ))}
      </QuizzesListContainer>
      {selectedTest && (
        <QuizDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          selectedTest={selectedTest}
          courseId={courseId}
          maxWidth="md"
        />
      )}
    </Box>
  );
};

export default QuizList;
