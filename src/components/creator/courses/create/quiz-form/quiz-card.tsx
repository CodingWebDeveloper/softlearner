"use client";

import { BasicTest } from "@/services/interfaces/service.interfaces";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  MenuItem,
  MenuProps,
  Menu,
  Chip,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import QuizIcon from "@mui/icons-material/Quiz";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreIcon from "@mui/icons-material/More";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmAlert from "@/components/confirm-alert";

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

const getVariantColor = (variant: string) => {
  switch (variant) {
    case "knowledge":
      return "info";
    case "skill":
      return "success";
    case "competence":
      return "secondary";
    default:
      return "default";
  }
};

const getVariantLabel = (variant: string) => {
  switch (variant) {
    case "knowledge":
      return "Knowledge";
    case "skill":
      return "Skill";
    case "competence":
      return "Competence";
    default:
      return variant;
  }
};

const TitleIconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.custom.accent.teal,
}));

const StyledQuizIcon = styled(QuizIcon)(({ theme }) => ({
  fontSize: "2rem",
  marginRight: theme.spacing(1),
}));

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
        ...theme.applyStyles("dark", {
          color: "inherit",
        }),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

interface QuizCardProps {
  quiz: BasicTest;
  onClick: (quizId: string) => void;
  onAddQuestions: (quizId: string) => void;
  onDelete: (quizId: string) => void;
}

const QuizCard = ({
  quiz,
  onClick,
  onAddQuestions,
  onDelete,
}: QuizCardProps) => {
  // States
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handlers
  const handleAddQuestions = () => {
    onAddQuestions(quiz.id);
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setShowDeleteConfirm(true);
    handleClose();
  };

  const handleDeleteConfirm = () => {
    onDelete(quiz.id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <StyledCard onClick={handleAddQuestions}>
        <CardContent>
          <IconWrapper>
            <TitleIconWrapper>
              <StyledQuizIcon />
            </TitleIconWrapper>
            <IconButton
              aria-controls={open ? "demo-customized-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              size="small"
            >
              <MoreIcon />
            </IconButton>
          </IconWrapper>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {quiz.title}
            </Typography>
            <Chip
              label={getVariantLabel(quiz.variant)}
              color={getVariantColor(quiz.variant)}
              size="small"
            />
          </Box>
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

        <StyledMenu
          id="demo-customized-menu"
          slotProps={{
            list: {
              "aria-labelledby": "demo-customized-button",
            },
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              event.stopPropagation();
              onClick(quiz.id);
              handleClose();
            }}
            disableRipple
          >
            <EditIcon />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} disableRipple>
            <DeleteIcon />
            Delete
          </MenuItem>
        </StyledMenu>
      </StyledCard>
      <ConfirmAlert
        open={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Quiz"
        content={`Are you sure you want to delete "${quiz.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        label="delete-quiz"
      />
    </>
  );
};

export default QuizCard;
