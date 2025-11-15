"use client";

import { useState } from "react";
import { Box, CircularProgress, Alert, Snackbar, Stack } from "@mui/material";
import { trpc } from "@/lib/trpc/client";
import { AlertColor } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { SaveOrderButton } from "@/components/styles/creator/resources-form.styles";
import { LightText } from "@/components/styles/infrastructure/layout.styles";
import { FieldArray, Form, Formik } from "formik";
import QuestionInputCard from "./question-input-card";
import { StyledButton } from "@/components/styles/infrastructure/layout.styles";
import GenerateAIQuestionsForm, {
  GeneratedQuestion,
} from "./generate-ai-questions-form";
import * as yup from "yup";

interface QuizQuestionsProps {
  testId: string;
}

export type Status = "INITIAL" | "NEW" | "UPDATED";

export type QuestionInput = {
  id: string;
  text: string;
  type: "single" | "multiple";
  points: number;
  status: Status;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    status: Status;
  }[];
};

export type QuestionFormValues = {
  questions: QuestionInput[];
};

const validationSchema = yup.object().shape({
  questions: yup.array().of(
    yup.object().shape({
      text: yup.string().required("Question text is required"),
      type: yup.string().required("Question type is required"),
      points: yup.number().required("Points are required"),
      options: yup.array().of(
        yup.object().shape({
          text: yup.string().required("Option text is required"),
          isCorrect: yup.boolean().required("Correctness is required"),
        })
      ),
    })
  ),
});

const QuizQuestions = ({ testId }: QuizQuestionsProps) => {
  // Selectors
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
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);

  // TRPC hooks
  const utils = trpc.useUtils();

  // Queries
  const {
    data: questionsData,
    isLoading: questionsLoading,
    error: questionsError,
  } = trpc.tests.getTestQuestions.useQuery(testId);

  const saveQuestionsMutation = trpc.tests.saveQuestions.useMutation({
    onSuccess: () => {
      utils.tests.getTestQuestions.invalidate(testId);
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAIQuestionsGenerated = (
    generatedQuestions: GeneratedQuestion[],
    push: (value: QuestionInput) => void
  ) => {
    generatedQuestions.forEach((genQ) => {
      const newQuestion: QuestionInput = {
        id: crypto.randomUUID(),
        text: genQ.text,
        type: genQ.type,
        points: genQ.points,
        status: "NEW",
        options: genQ.options.map((opt) => ({
          id: crypto.randomUUID(),
          text: opt.text,
          isCorrect: opt.isCorrect,
          status: "NEW" as Status,
        })),
      };
      push(newQuestion);
    });

    setSnackbar({
      open: true,
      message: `${generatedQuestions.length} AI-generated questions added successfully!`,
      severity: "success",
    });
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await saveQuestionsMutation.mutateAsync({
        testId,
        questions: values.questions.map((q) => ({
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

  // Initial values for the form
  const initialValues: QuestionFormValues = {
    questions:
      questionsData?.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        points: q.points,
        options: q.options.map((o) => ({
          id: o.id,
          text: o.text,
          isCorrect: o.is_correct,
          status: "INITIAL",
        })),
        status: "INITIAL",
      })) ?? [],
  };

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
      <LightText variant="h6">Questions</LightText>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, dirty }) => (
          <Form>
            <Box
              display="flex"
              marginBottom="16px"
              justifyContent="flex-end"
              mt={3}
            >
              <SaveOrderButton
                type="submit"
                disabled={saveQuestionsMutation.isPending || !dirty}
                variant="contained"
              >
                Save Questions
              </SaveOrderButton>
            </Box>
            <FieldArray name="questions">
              {({ push, remove }) => (
                <>
                  <Stack spacing={2}>
                    {values.questions.map((q, qIndex) => (
                      <QuestionInputCard
                        key={q.id}
                        question={q}
                        index={qIndex}
                        remove={remove}
                        totalQuestions={values.questions.length}
                      />
                    ))}

                    <Box display="flex" gap={2} justifyContent="center">
                      <StyledButton
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() =>
                          push({
                            id: crypto.randomUUID(),
                            text: "",
                            type: "single",
                            points: 1,
                            status: "NEW",
                            options: [],
                          })
                        }
                      >
                        Add Question
                      </StyledButton>

                      <StyledButton
                        variant="outlined"
                        color="secondary"
                        startIcon={<AutoAwesomeIcon />}
                        onClick={() => setIsAIDialogOpen(true)}
                      >
                        Generate with AI
                      </StyledButton>
                    </Box>
                  </Stack>

                  <GenerateAIQuestionsForm
                    open={isAIDialogOpen}
                    onClose={() => setIsAIDialogOpen(false)}
                    onQuestionsGenerated={(questions) =>
                      handleAIQuestionsGenerated(questions, push)
                    }
                  />
                </>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>

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
