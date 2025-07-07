import { configureStore } from '@reduxjs/toolkit'
import courseMaterialsReducer from './features/courseMaterialsSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      courseMaterials: courseMaterialsReducer,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']