import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { BasicResource } from "@/services/interfaces/service.interfaces";

interface ResourceState {
  selectedResource: BasicResource | null;
}

const initialState: ResourceState = {
  selectedResource: null,
};

export const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    setResource: (state, action: PayloadAction<BasicResource | null>) => {
      state.selectedResource = action.payload;
    },
    clearResource: (state) => {
      state.selectedResource = null;
    },
  },
});

export const { setResource, clearResource } = resourceSlice.actions;

export const selectResource = (state: RootState) =>
  state.resource.selectedResource;

export default resourceSlice.reducer;
