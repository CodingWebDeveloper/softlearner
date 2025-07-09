'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Autocomplete, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { trpc } from '@/lib/trpc/trpc';
import { 
  TagsTextField,
  TagsAutocompleteContainer,
  TagChipStyled,
  CloseIconStyled,
  ExtraTagChip,
  ArrowDropDownIconStyled
} from '@/components/styles/courses/courses.styles';

interface TagsFilterProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

const DEBOUNCE_MS = 1000;

const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');

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

  // Extract tag names for the autocomplete options
  const tagOptions = useMemo(() => tags?.map(tag => tag.name) || [], [tags]);

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
        multiple
        id="tags-autocomplete"
        options={tagOptions}
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        filterSelectedOptions
        disableCloseOnSelect
        popupIcon={<ArrowDropDownIconStyled />}
        loading={loading}
        renderInput={(params) => (
          <TagsTextField
            {...params}
            variant="outlined"
            label="Tags"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress sx={{  color: theme.palette.custom.accent.teal }} size={18} /> : null}
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
                color: theme.palette.custom.text.white
              },
              "& .MuiAutocomplete-loading": {
                color: theme.palette.custom.accent.teal
              }
            },
          },
        }}
        renderTags={(value, getTagProps) => {
          const visible = value.slice(0, 2);
          const extra = value.length - 2;
          return [
            ...visible.map((option, index) => (
              <TagChipStyled
                label={option}
                {...getTagProps({ index })}
                deleteIcon={<CloseIconStyled />}
              />
            )),
            extra > 0 && (
              <ExtraTagChip
                key="extra-tags"
                label={`+${extra}`}
              />
            ),
          ].filter(Boolean);
        }}
      />
    </TagsAutocompleteContainer>
  );
};

export default TagsFilter; 