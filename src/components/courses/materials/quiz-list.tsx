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
import QuizDialog from "./quiz-dialog";
import { Box } from "@mui/material";

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

interface QuizListProps {
  quizzes: Quiz[];
}

const mockQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "A 62-year-old man presents with nocturia, hesitancy and terminal dribbling. Prostate examination reveals a moderately enlarged prostate with no irregular features and a well defined median sulcus. Blood tests show; PSA1.3 ng/ml. What is the most appropriate management?",
    options: [
      "Alpha-1 antagonist",
      "5 alpha-reductase inhibitor",
      "Non-urgent referral for transurethral resection of prostate",
      "Empirical treatment with ciprofloxacin for 2 weeks",
      "Urgent referral to urology",
    ],
    correct: 0,
  },
  {
    id: 2,
    question:
      "Which of the following is the most common cause of myocardial infarction?",
    options: [
      "Coronary artery spasm",
      "Atherosclerotic plaque rupture",
      "Coronary artery embolism",
      "Coronary artery dissection",
      "Vasculitis",
    ],
    correct: 1,
  },
  // Add more mock questions as needed
];

const QuizList: FC<QuizListProps> = ({ quizzes }) => {
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
    <Box sx={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
      <QuizzesListContainer>
        {quizzes.map((quiz) => (
          <QuizListItem
            key={quiz.id}
            onClick={() => handleQuizClick(quiz)}
            tabIndex={0}
            role="button"
            aria-label={`Open quiz ${quiz.title}, current progress: ${quiz.progress}%`}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleQuizClick(quiz);
              }
            }}
          >
            <QuizTitle variant="h6">{quiz.title}</QuizTitle>
            <QuizProgressContainer>
              <QuizProgressBar variant="determinate" value={quiz.progress} />
              <QuizProgressText>{quiz.progress}%</QuizProgressText>
            </QuizProgressContainer>
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
    </Box>
  );
};

export default QuizList;
