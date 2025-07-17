import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ReviewFiltersState {
  selectedRating: number | null;
  searchTerm: string;
}

const initialState: ReviewFiltersState = {
  selectedRating: null,
  searchTerm: '',
};

const reviewFiltersSlice = createSlice({
  name: 'reviewFilters',
  initialState,
  reducers: {
    setSelectedRating: (state, action: PayloadAction<number | null>) => {
      // If clicking the same rating, clear it
      state.selectedRating = state.selectedRating === action.payload ? null : action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearFilters: (state) => {
      state.selectedRating = null;
      state.searchTerm = '';
    },
  },
});

export const { setSelectedRating, setSearchTerm, clearFilters } = reviewFiltersSlice.actions;
export default reviewFiltersSlice.reducer; 