import { configureStore } from '@reduxjs/toolkit'
import type { Reducer } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import usersReducer from './user/slice'

const store = configureStore({ 
  reducer: { 
    users: usersReducer 
  } 
})
export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
export type RootState = ReturnType<typeof store.getState>