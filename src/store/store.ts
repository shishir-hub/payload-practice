import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

import alertReducer from './slice/alertSlice'
import userReducer from './slice/userSlice'

export const store = configureStore({
  reducer: {
    alertReducer,
    userReducer,
  },
})

type RootState = ReturnType<typeof store.getState>

type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export const useAppSelector = useSelector.withTypes<RootState>()
