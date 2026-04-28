import React from "react";
import {
  Box,
  CardContent,
  Grid,
  Stack,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Help as HelpIcon,
} from "@mui/icons-material";
import { Field, FieldArray, useFormikContext } from "formik";
import {
  StyledButton,
  WhiteText,
} from "@/components/styles/infrastructure/layout.styles";
import {
  AlertInfo,
  AlertWarning,
  DeleteIconButton,
  OptionInputCard,
  StyledChip,
  StyledQuestionInputCard,
  StyledSelect,
  StyledTextField,
} from "@/components/styles/creator/question-input-card.styles";
import { QuestionInput } from "./quiz-questions";

interface QuestionInputCardProps {
  question: QuestionInput;
  index: number;
  remove: (index: number) => void;
  totalQuestions?: number;
}

const QuestionInputCard: React.FC<QuestionInputCardProps> = ({
  question,
  index,
  remove,
}) => {
  const { setFieldValue, handleChange, values } = useFormikContext();

  const theme = useTheme();
  const hasOptions = question.options && question.options.length > 0;
  const correctOptionsCount =
    question.options?.filter((opt) => opt.isCorrect)?.length || 0;

  const withStatus =
    (fieldPath: string, statusPath: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e);
      const currentStatus = statusPath
        .split(".")
        .reduce<unknown>((acc, key) => {
          if (typeof acc === "object" && acc !== null) {
            return (acc as Record<string, unknown>)[key];
          }
          return undefined;
        }, values as unknown);

      if (currentStatus === "NEW") {
        return;
      }
      setFieldValue(statusPath, "UPDATED");
    };

  return (
    <StyledQuestionInputCard elevation={0}>
      <CardContent sx={{ p: 3 }}>
        {/* Header Section */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            {/* <StyledDragIcon /> */}
            <WhiteText variant="h6" component="h3">
              Question {index + 1}
            </WhiteText>
            {correctOptionsCount > 0 && (
              <StyledChip
                size="small"
                label={`${correctOptionsCount} correct answer${
                  correctOptionsCount !== 1 ? "s" : ""
                }`}
              />
            )}
          </Box>

          <DeleteIconButton
            onClick={() => remove(index)}
            size="small"
            hasQuestions={question.options.length > 1}
          >
            <DeleteIcon />
          </DeleteIconButton>
        </Box>

        {/* Question Input Section */}
        <Grid container spacing={3} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 6 }}>
            <Field
              name={`questions.${index}.text`}
              as={StyledTextField}
              label="Question Text"
              placeholder="Enter your question here..."
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              helperText="Be clear and specific in your question"
              onChange={withStatus(
                `questions.${index}.text`,
                `questions.${index}.status`,
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: theme.palette.custom.text.light }}>
                Question Type
              </InputLabel>
              <Field
                name={`questions.${index}.type`}
                as={StyledSelect}
                label="Question Type"
                onChange={withStatus(
                  `questions.${index}.type`,
                  `questions.${index}.status`,
                )}
              >
                <MenuItem value="single">Single Choice</MenuItem>
                <MenuItem value="multiple">Multiple Choice</MenuItem>
              </Field>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Field
              name={`questions.${index}.points`}
              as={StyledTextField}
              type="number"
              label="Points"
              placeholder="0"
              inputProps={{ min: 0, max: 100 }}
              helperText="Max 100 points"
              onChange={withStatus(
                `questions.${index}.points`,
                `questions.${index}.status`,
              )}
            />
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 3,
            borderColor: theme.palette.custom.background.tertiary,
          }}
        />

        {/* Options Section */}
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <WhiteText variant="subtitle1">Answer Options</WhiteText>
            <Tooltip title="Add at least 2 options. Mark the correct answer(s).">
              <HelpIcon
                sx={{ fontSize: 16, color: theme.palette.custom.text.light }}
              />
            </Tooltip>
          </Box>

          <FieldArray name={`questions.${index}.options`}>
            {({ push, remove: removeOption }) => (
              <Stack spacing={2}>
                {!hasOptions && (
                  <AlertInfo severity="info">
                    Add answer options for this question. You need at least 2
                    options.
                  </AlertInfo>
                )}

                {question.options?.map((option, optionIndex) => (
                  <OptionInputCard
                    key={option.id}
                    variant="outlined"
                    iscorrect={option.isCorrect}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Field
                          name={`questions.${index}.options.${optionIndex}.text`}
                          as={StyledTextField}
                          label={`Option ${String.fromCharCode(
                            65 + optionIndex,
                          )}`}
                          placeholder="Enter answer option..."
                          fullWidth
                          size="small"
                          onChange={withStatus(
                            `questions.${index}.options.${optionIndex}.text`,
                            `questions.${index}.options.${optionIndex}.status`,
                          )}
                        />
                      </Grid>

                      <Grid size={{ xs: 10, sm: 4 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel
                            sx={{ color: theme.palette.custom.text.light }}
                          >
                            Correctness
                          </InputLabel>
                          <Field
                            name={`questions.${index}.options.${optionIndex}.isCorrect`}
                            as={StyledSelect}
                            label="Correctness"
                            onChange={withStatus(
                              `questions.${index}.options.${optionIndex}.isCorrect`,
                              `questions.${index}.options.${optionIndex}.status`,
                            )}
                          >
                            <MenuItem value={false}>Incorrect</MenuItem>
                            <MenuItem value={true}>
                              <Box display="flex" alignItems="center" gap={1}>
                                Correct
                                <span
                                  style={{
                                    color: theme.palette.custom.accent.green,
                                  }}
                                >
                                  ✓
                                </span>
                              </Box>
                            </MenuItem>
                          </Field>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 2 }}>
                        <Tooltip title="Delete option">
                          <DeleteIconButton
                            onClick={() => removeOption(optionIndex)}
                            size="small"
                            hasQuestions={question.options.length > 1}
                            disabled={question.options.length <= 1}
                          >
                            <DeleteIcon fontSize="small" />
                          </DeleteIconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </OptionInputCard>
                ))}

                <Box display="flex" justifyContent="center" mt={2}>
                  <StyledButton
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      push({
                        id: crypto.randomUUID(),
                        text: "",
                        isCorrect: false,
                        status: "NEW",
                      })
                    }
                  >
                    Add Answer Option
                  </StyledButton>
                </Box>
              </Stack>
            )}
          </FieldArray>
        </Box>

        {/* Validation Warnings */}
        {hasOptions && correctOptionsCount === 0 && (
          <AlertWarning severity="warning">
            Please mark at least one option as correct.
          </AlertWarning>
        )}

        {question.type === "single" && correctOptionsCount > 1 && (
          <AlertWarning severity="warning">
            Single choice questions should have only one correct answer.
          </AlertWarning>
        )}
      </CardContent>
    </StyledQuestionInputCard>
  );
};

export default QuestionInputCard;
