import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { createSelector } from "@reduxjs/toolkit";

interface TagItem {
  id: string;
  name: string;
}

interface FilterState {
  search: string;
  categoryId: string;
  tags: TagItem[];
}

const initialState: FilterState = {
  search: "",
  categoryId: "",
  tags: [],
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.categoryId = action.payload;
    },
    setTags(state, action: PayloadAction<TagItem[]>) {
      state.tags = action.payload;
    },
    clearFilters(state) {
      state.search = "";
      state.categoryId = "";
      state.tags = [];
    },
  },
});

export const { setSearch, setCategory, setTags, clearFilters } =
  filterSlice.actions;
export default filterSlice.reducer;

// Base selector
const selectFilter = (state: RootState) => state.filter;

// Individual selectors
export const selectSearch = createSelector(
  selectFilter,
  (filter) => filter.search
);

export const selectCategoryId = createSelector(
  selectFilter,
  (filter) => filter.categoryId
);

export const selectTags = createSelector(selectFilter, (filter) => filter.tags);

// Combined selector for all filters
export const selectAllFilters = createSelector(selectFilter, (filter) => ({
  search: filter.search,
  categoryId: filter.categoryId,
  tags: filter.tags,
}));
