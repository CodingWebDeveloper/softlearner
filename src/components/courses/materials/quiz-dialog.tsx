"use client";

import { FC, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import {
  QuizProgressBar,
  QuizDialogCard,
  QuizDialogPercent,
  QuizDialogAnswers,
  QuizDialogNofX,
  PreviousButton,
  NextButton,
  SubmitButton,
  OptionButton,
  DialogActionsRow,
  OptionListBox,
  DialogContentBox,
  CloseIconButton,
  StartButton,
  QuizQuestionText,
  MobileCloseButton,
  QuizTopBar,
} from "@/components/styles/courses/materials.styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmAlert from "@/components/confirm-alert";
import { trpc } from "@/lib/trpc/client";
import LoadingFallback from "@/components/loading-fallback";
import { TestWithProgress } from "@/services/interfaces/service.interfaces";

interface QuizDialogProps {
  open: boolean;
  onClose: () => void;
  selectedTest: TestWithProgress;
  courseId: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

const QuizDialog: FC<QuizDialogProps> = ({
  open,
  onClose,
  selectedTest,
  courseId,
  maxWidth = "md",
}) => {
  // General hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Queries
  const { data: test, isLoading } = trpc.tests.getTestById.useQuery(
    selectedTest.id,
    {
      enabled: open,
    }
  );

  console.log(test);

  // Mutations
  const createScoreMutation = trpc.tests.createScore.useMutation();
  const utils = trpc.useUtils();

  // States
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string[] }>(
    {}
  );
  const [submitted, setSubmitted] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [testResult, setTestResult] = useState<{
    testId: string;
    score: number;
    maxScore: number;
  } | null>(null);

  // Handlers
  const handleStart = () => {
    setStarted(true);
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setTestResult(null);
  };

  const handleOptionSelect = (
    questionId: string,
    optionId: string,
    isMultiple: boolean
  ) => {
    const newAnswers = { ...answers };

    if (isMultiple) {
      // For multiple choice, toggle the option
      const currentAnswers = newAnswers[questionId] || [];
      const optionIndex = currentAnswers.indexOf(optionId);

      if (optionIndex > -1) {
        currentAnswers.splice(optionIndex, 1);
      } else {
        currentAnswers.push(optionId);
      }

      newAnswers[questionId] = currentAnswers;
    } else {
      // For single choice, replace the answer
      newAnswers[questionId] = [optionId];
    }

    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (test && current < test.questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleSubmit = async () => {
    if (!test) return;

    try {
      const result = await createScoreMutation.mutateAsync({
        testId: selectedTest.id,
        submission: answers,
      });

      setTestResult(result);
      setSubmitted(true);

      // Invalidate getTestMaterials query to refresh the data
      utils.tests.getTestMaterials.invalidate(courseId);
    } catch (error) {
      console.error("Failed to submit test:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleRequestClose = () => setShowCloseConfirm(true);
  const handleCancelClose = () => setShowCloseConfirm(false);
  const handleConfirmClose = () => {
    setShowCloseConfirm(false);
    onClose();
    // Reset state when closing
    setStarted(false);
    setCurrent(0);
    setAnswers({});
    setSubmitted(false);
    setTestResult(null);
  };

  if (isLoading || !test) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={maxWidth}
        fullWidth
        fullScreen
      >
        <LoadingFallback />
      </Dialog>
    );
  }

  // Other variables
  const currentQuestion = test.questions[current];
  const isCurrentQuestionAnswered =
    answers[currentQuestion?.id] && answers[currentQuestion?.id].length > 0;
  const allQuestionsAnswered = test.questions.every(
    (question) => answers[question.id] && answers[question.id].length > 0
  );

  return (
    <Dialog
      open={open}
      onClose={handleRequestClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen
      slotProps={{
        paper: {
          sx: {
            background: "transparent",
            boxShadow: "none",
          },
        },
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      <DialogContentBox>
        <QuizDialogCard>
          <QuizTopBar>
            {isMobile ? (
              <MobileCloseButton
                onClick={started ? handleRequestClose : onClose}
                aria-label="Close quiz"
              >
                Close
              </MobileCloseButton>
            ) : (
              <CloseIconButton
                onClick={started ? handleRequestClose : onClose}
                aria-label="Close quiz"
              >
                <CloseIcon />
              </CloseIconButton>
            )}
          </QuizTopBar>

          {!started ? (
            <>
              <QuizDialogPercent>{selectedTest.progress}%</QuizDialogPercent>
              <Typography
                variant="h6"
                align="center"
                sx={{ color: theme.palette.custom.text.light }}
              >
                Ready to start the quiz?
              </Typography>
              <DialogActionsRow>
                <StartButton
                  onClick={handleStart}
                  fullWidth
                  aria-label="Start quiz"
                >
                  Start Quiz
                </StartButton>
              </DialogActionsRow>
            </>
          ) : !submitted ? (
            <>
              <Typography
                variant="h5"
                sx={{ color: theme.palette.custom.text.white }}
              >
                {test.title}
              </Typography>
              <QuizProgressBar
                variant="determinate"
                value={((current + 1) / test.questions.length) * 100}
              />
              <QuizDialogNofX>
                Question {current + 1} of {test.questions.length}
              </QuizDialogNofX>
              <QuizQuestionText>{currentQuestion?.text}</QuizQuestionText>
              <OptionListBox>
                {currentQuestion?.options.map((opt) => {
                  const isSelected =
                    answers[currentQuestion.id]?.includes(opt.id) || false;
                  return (
                    <OptionButton
                      key={opt.id}
                      $selected={isSelected}
                      onClick={() =>
                        handleOptionSelect(
                          currentQuestion.id,
                          opt.id,
                          currentQuestion.type === "multiple"
                        )
                      }
                      fullWidth
                      aria-label={`Option: ${opt.text}`}
                    >
                      {opt.text}
                    </OptionButton>
                  );
                })}
              </OptionListBox>
              <DialogActionsRow>
                <PreviousButton
                  onClick={handlePrev}
                  disabled={current === 0}
                  aria-label="Previous question"
                >
                  Previous
                </PreviousButton>
                {current < test.questions.length - 1 ? (
                  <NextButton
                    onClick={handleNext}
                    disabled={!isCurrentQuestionAnswered}
                    aria-label="Next question"
                  >
                    Next
                  </NextButton>
                ) : (
                  <SubmitButton
                    onClick={handleSubmit}
                    disabled={
                      !allQuestionsAnswered || createScoreMutation.isPending
                    }
                    aria-label="Submit quiz"
                  >
                    {createScoreMutation.isPending ? "Submitting..." : "Submit"}
                  </SubmitButton>
                )}
              </DialogActionsRow>
            </>
          ) : (
            <>
              <QuizDialogPercent>
                {testResult
                  ? `${Math.round(
                      (testResult.score / testResult.maxScore) * 100
                    )}%`
                  : "0%"}
              </QuizDialogPercent>
              <QuizDialogAnswers>
                {testResult ? (
                  <>
                    {`You got score of ${testResult.score} out of ${testResult.maxScore}!`}
                  </>
                ) : (
                  "Results will be available soon"
                )}
              </QuizDialogAnswers>
              <DialogActionsRow>
                <StartButton
                  onClick={handleConfirmClose}
                  fullWidth
                  aria-label="Close quiz results"
                >
                  Close
                </StartButton>
              </DialogActionsRow>
            </>
          )}
        </QuizDialogCard>
      </DialogContentBox>

      <ConfirmAlert
        open={showCloseConfirm}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        title="Are you sure you want to close?"
        content="Your progress will be lost if you close the quiz."
        confirmText="Yes, Close Quiz"
        cancelText="Continue Quiz"
      />
    </Dialog>
  );
};

export default QuizDialog;
