"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import QuizCard from "./quiz-card";
import QuizDialog, { QuizFormValues } from "./quiz-dialog";
import QuizQuestions from "./quiz-questions";
import { BasicTest } from "@/services/interfaces/service.interfaces";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  HeaderContainer,
  LoadingContainer,
} from "@/components/styles/creator/quiz-management.styles";
import { StyledButton } from "@/components/styles/infrastructure/layout.styles";

interface QuizManagementProps {
  courseId: string | null;
}

const QuizManagement = ({ courseId }: QuizManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<BasicTest | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const utils = trpc.useUtils();

  const {
    data: quizzes,
    isLoading,
    error,
  } = trpc.tests.getTests.useQuery(courseId!, {
    enabled: !!courseId,
  });

  const createTestMutation = trpc.tests.createTest.useMutation({
    onSuccess: () => {
      utils.tests.getTests.invalidate(courseId!);
    },
  });

  const updateTestMutation = trpc.tests.updateTest.useMutation({
    onSuccess: () => {
      utils.tests.getTests.invalidate(courseId!);
    },
  });

  const handleQuizClick = (quizId: string) => {
    const quiz = quizzes?.find((q) => q.id === quizId);
    if (quiz) {
      setIsDialogOpen(true);
      setSelectedQuiz(quiz);
    }
  };

  const handleAddQuestions = (quizId: string) => {
    const quiz = quizzes?.find((q) => q.id === quizId);
    if (quiz) {
      setSelectedQuiz(quiz);
    }
  };

  const handleAddQuiz = () => {
    setSelectedQuiz(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedQuiz(null);
  };

  const handleSubmitQuiz = async (values: QuizFormValues) => {
    if (!courseId) return;

    try {
      if (selectedQuiz) {
        await updateTestMutation.mutateAsync({
          id: selectedQuiz.id,
          data: values,
        });
        setSnackbar({
          open: true,
          message: "Quiz updated successfully!",
          severity: "success",
        });
      } else {
        await createTestMutation.mutateAsync({
          courseId,
          data: values,
        });
        setSnackbar({
          open: true,
          message: "Quiz created successfully!",
          severity: "success",
        });
      }
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: selectedQuiz
          ? "Failed to update quiz. Please try again."
          : "Failed to create quiz. Please try again.",
        severity: "error",
      });
      console.error(
        selectedQuiz ? "Failed to update quiz:" : "Failed to create quiz:",
        error
      );
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (!courseId) {
    return (
      <Alert severity="warning">
        Please save the course details first to manage quizzes.
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load quizzes. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      <HeaderContainer>
        <Typography variant="h5" component="h2">
          Course Quizzes
        </Typography>
        <StyledButton
          startIcon={<AddIcon />}
          onClick={handleAddQuiz}
          variant="contained"
        >
          Add Quiz
        </StyledButton>
      </HeaderContainer>

      {selectedQuiz ? (
        <Box mt={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5">{selectedQuiz.title}</Typography>
            <StyledButton variant="text" onClick={() => setSelectedQuiz(null)}>
              Back to Quizzes
            </StyledButton>
          </Box>
          <QuizQuestions testId={selectedQuiz.id} />
        </Box>
      ) : (
        <>
          {quizzes && quizzes.length > 0 ? (
            <Box
              display="grid"
              gridTemplateColumns={{
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              }}
              gap={3}
            >
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onClick={handleQuizClick}
                  onAddQuestions={handleAddQuestions}
                />
              ))}
            </Box>
          ) : (
            <Alert severity="info">
              No quizzes have been created yet. Click the Add Quiz button to
              create your first quiz.
            </Alert>
          )}
        </>
      )}

      <QuizDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitQuiz}
        initialValues={
          selectedQuiz
            ? {
                title: selectedQuiz.title,
                description: selectedQuiz.description || "",
              }
            : undefined
        }
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default QuizManagement;
