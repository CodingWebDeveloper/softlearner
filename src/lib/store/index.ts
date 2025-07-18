import { configureStore } from "@reduxjs/toolkit";
import courseMaterialsReducer from "./features/courseMaterialsSlice";
import filterReducer from "./features/filterSlice";
import reviewFiltersReducer from "./features/reviewFiltersSlice";
import reviewVotesReducer from "./features/reviewVotesSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      courseMaterials: courseMaterialsReducer,
      filter: filterReducer,
      reviewFilters: reviewFiltersReducer,
      reviewVotes: reviewVotesReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
