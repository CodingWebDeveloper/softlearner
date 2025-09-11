import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export type Status = "NEW" | "UPDATED" | "DELETED" | "INITIAL";

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  status: Status;
}

export interface Question {
  id: string;
  text: string;
  type: "single" | "multiple";
  points: number;
  options: Option[];
  status: Status;
}

export type QuestionField = keyof Question;
export type OptionField = keyof Option;

interface QuestionsState {
  questions: Question[];
  testId: string | null;
}

const initialState: QuestionsState = {
  questions: [],
  testId: null,
};

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    initializeQuestions: (
      state,
      action: PayloadAction<{ questions: Question[]; testId: string }>
    ) => {
      // Mark all loaded questions as initial (not new)
      const questionsWithStatus = action.payload.questions.map(question => ({
        ...question,
        status: "INITIAL" as Status, // Existing questions are marked as INITIAL initially
        options: question.options.map(option => ({
          ...option,
          status: "INITIAL" as Status, // Existing options are marked as INITIAL initially
        })),
      }));
      
      state.questions = questionsWithStatus;
      state.testId = action.payload.testId;
    },
    addQuestion: (state) => {
      const newQuestion: Question = {
        id: crypto.randomUUID(),
        text: "",
        type: "single",
        points: 1,
        options: [],
        status: "NEW",
      };
      state.questions.push(newQuestion);
    },
    updateQuestion: (
      state,
      action: PayloadAction<{
        questionId: string;
        field: QuestionField;
        value: string | number | "single" | "multiple";
      }>
    ) => {
      const { questionId, field, value } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);
      if (question) {
        if (field === "points") {
          question.points = Number(value);
        } else if (field === "text") {
          question.text = value as string;
        } else if (field === "type") {
          question.type = value as "single" | "multiple";
        }
        
        // Mark as UPDATED if it's not a new question
        if (question.status !== "NEW") {
          question.status = "UPDATED";
        }
      }
    },
    deleteQuestion: (state, action: PayloadAction<string>) => {
      const question = state.questions.find((q) => q.id === action.payload);
      if (question) {
        if (question.status === "NEW") {
          // Remove from state if it was never saved
          state.questions = state.questions.filter(
            (q) => q.id !== action.payload
          );
        } else {
          // Mark as DELETED if it was previously saved
          question.status = "DELETED";
        }
      }
    },
    addOption: (state, action: PayloadAction<string>) => {
      const questionId = action.payload;
      const question = state.questions.find((q) => q.id === questionId);
      if (question) {
        const newOption: Option = {
          id: crypto.randomUUID(),
          text: "",
          isCorrect: false,
          status: "NEW",
        };
        question.options.push(newOption);
      }
    },
    updateOption: (
      state,
      action: PayloadAction<{
        questionId: string;
        optionId: string;
        field: OptionField;
        value: string | boolean;
      }>
    ) => {
      const { questionId, optionId, field, value } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);
      if (question) {
        const option = question.options.find((o) => o.id === optionId);
        if (option) {
          if (field === "isCorrect") {
            option.isCorrect = value === "true" || value === true;
          } else if (field === "text") {
            option.text = value as string;
          }
          
          // Mark as UPDATED if it's not a new option
          if (option.status !== "NEW") {
            option.status = "UPDATED";
          }
        }
      }
    },
    deleteOption: (
      state,
      action: PayloadAction<{ questionId: string; optionId: string }>
    ) => {
      const { questionId, optionId } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);
      if (question) {
        const option = question.options.find((o) => o.id === optionId);
        if (option) {
          if (option.status === "NEW") {
            // Remove from state if it was never saved
            question.options = question.options.filter((o) => o.id !== optionId);
          } else {
            // Mark as DELETED if it was previously saved
            option.status = "DELETED";
          }
        }
      }
    },
    resetQuestions: () => initialState,
    markQuestionAsSaved: (state, action: PayloadAction<string>) => {
      const question = state.questions.find((q) => q.id === action.payload);
      if (question) {
        question.status = "UPDATED";
        // Also mark all options as saved
        question.options.forEach(option => {
          if (option.status === "NEW") {
            option.status = "UPDATED";
          }
        });
      }
    },
    markOptionAsSaved: (
      state,
      action: PayloadAction<{ questionId: string; optionId: string }>
    ) => {
      const { questionId, optionId } = action.payload;
      const question = state.questions.find((q) => q.id === questionId);
      if (question) {
        const option = question.options.find((o) => o.id === optionId);
        if (option) {
          option.status = "UPDATED";
        }
      }
    },
    clearDeletedItems: (state) => {
      // Remove all items marked as DELETED from the state
      state.questions = state.questions.filter(q => q.status !== "DELETED");
      state.questions.forEach(question => {
        question.options = question.options.filter(option => option.status !== "DELETED");
      });
    },
  },
});

export const {
  initializeQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addOption,
  updateOption,
  deleteOption,
  resetQuestions,
  markQuestionAsSaved,
  markOptionAsSaved,
  clearDeletedItems,
} = questionsSlice.actions;

// Selectors
export const selectQuestions = (state: RootState) => state.questions.questions;
export const selectTestId = (state: RootState) => state.questions.testId;
export const selectQuestionById = (questionId: string) => (state: RootState) =>
  state.questions.questions.find((q) => q.id === questionId);
export const selectQuestionsCount = (state: RootState) =>
  state.questions.questions.length;
export const selectHasQuestions = (state: RootState) =>
  state.questions.questions.length > 0;

// Status-based selectors
export const selectQuestionsByStatus = (status: Status) => (state: RootState) =>
  state.questions.questions.filter((q) => q.status === status);

export const selectNewQuestions = (state: RootState) =>
  state.questions.questions.filter((q) => q.status === "NEW");

export const selectUpdatedQuestions = (state: RootState) =>
  state.questions.questions.filter((q) => q.status === "UPDATED");

export const selectDeletedQuestions = (state: RootState) =>
  state.questions.questions.filter((q) => q.status === "DELETED");

export const selectActiveQuestions = (state: RootState) =>
  state.questions.questions.filter((q) => q.status !== "DELETED");

export const selectInitialQuestions = (state: RootState) =>
  state.questions.questions.filter((q) => q.status === "INITIAL");

export const selectOptionsByStatus = (questionId: string, status: Status) => (state: RootState) => {
  const question = state.questions.questions.find((q) => q.id === questionId);
  return question ? question.options.filter((o) => o.status === status) : [];
};

export const selectNewOptions = (questionId: string) => (state: RootState) => {
  const question = state.questions.questions.find((q) => q.id === questionId);
  return question ? question.options.filter((o) => o.status === "NEW") : [];
};

export const selectUpdatedOptions = (questionId: string) => (state: RootState) => {
  const question = state.questions.questions.find((q) => q.id === questionId);
  return question ? question.options.filter((o) => o.status === "UPDATED") : [];
};

export const selectDeletedOptions = (questionId: string) => (state: RootState) => {
  const question = state.questions.questions.find((q) => q.id === questionId);
  return question ? question.options.filter((o) => o.status === "DELETED") : [];
};

export const selectInitialOptions = (questionId: string) => (state: RootState) => {
  const question = state.questions.questions.find((q) => q.id === questionId);
  return question ? question.options.filter((o) => o.status === "INITIAL") : [];
};

export default questionsSlice.reducer;
