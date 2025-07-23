import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface CourseMaterialsState {
  resource: {
    id: string;
    videoUrl: string;
  } | null;
}

const initialState: CourseMaterialsState = {
  resource: null,
};

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    setResource(
      state: CourseMaterialsState,
      action: PayloadAction<{ id: string; videoUrl: string }>
    ) {
      state.resource = action.payload;
    },
  },
});

export const { setResource } = resourceSlice.actions;
export default resourceSlice.reducer;
export const selectResource = (state: RootState) => state.resource.resource;
