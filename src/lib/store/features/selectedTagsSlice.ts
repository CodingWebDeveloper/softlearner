import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Tag {
  id: string;
  name: string;
}

interface SelectedTagsState {
  tags: Tag[];
}

const initialState: SelectedTagsState = {
  tags: [],
};

const selectedTagsSlice = createSlice({
  name: 'selectedTags',
  initialState,
  reducers: {
    addTag: (state, action: PayloadAction<Tag>) => {
      if (!state.tags.some(tag => tag.id === action.payload.id)) {
        state.tags.push(action.payload);
      }
    },
    removeTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(tag => tag.id !== action.payload);
    },
    setTags: (state, action: PayloadAction<Tag[]>) => {
      state.tags = action.payload;
    },
    clearTags: (state) => {
      state.tags = [];
    }
  },
});

export const { addTag, removeTag, setTags, clearTags } = selectedTagsSlice.actions;
export default selectedTagsSlice.reducer; 