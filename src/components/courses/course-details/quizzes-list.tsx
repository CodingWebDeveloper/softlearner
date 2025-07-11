import { FC } from 'react';
import List from '@mui/material/List';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import { SectionTitle, ListItemStyled, ListItemIconStyled, ListItemTextStyled, QuestionsText } from '@/components/styles/courses/course-details.styles';

interface Quiz {
  title: string;
  questions: number;
}

interface QuizzesListProps {
  quizzes: Quiz[];
}

const QuizzesList: FC<QuizzesListProps> = ({ quizzes }) => (
  <>
    <SectionTitle variant="subtitle2" fontWeight={700}>Quizzes</SectionTitle>
    <List disablePadding>
      {quizzes.map((quiz, idx) => (
        <ListItemStyled key={quiz.title} tabIndex={0} aria-label={quiz.title} divider={idx !== quizzes.length - 1}>
          <ListItemIconStyled>
            <QuizOutlinedIcon />
          </ListItemIconStyled>
          <ListItemTextStyled primary={quiz.title} />
          <QuestionsText>{quiz.questions} questions</QuestionsText>
        </ListItemStyled>
      ))}
    </List>
  </>
);

export default QuizzesList; 