
import { useTheme } from '@mui/material/styles';
import { 
  FilterBar, 
  FilterLabel, 
} from '@/components/styles/courses/courses.styles';
import TagsFilter from './tags-filter';
import { CategoryFilter } from './category-filter';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { setCategory, setTags } from '@/lib/store/features/filterSlice';

interface FilterProps {
  isMobile: boolean;
}

const Filter = ({ isMobile }: FilterProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { category, tags } = useAppSelector((state) => state.filter);

  return (
    <FilterBar>
      <FilterLabel>Filter by:</FilterLabel>
      {/* Category */}
      <CategoryFilter
        value={category}
        onChange={(newCategory: string) => dispatch(setCategory(newCategory))}
        theme={theme}
      />
      {/* Tags Filter */}
      <TagsFilter
        value={tags}
        onChange={(newTags: string[]) => dispatch(setTags(newTags))}
      />
    </FilterBar>
  );
};

export default Filter; 