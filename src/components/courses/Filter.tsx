
import { useTheme } from '@mui/material/styles';
import { 
  FilterBar, 
  FilterLabel, 
} from '@/components/styles/courses/courses.styles';
import TagsFilter from './tags-filter';
import TagsList from './tags-list';
import { CategoryFilter } from './category-filter';

interface FilterProps {
  formik: any;
  isMobile: boolean;
}

const Filter = ({ formik }: FilterProps) => {
  const theme = useTheme();
  
  return (
    <form onSubmit={formik.handleSubmit}>
      <FilterBar>
        <FilterLabel>Filter by:</FilterLabel>
        {/* Category */}
        <CategoryFilter formik={formik} theme={theme} />
        {/* Tags Filter */}
        <TagsFilter
          value={formik.values.tags}
          onChange={(tags) => formik.setFieldValue('tags', tags)}
        />
      </FilterBar>
      <TagsList />
    </form>
  );
};

export default Filter; 