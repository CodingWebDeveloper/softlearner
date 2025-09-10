import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: "single" | "multiple";
  points: number;
  options: Option[];
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
      state.questions = action.payload.questions;
      state.testId = action.payload.testId;
    },
    addQuestion: (state) => {
      const newQuestion: Question = {
        id: crypto.randomUUID(),
        text: "",
        type: "single",
        points: 1,
        options: [],
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
      }
    },
    deleteQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter(
        (q) => q.id !== action.payload
      );
    },
    addOption: (state, action: PayloadAction<string>) => {
      const questionId = action.payload;
      const question = state.questions.find((q) => q.id === questionId);
      if (question) {
        const newOption: Option = {
          id: crypto.randomUUID(),
          text: "",
          isCorrect: false,
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
        question.options = question.options.filter((o) => o.id !== optionId);
      }
    },
    resetQuestions: () => initialState,
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

export default questionsSlice.reducer;
