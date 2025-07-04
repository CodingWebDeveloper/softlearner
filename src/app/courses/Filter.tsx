import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Autocomplete } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { FilterBar, FilterLabel, TagChip } from './courses.styled';

interface FilterProps {
  formik: any;
  allCategories: string[];
  allTags: string[];
  isMobile: boolean;
}

const Filter = ({ formik, allCategories, allTags }: FilterProps) => (
  <form onSubmit={formik.handleSubmit}>
    <FilterBar>
      <FilterLabel sx={{ color: '#fff' }}>Filter by:</FilterLabel>
      {/* Category */}
      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel id="category-label" sx={{ color: '#fff' }}>Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          name="category"
          value={formik.values.category}
          label="Category"
          onChange={formik.handleChange}
          aria-label="Filter by category"
          sx={{ color: '#fff', background: '#252730', '& .MuiSelect-icon': { color: '#4ecdc4' } }}
          MenuProps={{ PaperProps: { sx: { background: '#252730', color: '#fff' } } }}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {allCategories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Tags Autocomplete */}
      <Autocomplete
        multiple
        id="tags-autocomplete"
        options={allTags}
        value={formik.values.tags}
        onChange={(_, value) => formik.setFieldValue('tags', value)}
        filterSelectedOptions
        disableCloseOnSelect
        popupIcon={<ArrowDropDownIcon sx={{ color: '#4ecdc4' }} />}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Tags"
            sx={{ color: '#fff', background: '#252730', minWidth: 160, '& .MuiAutocomplete-endAdornment': { color: '#4ecdc4' }, '& .MuiInputLabel-root': { color: '#fff' } }}
          />
        )}
        sx={{ minWidth: 160, background: '#252730', color: '#fff', '& .MuiAutocomplete-endAdornment': { color: '#4ecdc4' } }}
        renderTags={(value, getTagProps) => {
          const visible = value.slice(0, 2);
          const extra = value.length - 2;
          return [
            ...visible.map((option, index) => (
              <TagChip
                label={option}
                {...getTagProps({ index })}
                sx={{ background: '#263238', color: '#4ecdc4', fontWeight: 500, fontSize: 15, px: 2, py: 0.5, borderRadius: '20px' }}
                deleteIcon={<CloseRoundedIcon sx={{ color: '#4ecdc4', fontSize: 18 }} />}
              />
            )),
            extra > 0 && (
              <TagChip
                key="extra-tags"
                label={`+${extra}`}
                sx={{ background: '#263238', color: '#fff', fontWeight: 500, fontSize: 15, px: 2, py: 0.5, borderRadius: '20px' }}
              />
            ),
          ].filter(Boolean);
        }}
      />
    </FilterBar>
  </form>
);

export default Filter; 