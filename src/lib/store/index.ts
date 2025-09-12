import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./features/filterSlice";
import reviewFiltersReducer from "./features/reviewFiltersSlice";
import reviewVotesReducer from "./features/reviewVotesSlice";
import resourceReducer from "./features/resourceSlice";
import resourcesReducer from "./features/resourcesSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      filter: filterReducer,
      reviewFilters: reviewFiltersReducer,
      reviewVotes: reviewVotesReducer,
      resource: resourceReducer,
      resources: resourcesReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
