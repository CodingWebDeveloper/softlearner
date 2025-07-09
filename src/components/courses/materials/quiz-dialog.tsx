import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { QuizProgressBar, QuizDialogCard, QuizDialogPercent, QuizDialogAnswers, QuizDialogNofX, PreviousButton, NextButton, SubmitButton, OptionButton, DialogActionsRow, OptionListBox, DialogContentBox, CloseIconButton, StartButton, QuizQuestionText, MobileCloseButton, QuizTopBar } from '@/components/styles/courses/materials.styles';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmAlert from '@/components/confirm-alert';

interface Quiz {
  id: number;
  title: string;
  progress: number;
  questions?: { id: number; question: string; options: string[]; correct: number }[];
}

interface QuizDialogProps {
  open: boolean;
  onClose: () => void;
  quiz: Quiz;
}

const QuizDialog: React.FC<QuizDialogProps & { maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }> = ({ open, onClose, quiz, maxWidth = 'md' }) => {
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
  };

  const correctCount = questions.reduce((acc, q, idx) => acc + (answers[idx] === q.correct ? 1 : 0), 0);
  const percent = questions.length ? ((correctCount / questions.length) * 100).toFixed(1) : '0.0';

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={() => { }}
      maxWidth={maxWidth}
      fullWidth
      fullScreen
      PaperProps={{
        sx: {
          background: theme.palette.custom?.background?.card || theme.palette.background.paper,
          boxShadow: 'none',
        },
      }}
      BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.7)' } }}
      disableEscapeKeyDown
      hideBackdrop={false}
    >
      <DialogContentBox>
        <QuizDialogCard>
          <QuizTopBar>
            {isMobile ? (
              <MobileCloseButton
                variant="text"
                onClick={() => {
                  if (started) {
                    handleRequestClose();
                  } else {
                    onClose();
                  }
                }}
              >
                Close
              </MobileCloseButton>
            ) : (
              <CloseIconButton
                aria-label="close"
                onClick={() => {
                  if (started) {
                    handleRequestClose();
                  } else {
                    onClose();
                  }
                }}
              >
                <CloseIcon />
              </CloseIconButton>
            )}
          </QuizTopBar>

          {!started ? (
            <>
              <QuizDialogPercent>{quiz.progress}%</QuizDialogPercent>
              <Typography variant="body1" align="center">Ready to start the quiz?</Typography>
              <DialogActions>
                <StartButton variant="contained" onClick={() => setStarted(true)} fullWidth>Start</StartButton>
              </DialogActions>
            </>
          ) : !submitted ? (
            <>
              <Typography variant="h5" >{quiz.title}</Typography>
              <QuizProgressBar variant="determinate" value={((current + 1) / questions.length) * 100} />
              <QuizDialogNofX>{`${current + 1} out of ${questions.length}`}</QuizDialogNofX>
              <QuizQuestionText variant="h6">{questions[current]?.question}</QuizQuestionText>
              <OptionListBox>
                {questions[current]?.options.map((opt, idx) => (
                  <OptionButton
                    key={idx}
                    variant={answers[current] === idx ? 'contained' : 'outlined'}
                    $selected={answers[current] === idx}
                    onClick={() => handleOptionSelect(idx)}
                    fullWidth
                  >
                    {opt}
                  </OptionButton>
                ))}
              </OptionListBox>
              <DialogActionsRow>
                <PreviousButton
                  variant="outlined"
                  onClick={handlePrev}
                  disabled={current === 0}
                >
                  Previous
                </PreviousButton>
                {current < questions.length - 1 ? (
                  <NextButton
                    variant="contained"
                    onClick={handleNext}
                    disabled={answers[current] == null}
                  >
                    Next
                  </NextButton>
                ) : (
                  <SubmitButton
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={answers.length !== questions.length}
                  >
                    Submit
                  </SubmitButton>
                )}
              </DialogActionsRow>
            </>
          ) : (
            <>
              <QuizDialogPercent>{percent}%</QuizDialogPercent>
              <QuizDialogAnswers>You got {correctCount} answer{correctCount > 1 || correctCount === 0 ? 's' : ''} correct</QuizDialogAnswers>
              <DialogActionsRow>
                <StartButton variant="contained" onClick={onClose} fullWidth>Close</StartButton>
              </DialogActionsRow>
            </>
          )}
        </QuizDialogCard>
      </DialogContentBox>
      {started && (
        <ConfirmAlert
          open={showCloseConfirm}
          onClose={handleCancelClose}
          onConfirm={handleConfirmClose}
          title="Are you sure you want to close?"
          content="You will lose your progress."
          confirmText="Yes, Close"
          cancelText="Cancel"
        />
      )}
    </Dialog>
  );
};

export default QuizDialog; 