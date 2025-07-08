'use client';
import { Box, Typography } from '@mui/material';
import {
  QuizzesListContainer,
  QuizListItem,
  QuizTitle,
  QuizProgressBar,
} from './styles/materials.styled';
import QuizDialog from './QuizDialog';
import { useState } from 'react';

interface Quiz {
  id: number;
  title: string;
  progress: number; // percent
}

interface QuizListProps {
  quizzes: Quiz[];
}

const mockQuestions = [
  {
    id: 1,
    question: 'A 62-year-old man presents with nocturia, hesitancy and terminal dribbling. Prostate examination reveals a moderately enlarged prostate with no irregular features and a well defined median sulcus. Blood tests show; PSA1.3 ng/ml. What is the most appropriate management?',
    options: [
      'Alpha-1 antagonist',
      '5 alpha-reductase inhibitor',
      'Non-urgent referral for transurethral resection of prostate',
      'Empirical treatment with ciprofloxacin for 2 weeks',
      'Urgent referral to urology',
    ],
    correct: 0,
  },
  {
    id: 2,
    question: 'Which of the following is the most common cause of myocardial infarction?',
    options: [
      'Coronary artery spasm',
      'Atherosclerotic plaque rupture',
      'Coronary artery embolism',
      'Coronary artery dissection',
      'Vasculitis',
    ],
    correct: 1,
  },
  // Add more mock questions as needed
];

const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleQuizClick = (quiz: Quiz) => {
    setSelectedQuiz({ ...quiz, questions: mockQuestions });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedQuiz(null);
  };

  return (
    <>
      <QuizzesListContainer sx={{ overflowY: 'auto', maxHeight: '500px' }}>
        {quizzes.map((quiz) => (
          <QuizListItem
            key={quiz.id}
            onClick={() => handleQuizClick(quiz)}
            tabIndex={0}
            aria-label={`Open quiz ${quiz.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleQuizClick(quiz);
            }}
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <QuizTitle>{quiz.title}</QuizTitle>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
              <QuizProgressBar variant="determinate" value={quiz.progress} />
              <Typography
                variant="body2"
                sx={{
                  color: 'inherit',
                  minWidth: 40,
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {quiz.progress}%
              </Typography>
            </Box>
          </QuizListItem>
        ))}
      </QuizzesListContainer>
      {selectedQuiz && (
        <QuizDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          quiz={selectedQuiz}
          maxWidth="md"
        />
      )}
    </>
  );
};

export default QuizList; 