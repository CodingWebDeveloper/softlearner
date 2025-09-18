"use client";

import { useEffect, useState, useMemo } from "react";
import { CircularProgress, Autocomplete, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { trpc } from "@/lib/trpc/client";
import { useSnackbar } from "notistack";
import {
  TagsTextField,
  TagsAutocompleteContainer,
  ArrowDropDownIconStyled,
  TagsFormContainer,
  SelectedTagsContainer,
  TagChip,
  SaveButtonContainer,
} from "@/components/styles/creator/course-tags-form.styles";
import { Tag } from "@/lib/database/database.types";
import { SaveOrderButton } from "@/components/styles/creator/resources-form.styles";

interface CourseTagsFormProps {
  courseId: string | null;
  initialTags?: Tag[];
  onSave?: () => void;
}

interface TagOption {
  id: string;
  name: string;
}

const DEBOUNCE_MS = 1000;

const CourseTagsForm = ({
  courseId,
  initialTags = [],
}: CourseTagsFormProps) => {
  // Theme
  const theme = useTheme();

  // Local state
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<TagOption[]>(initialTags);
  const [originalTags, setOriginalTags] = useState<TagOption[]>(initialTags);

  // TRPC utils
  const utils = trpc.useUtils();

  // Mutations
  const {
    mutateAsync: createTagsByCourse,
    isPending: isPendingCreateTagsByCourse,
  } = trpc.tags.createTagsByCourse.useMutation();

  // Queries
  const { data: courseTags, isPending: isPendingCourseTags } =
    trpc.tags.getTagsByCourseId.useQuery(
      { courseId: courseId! },
      {
        enabled: Boolean(courseId),
      }
    );
  const {
    data: tags,
    isPending: isPendingTags,
    error,
  } = trpc.tags.getTags.useQuery({ search: search || undefined, limit: 10 });

  const tagOptions: TagOption[] = useMemo(() => tags || [], [tags]);

  const loading = isPendingTags || isPendingCourseTags;

  // Check if there are changes to the tags
  const hasChanges = useMemo(() => {
    if (originalTags.length !== selectedTags.length) {
      return true;
    }

    // Check if all original tags are still present
    const originalTagIds = new Set(originalTags.map((tag) => tag.id));
    const selectedTagIds = new Set(selectedTags.map((tag) => tag.id));

    for (const tagId of originalTagIds) {
      if (!selectedTagIds.has(tagId)) {
        return true;
      }
    }

    for (const tagId of selectedTagIds) {
      if (!originalTagIds.has(tagId)) {
        return true;
      }
    }

    return false;
  }, [originalTags, selectedTags]);

  // Handlers
  const handleTagAdd = (newTag: TagOption | null) => {
    if (newTag && !selectedTags.some((tag) => tag.id === newTag.id)) {
      setSelectedTags([...selectedTags, newTag]);
    }
    setInputValue("");
  };

  const handleTagDelete = (tagToDelete: TagOption) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagToDelete.id));
  };

  // Snackbar
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = async () => {
    try {
      await createTagsByCourse({
        courseId: courseId!,
        tagIds: selectedTags.map((tag) => tag.id),
      });

      await utils.tags.getTagsByCourseId.invalidate({ courseId: courseId! });
      await utils.courses.getCourseProgressStatus.invalidate(courseId!);

      enqueueSnackbar("Course tags updated successfully", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : "Failed to update course tags",
        {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        }
      );
    }
  };

  // Effects
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    if (courseTags) {
      setSelectedTags(courseTags);
      setOriginalTags(courseTags);
    }
  }, [courseTags]);

  // Error state
  if (error) {
    return (
      <TagsFormContainer>
        <TagsAutocompleteContainer>
          <TagsTextField
            variant="outlined"
            label="Tags"
            error
            helperText="Failed to load tags"
            disabled
          />
        </TagsAutocompleteContainer>
      </TagsFormContainer>
    );
  }

  return (
    <TagsFormContainer>
      <TagsAutocompleteContainer>
        <Autocomplete
          id="tags-autocomplete"
          options={tagOptions}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          value={null}
          onChange={(_, newValue) => handleTagAdd(newValue)}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          loading={loading}
          popupIcon={<ArrowDropDownIconStyled color="inherit" />}
          getOptionDisabled={(option) =>
            selectedTags.some((tag) => tag.id === option.id)
          }
          renderInput={(params) => (
            <TagsTextField
              {...params}
              variant="outlined"
              label="Search Tags"
              autoComplete="off"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress
                        sx={{ color: theme.palette.custom.accent.teal }}
                        size={18}
                      />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          filterOptions={(x) => x}
          slotProps={{
            paper: {
              sx: {
                background: theme.palette.custom.background.secondary,
                color: theme.palette.custom.text.white,
                "& .MuiAutocomplete-noOptions": {
                  background: theme.palette.custom.background.secondary,
                  color: theme.palette.custom.text.white,
                },
                "& .MuiAutocomplete-loading": {
                  color: theme.palette.custom.accent.teal,
                },
              },
            },
          }}
        />
      </TagsAutocompleteContainer>

      {selectedTags.length > 0 ? (
        <SelectedTagsContainer>
          {selectedTags.map((tag) => (
            <TagChip
              key={tag.id}
              label={tag.name}
              onDelete={() => handleTagDelete(tag)}
            />
          ))}
        </SelectedTagsContainer>
      ) : (
        <Alert severity="info">
          No tags have been added yet. Select tags and click Save Changes.
        </Alert>
      )}

      <SaveButtonContainer>
        <SaveOrderButton
          variant="contained"
          onClick={handleSave}
          disabled={isPendingCreateTagsByCourse || !hasChanges}
          sx={{
            backgroundColor: theme.palette.custom.accent.teal,
            "&:hover": {
              backgroundColor: theme.palette.custom.accent.tealDark,
            },
          }}
        >
          {isPendingCreateTagsByCourse ? (
            <CircularProgress color="inherit" size={18} />
          ) : (
            "Save Changes"
          )}
        </SaveOrderButton>
      </SaveButtonContainer>
    </TagsFormContainer>
  );
};

export default CourseTagsForm;
