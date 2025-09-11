"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { trpc } from "@/lib/trpc/client";
import { AlertColor } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { SaveOrderButton } from "@/components/styles/creator/resources-form.styles";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  initializeQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addOption,
  updateOption,
  deleteOption,
  selectQuestions,
  selectHasQuestions,
  QuestionField,
  OptionField,
} from "@/lib/store/features/questionsSlice";

const QuestionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.secondary,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const OptionContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const StyledAddButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.dark,
  color: theme.palette.custom.text.white,
  textTransform: "none",
  "&:hover": {
    backgroundColor: theme.palette.custom.background.tertiary,
  },
  "&:disabled": {
    backgroundColor: theme.palette.custom.background.tertiary,
    color: theme.palette.custom.text.light,
  },
}));

interface QuizQuestionsProps {
  testId: string;
}

const QuizQuestions = ({ testId }: QuizQuestionsProps) => {
  // General hooks
  const dispatch = useAppDispatch();

  // Selectors
  const questions = useAppSelector(selectQuestions);
  const hasQuestions = useAppSelector(selectHasQuestions);

  // State
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // TRPC hooks
  const utils = trpc.useUtils();

  // Queries
  const {
    data: questionsData,
    isLoading: questionsLoading,
    error: questionsError,
  } = trpc.tests.getTestQuestions.useQuery(testId);

  // Handlers
  const handleAddQuestion = () => {
    dispatch(addQuestion());
  };

  const handleQuestionChange = (
    questionId: string,
    field: QuestionField,
    value: string | number | "single" | "multiple"
  ) => {
    dispatch(updateQuestion({ questionId, field, value }));
  };

  const handleAddOption = (questionId: string) => {
    dispatch(addOption(questionId));
  };

  const handleOptionChange = (
    questionId: string,
    optionId: string,
    field: OptionField,
    value: string | boolean
  ) => {
    dispatch(updateOption({ questionId, optionId, field, value }));
  };

  const handleDeleteOption = (questionId: string, optionId: string) => {
    dispatch(deleteOption({ questionId, optionId }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    dispatch(deleteQuestion(questionId));
  };

  const saveQuestionsMutation = trpc.tests.saveQuestions.useMutation({
    onSuccess: () => {
      utils.tests.getTestQuestions.invalidate(testId);
    },
  });

  const handleSaveQuestions = async () => {
    try {
      await saveQuestionsMutation.mutateAsync({
        testId,
        questions: questions.map((q) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          points: q.points,
          status: q.status,
          options: q.options.map((o) => ({
            id: o.id,
            text: o.text,
            isCorrect: o.isCorrect,
            status: o.status,
          })),
        })),
      });

      // Show success message
      setSnackbar({
        open: true,
        message: "Questions saved successfully!",
        severity: "success",
      });
    } catch (error) {
      // Show error message
      setSnackbar({
        open: true,
        message: "Failed to save questions. Please try again.",
        severity: "error",
      });
      console.error("Failed to save questions:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Effects
  useEffect(() => {
    if (questionsData) {
      const formattedQuestions = questionsData.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type as "single" | "multiple",
        points: Number(q.points),
        status: "INITIAL" as const, // Questions loaded from DB are INITIAL
        options: q.options.map((o) => ({
          id: o.id,
          text: o.text,
          isCorrect: o.is_correct,
          status: "INITIAL" as const, // Options loaded from DB are INITIAL
        })),
      }));
      dispatch(initializeQuestions({ questions: formattedQuestions, testId }));
    }
  }, [questionsData, dispatch, testId]);

  if (questionsLoading || questionsError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (questionsError) {
    return (
      <Alert severity="error">
        Failed to load questions. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6">Questions</Typography>
        <StyledAddButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddQuestion}
        >
          Add Question
        </StyledAddButton>
      </Box>

      {questions.map((question) => (
        <QuestionContainer key={question.id}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <TextField
                  fullWidth
                  label="Question"
                  value={question.text}
                  onChange={(e) =>
                    handleQuestionChange(question.id, "text", e.target.value)
                  }
                  sx={{ mr: 2 }}
                />
                <IconButton
                  onClick={() => handleDeleteQuestion(question.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={question.type}
                  label="Type"
                  onChange={(e) =>
                    handleQuestionChange(question.id, "type", e.target.value)
                  }
                >
                  <MenuItem value="single">Single Choice</MenuItem>
                  <MenuItem value="multiple">Multiple Choice</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Points"
                value={question.points}
                onChange={(e) => {
                  const value =
                    e.target.value === ""
                      ? 1
                      : Math.max(1, parseInt(e.target.value, 10));
                  handleQuestionChange(question.id, "points", value);
                }}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" gutterBottom>
                Options
              </Typography>
              {question.options.map((option) => (
                <OptionContainer key={option.id}>
                  <TextField
                    fullWidth
                    label="Option"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(
                        question.id,
                        option.id,
                        "text",
                        e.target.value
                      )
                    }
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={option.isCorrect}
                      onChange={(e) =>
                        handleOptionChange(
                          question.id,
                          option.id,
                          "isCorrect",
                          e.target.value as string
                        )
                      }
                      size="small"
                    >
                      <MenuItem value="false">Incorrect</MenuItem>
                      <MenuItem value="true">Correct</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton
                    onClick={() => handleDeleteOption(question.id, option.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </OptionContainer>
              ))}
              <StyledAddButton
                startIcon={<AddIcon />}
                onClick={() => handleAddOption(question.id)}
              >
                Add Option
              </StyledAddButton>
            </Grid>
          </Grid>
        </QuestionContainer>
      ))}

      {hasQuestions && (
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <SaveOrderButton variant="contained" onClick={handleSaveQuestions}>
            Save Questions
          </SaveOrderButton>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuizQuestions;
