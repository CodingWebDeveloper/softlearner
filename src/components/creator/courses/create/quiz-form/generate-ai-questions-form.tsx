"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { trpc } from "@/lib/trpc/client";
import { AiDifficulty } from "@/services/interfaces/service.interfaces";

interface GenerateAIQuestionsFormProps {
  open: boolean;
  onClose: () => void;
  onQuestionsGenerated: (questions: GeneratedQuestion[]) => void;
}

export interface GeneratedQuestion {
  text: string;
  type: "single" | "multiple";
  points: number;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

const GenerateAIQuestionsForm = ({
  open,
  onClose,
  onQuestionsGenerated,
}: GenerateAIQuestionsFormProps) => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<AiDifficulty>("medium");
  const [error, setError] = useState<string | null>(null);

  const generateQuestionsMutation = trpc.aiTests.generateQuestions.useMutation({
    onSuccess: (data) => {
      onQuestionsGenerated(data);
      handleClose();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleClose = () => {
    setTopic("");
    setNumQuestions(5);
    setDifficulty("medium");
    setError(null);
    onClose();
  };

  const handleGenerate = () => {
    if (!topic.trim()) {
      setError("Topic is required");
      return;
    }
    setError(null);
    generateQuestionsMutation.mutate({
      topic: topic.trim(),
      numQuestions,
      difficulty,
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate AI Questions</DialogTitle>
      <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <TextField
              label="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., JavaScript fundamentals, World War II, Calculus"
              fullWidth
              required
              disabled={generateQuestionsMutation.isPending}
            />

            <TextField
              label="Number of Questions"
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              inputProps={{ min: 1, max: 20 }}
              fullWidth
              disabled={generateQuestionsMutation.isPending}
            />

            <FormControl fullWidth disabled={generateQuestionsMutation.isPending}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as AiDifficulty)}
                label="Difficulty"
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={generateQuestionsMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleGenerate(); }}
            variant="contained"
            disabled={generateQuestionsMutation.isPending || !topic.trim()}
            startIcon={generateQuestionsMutation.isPending ? <CircularProgress size={16} /> : null}
          >
            {generateQuestionsMutation.isPending ? "Generating..." : "Generate Questions"}
          </Button>
        </DialogActions>
    </Dialog>
  );
};

export default GenerateAIQuestionsForm;
