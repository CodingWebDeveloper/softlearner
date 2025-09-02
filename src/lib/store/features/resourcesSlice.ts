import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

import { SimpleResource } from "@/services/interfaces/service.interfaces";


interface ResourcesState {
  resources: SimpleResource[];
}

const initialState: ResourcesState = {
  resources: [],
};

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    setResources: (state, action: PayloadAction<SimpleResource[]>) => {
      state.resources = action.payload;
    },
    addResource: (state, action: PayloadAction<SimpleResource>) => {
      state.resources.push(action.payload);
    },
    updateResourceOrder: (state, action: PayloadAction<{ resourceId: string; newIndex: number }>) => {
      const { resourceId, newIndex } = action.payload;
      const resources = [...state.resources];
      const currentIndex = resources.findIndex(r => r.id === resourceId);
      
      if (currentIndex === -1) return;
      
      // Remove the resource from its current position
      const [movedResource] = resources.splice(currentIndex, 1);
      
      // Insert it at the new position
      resources.splice(newIndex, 0, movedResource);
      
      // Update order_index for all resources
      resources.forEach((resource, index) => {
        resource.order_index = index;
      });
      
      state.resources = resources;
    },
    removeResource: (state, action: PayloadAction<string>) => {
      state.resources = state.resources.filter(resource => resource.id !== action.payload);
      
      // Update order_index for remaining resources
      state.resources.forEach((resource, index) => {
        resource.order_index = index;
      });
    },
  },
});

export const {
  setResources,
  addResource,
  updateResourceOrder,
  removeResource,
} = resourcesSlice.actions;

export default resourcesSlice.reducer;

export const selectResources = (state: RootState) => state.resources.resources;
export const selectOrderedResources = createSelector(
  selectResources,
  (resources) => resources.slice().sort((a, b) => a.order_index - b.order_index)
);

