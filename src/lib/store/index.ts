import { configureStore } from '@reduxjs/toolkit'
import courseMaterialsReducer from './features/courseMaterialsSlice'
import selectedTagsReducer from './features/selectedTagsSlice';
import filterReducer from './features/filterSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      courseMaterials: courseMaterialsReducer,
      selectedTags: selectedTagsReducer,
      filter: filterReducer,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']