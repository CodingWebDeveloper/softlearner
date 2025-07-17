import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  search: string;
  category: string;
  tags: string[];
}

const initialState: FilterState = {
  search: '',
  category: '',
  tags: [],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setTags(state, action: PayloadAction<string[]>) {
      state.tags = action.payload;
    },
    clearFilters(state) {
      state.search = '';
      state.category = '';
      state.tags = [];
    },
  },
});

export const { setSearch, setCategory, setTags, clearFilters } = filterSlice.actions;
export default filterSlice.reducer; 