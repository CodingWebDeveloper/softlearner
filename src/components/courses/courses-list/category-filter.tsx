import { useEffect, useState, useMemo } from "react";
import { Autocomplete, CircularProgress, useTheme } from "@mui/material";
import {
  ArrowDropDownIconStyled,
  TagsAutocompleteContainer,
  TagsTextField,
} from "@/components/styles/courses/courses.styles";
import { trpc } from "@/lib/trpc/client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectCategoryId,
  setCategory,
} from "@/lib/store/features/filterSlice";

interface Category {
  id: string;
  name: string;
}

const DEBOUNCE_MS = 1000;

export const CategoryFilter = () => {
  // General hooks
  const theme = useTheme();
  const dispatch = useAppDispatch();

  // Selectors
  const selectedCategoryId = useAppSelector(selectCategoryId);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  // Debounce input value for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // Fetch categories with search
  const {
    data: categories,
    isLoading,
    isFetching,
    error,
  } = trpc.categories.getCategories.useQuery<Category[]>();

  // Filter categories by search (client-side, since backend doesn't support search param yet)
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    if (!search) return categories;
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  // Find selected category name
  const selectedCategory = useMemo(() => {
    if (!categories || !selectedCategoryId) return null;
    return categories.find((cat) => cat.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  // Loading state (initial or searching)
  const loading = isLoading || isFetching;

  // Error state
  if (error) {
    return (
      <TagsAutocompleteContainer>
        <TagsTextField
          variant="outlined"
          label="Category"
          error
          helperText="Failed to load categories"
          disabled
        />
      </TagsAutocompleteContainer>
    );
  }

  return (
    <TagsAutocompleteContainer>
      <Autocomplete<Category>
        id="category-autocomplete"
        options={filteredCategories}
        getOptionLabel={(option) => option.name}
        value={selectedCategory}
        onChange={(_, newValue) => {
          dispatch(setCategory(newValue ? newValue.id : ""));
        }}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        loading={loading}
        popupIcon={<ArrowDropDownIconStyled color="inherit" />}
        renderInput={(params) => (
          <TagsTextField
            {...params}
            variant="outlined"
            label="Category"
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
        disableClearable={false}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
      />
    </TagsAutocompleteContainer>
  );
};
