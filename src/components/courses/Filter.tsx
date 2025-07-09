import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  FilterBar, 
  FilterLabel, 
  CategorySelect,
  CategoryInputLabel,
  FormControlStyled,
  ArrowDropDownIconStyled
} from '@/components/styles/courses/courses.styles';
import TagsFilter from './tags-filter';

interface FilterProps {
  formik: any;
  allCategories: string[];
  isMobile: boolean;
}

const Filter = ({ formik, allCategories }: FilterProps) => {
  const theme = useTheme();
  
  return (
    <form onSubmit={formik.handleSubmit}>
      <FilterBar>
        <FilterLabel>Filter by:</FilterLabel>
        {/* Category */}
        <FormControlStyled size="small">
          <CategoryInputLabel id="category-label">Category</CategoryInputLabel>
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
        </FormControlStyled>
        {/* Tags Filter */}
        <TagsFilter
          value={formik.values.tags}
          onChange={(tags) => formik.setFieldValue('tags', tags)}
        />
      </FilterBar>
    </form>
  );
};

export default Filter; 