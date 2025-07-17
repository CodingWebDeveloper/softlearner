import { configureStore } from '@reduxjs/toolkit'
import courseMaterialsReducer from './features/courseMaterialsSlice'
import selectedTagsReducer from './features/selectedTagsSlice';
import filterReducer from './features/filterSlice';
import reviewFiltersReducer from './features/reviewFiltersSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      courseMaterials: courseMaterialsReducer,
      selectedTags: selectedTagsReducer,
      filter: filterReducer,
      reviewFilters: reviewFiltersReducer,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']