import { configureStore, PayloadAction } from '@reduxjs/toolkit'
import Flow1000Module from './models/flow1000'
import { createSlice } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const flow1000Slice = createSlice(Flow1000Module as any)

export const flow1000TitleSlice = createSlice({
  name: "title",
  initialState: {
    title: "Welcome to user Flow1000"
  },
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    resetTitle: (state) => {
      state.title = "Welcome to user Flow1000"
    }
  }
});

const flow1000TitleReducer = flow1000TitleSlice.reducer;

export const { setTitle, resetTitle } = flow1000TitleSlice.actions;


export interface AlbumConfig {
  name: string,
  encrypted: boolean,
  baseUrl: string
}

export interface ConfigState {
  albumConfigs: AlbumConfig[]
}


const flow1000ConfigSlice = createSlice({
  name: "flow1000Config",
  initialState: {
    albumConfigs: []
  },
  reducers: {
    initConfig: (state: ConfigState, action: PayloadAction<ConfigState>) => {
      state.albumConfigs = action.payload.albumConfigs
    }
  }
})

export const { initConfig, } = flow1000ConfigSlice.actions;

const flow1000Reducer = flow1000Slice.reducer;
const flow1000ConfigReducer = flow1000ConfigSlice.reducer;

const store = configureStore({
  reducer: {
    flow1000: flow1000Reducer,
    flow1000Config: flow1000ConfigReducer,
    flow1000Title: flow1000TitleReducer,
  }
})

export default store;

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
