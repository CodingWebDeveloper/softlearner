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

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface Quiz {
  id: number;
  title: string;
  progress: number;
  questions?: QuizQuestion[];
}

interface QuizDialogProps {
  open: boolean;
  onClose: () => void;
  quiz: Quiz;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

const QuizDialog: FC<QuizDialogProps> = ({
  open,
  onClose,
  quiz,
  maxWidth = "md",
}) => {
  const theme = useTheme();
  const questions = quiz.questions || [];
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setCurrent(0);
    setAnswers([]);
    setSubmitted(false);
  };

  const handleOptionSelect = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleRequestClose = () => setShowCloseConfirm(true);
  const handleCancelClose = () => setShowCloseConfirm(false);
  const handleConfirmClose = () => {
    setShowCloseConfirm(false);
    onClose();
    // Reset state when closing
    setStarted(false);
    setCurrent(0);
    setAnswers([]);
    setSubmitted(false);
  };

  const correctCount = submitted
    ? questions.reduce(
        (acc, q, idx) => acc + (answers[idx] === q.correct ? 1 : 0),
        0
      )
    : 0;
  const percent = questions.length
    ? ((correctCount / questions.length) * 100).toFixed(1)
    : "0.0";

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={handleRequestClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen
      PaperProps={{
        sx: {
          background: "transparent",
          boxShadow: "none",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(4px)",
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
              <QuizDialogPercent>{quiz.progress}%</QuizDialogPercent>
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
                {quiz.title}
              </Typography>
              <QuizProgressBar
                variant="determinate"
                value={((current + 1) / questions.length) * 100}
              />
              <QuizDialogNofX>
                Question {current + 1} of {questions.length}
              </QuizDialogNofX>
              <QuizQuestionText>
                {questions[current]?.question}
              </QuizQuestionText>
              <OptionListBox>
                {questions[current]?.options.map((opt, idx) => (
                  <OptionButton
                    key={idx}
                    $selected={answers[current] === idx}
                    onClick={() => handleOptionSelect(idx)}
                    fullWidth
                    aria-label={`Option ${idx + 1}: ${opt}`}
                  >
                    {opt}
                  </OptionButton>
                ))}
              </OptionListBox>
              <DialogActionsRow>
                <PreviousButton
                  onClick={handlePrev}
                  disabled={current === 0}
                  aria-label="Previous question"
                >
                  Previous
                </PreviousButton>
                {current < questions.length - 1 ? (
                  <NextButton
                    onClick={handleNext}
                    disabled={answers[current] == null}
                    aria-label="Next question"
                  >
                    Next
                  </NextButton>
                ) : (
                  <SubmitButton
                    onClick={handleSubmit}
                    disabled={answers.length !== questions.length}
                    aria-label="Submit quiz"
                  >
                    Submit
                  </SubmitButton>
                )}
              </DialogActionsRow>
            </>
          ) : (
            <>
              <QuizDialogPercent>{percent}%</QuizDialogPercent>
              <QuizDialogAnswers>
                You got {correctCount}{" "}
                {correctCount === 1 ? "answer" : "answers"} correct
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
