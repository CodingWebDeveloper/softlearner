"use client";

import { useEffect, useState, useMemo } from "react";
import { CircularProgress, Autocomplete } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { trpc } from "@/lib/trpc/trpc";
import {
  TagsTextField,
  TagsAutocompleteContainer,
  ArrowDropDownIconStyled,
} from "@/components/styles/courses/courses.styles";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectTags, setTags } from "@/lib/store/features/filterSlice";

interface TagOption {
  id: string;
  name: string;
}

const DEBOUNCE_MS = 1000;

const TagsFilter = () => {
  // General hooks
  const theme = useTheme();
  const dispatch = useAppDispatch();

  // Selectors
  const selectedTags = useAppSelector(selectTags);

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  // Debounce input value for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // Fetch tags with search and limit
  const {
    data: tags,
    isLoading,
    isFetching,
    error,
  } = trpc.tags.getTags.useQuery({ search: search || undefined, limit: 10 });

  // Use tag objects for options
  const tagOptions: TagOption[] = useMemo(() => tags || [], [tags]);

  // Loading state (initial or searching)
  const loading = isLoading || isFetching;

  // Error state
  if (error) {
    return (
      <TagsAutocompleteContainer>
        <TagsTextField
          variant="outlined"
          label="Tags"
          error
          helperText="Failed to load tags"
          disabled
        />
      </TagsAutocompleteContainer>
    );
  }

  return (
    <TagsAutocompleteContainer>
      <Autocomplete
        id="tags-autocomplete"
        options={tagOptions}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, val) => option.id === val.id}
        value={null}
        onChange={(_, newValue) => {
          if (newValue) {
            dispatch(setTags([...selectedTags, newValue]));
          }
          setInputValue("");
        }}
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
            label="Tags"
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
  );
};

export default TagsFilter;
