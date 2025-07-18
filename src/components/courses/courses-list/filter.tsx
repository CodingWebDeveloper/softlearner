import {
  FilterBar,
  FilterLabel,
} from "@/components/styles/courses/courses.styles";
import TagsFilter from "./tags-filter";
import { CategoryFilter } from "./category-filter";

const Filter = () => {
  return (
    <FilterBar>
      <FilterLabel>Filter by:</FilterLabel>
      {/* Category */}
      <CategoryFilter />
      {/* Tags Filter */}
      <TagsFilter />
    </FilterBar>
  );
};

export default Filter;
