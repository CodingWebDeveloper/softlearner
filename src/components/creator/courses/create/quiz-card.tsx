"use client";

import { BasicTest } from "@/services/interfaces/service.interfaces";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import QuizIcon from "@mui/icons-material/Quiz";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.custom.background.secondary,
  borderRadius: theme.shape.borderRadius,
  transition: "transform 0.2s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
}));

const TitleIconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.custom.accent.teal,
}));

const StyledQuizIcon = styled(QuizIcon)(({ theme }) => ({
  fontSize: "2rem",
  marginRight: theme.spacing(1),
}));

const StyledAddIcon = styled(AddCircleOutlineIcon)(({ theme }) => ({
  fontSize: "1.5rem",
  color: theme.palette.custom.accent.teal,
}));

interface QuizCardProps {
  quiz: BasicTest;
  onClick: (quizId: string) => void;
  onAddQuestions: (quizId: string) => void;
}

const QuizCard = ({ quiz, onClick, onAddQuestions }: QuizCardProps) => {
  const handleClick = () => {
    onClick(quiz.id);
  };

  const handleAddQuestions = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddQuestions(quiz.id);
  };

  return (
    <StyledCard onClick={handleClick}>
      <CardContent>
        <IconWrapper>
          <TitleIconWrapper>
            <StyledQuizIcon />
          </TitleIconWrapper>
          <Tooltip placement="top" title="Add questions">
            <IconButton
              onClick={handleAddQuestions}
              size="small"
              aria-label="Add questions"
            >
              <StyledAddIcon />
            </IconButton>
          </Tooltip>
        </IconWrapper>
        <Typography variant="h6" gutterBottom>
          {quiz.title}
        </Typography>
        {quiz.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {quiz.description}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {quiz.questionsCount} Questions
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Last updated: {new Date(quiz.updated_at).toLocaleDateString()}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default QuizCard;
