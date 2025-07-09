'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Select, TextField, CircularProgress, MenuItem, Box, Chip, Autocomplete } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { trpc } from '@/lib/trpc/trpc';
import { 
  TagsTextField,
  TagsAutocompleteContainer,
  TagChipStyled,
  CloseIconStyled,
  ArrowDropDownIconStyled
} from '@/components/styles/courses/courses.styles';
import { useDispatch, useSelector } from 'react-redux';
import { addTag } from '@/lib/store/features/selectedTagsSlice';
import { RootState } from '@/lib/store';

interface TagOption {
  id: string;
  name: string;
}

interface TagsFilterProps {
  value: string[]; // array of tag IDs
  onChange: (tags: string[]) => void;
}

const DEBOUNCE_MS = 1000;

const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');

  const selectedTags = useSelector((state: RootState) => state.selectedTags.tags);

  // Debounce input value for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // Fetch tags with search and limit
  const { data: tags, isLoading, isFetching, error } = trpc.tags.getTags.useQuery(
    { search: search || undefined, limit: 10 },
  );

  // Use tag objects for options
  const tagOptions: TagOption[] = useMemo(() => tags || [], [tags]);

  // Filter tags by search (client-side fallback)
  const filteredTags = useMemo(() => {
    if (!tagOptions) return [];
    if (!search) return tagOptions;
    return tagOptions.filter(tag => tag.name.toLowerCase().includes(search.toLowerCase()));
  }, [tagOptions, search]);

  // Get selected tag objects for display (no longer needed for chips)
  const selectedTagObjects = useMemo(
    () => value.map(id =>
      tagOptions.find(tag => tag.id === id) ||
      { id, name: id }
    ),
    [tagOptions, value]
  );

  // Loading state (initial or searching)
  const loading = isLoading || isFetching;

  // Handle tag selection
  const handleTagSelect = (tagId: string) => {
    if (!value.includes(tagId)) {
      const selectedTag = tagOptions.find(tag => tag.id === tagId);
      if (selectedTag) {
        dispatch(addTag(selectedTag));
        onChange([...value, tagId]);
        setInputValue('');
      }
    }
  };

  // Handle custom tag creation
  const handleCustomTag = () => {
    if (inputValue.trim() && !value.includes(inputValue.trim())) {
      const customTag = { id: inputValue.trim(), name: inputValue.trim() };
      dispatch(addTag(customTag));
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  // Handle tag deletion
  const handleTagDelete = (tagId: string) => {
    onChange(value.filter(id => id !== tagId));
  };

  // Handle key press for custom tag creation
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleCustomTag();
    }
  };

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
            dispatch(addTag(newValue));
            onChange([newValue.id]);
          } else {
            onChange([]);
          }
          setInputValue('');
        }}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        loading={loading}
        popupIcon={<ArrowDropDownIconStyled color="inherit" />}
        getOptionDisabled={(option) => selectedTags.some(tag => tag.id === option.id)}
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
                  {loading ? <CircularProgress sx={{ color: theme.palette.custom.accent.teal }} size={18} /> : null}
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
                color: theme.palette.custom.text.white
              },
              "& .MuiAutocomplete-loading": {
                color: theme.palette.custom.accent.teal
              }
            },
          },
        }}
      />
    </TagsAutocompleteContainer>
  );
};

export default TagsFilter; 