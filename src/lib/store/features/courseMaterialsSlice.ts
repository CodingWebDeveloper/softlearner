import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CourseMaterialsState {
  bookmarked: boolean;
  currentVideoId: number;
  tab: number;
}

const initialState: CourseMaterialsState = {
  bookmarked: false,
  currentVideoId: 1, // Default to first video
  tab: 0,
};

const courseMaterialsSlice = createSlice({
  name: 'courseMaterials',
  initialState,
  reducers: {
    toggleBookmark(state: CourseMaterialsState) {
      state.bookmarked = !state.bookmarked;
    },
    setCurrentVideo(state: CourseMaterialsState, action: PayloadAction<number>) {
      state.currentVideoId = action.payload;
    },
    setTab(state: CourseMaterialsState, action: PayloadAction<number>) {
      state.tab = action.payload;
    },
  },
});

export const { toggleBookmark, setCurrentVideo, setTab } = courseMaterialsSlice.actions;
export default courseMaterialsSlice.reducer; 

export const selectCurrentVideoId = (state: RootState) => state.courseMaterials.currentVideoId;