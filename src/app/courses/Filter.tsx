import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Autocomplete } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { 
  FilterBar, 
  FilterLabel, 
  TagChip, 
  CategorySelect,
  CategoryInputLabel,
  TagsAutocomplete,
  TagsTextField,
  TagsAutocompleteContainer,
  TagChipStyled,
  CloseIconStyled,
  ExtraTagChip
} from './courses.styled';

interface FilterProps {
  formik: any;
  allCategories: string[];
  allTags: string[];
  isMobile: boolean;
}

const Filter = ({ formik, allCategories, allTags }: FilterProps) => {
  const theme = useTheme();
  
  return (
    <form onSubmit={formik.handleSubmit}>
      <FilterBar>
        <FilterLabel sx={{ color: theme.palette.custom.text.white }}>Filter by:</FilterLabel>
        {/* Category */}
        <FormControl sx={{ minWidth: 120 }} size="small">
          <CategoryInputLabel id="category-label" sx={{ color: theme.palette.custom.text.white }}>Category</CategoryInputLabel>
          <CategorySelect
            labelId="category-label"
            id="category"
            name="category"
            value={formik.values.category}
            label="Category"
            onChange={formik.handleChange}
            aria-label="Filter by category"
            MenuProps={{ PaperProps: { sx: { background: theme.palette.custom.background.secondary, color: theme.palette.custom.text.white } } }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {allCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </CategorySelect>
        </FormControl>
        {/* Tags Autocomplete */}
        <TagsAutocompleteContainer>
          <Autocomplete
            multiple
            id="tags-autocomplete"
            options={allTags}
            value={formik.values.tags}
            onChange={(_, value) => formik.setFieldValue('tags', value)}
            filterSelectedOptions
            disableCloseOnSelect
            popupIcon={<ArrowDropDownIcon sx={{ color: theme.palette.custom.accent.teal }} />}
            renderInput={(params) => (
              <TagsTextField
                {...params}
                variant="outlined"
                label="Tags"
              />
            )}
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
      </FilterBar>
    </form>
  );
};

export default Filter; 