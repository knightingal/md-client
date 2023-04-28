import { configureStore, PayloadAction } from '@reduxjs/toolkit'
import Flow1000Module from './models/flow1000'
import { createSlice } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const flow1000Slice = createSlice(Flow1000Module as any)

export const titleSlice = createSlice({
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

const titleReducer = titleSlice.reducer;

export const { setTitle, resetTitle } = titleSlice.actions;


export interface AlbumConfig {
  name: string,
  encryped: boolean,
  baseUrl: string
}

export interface ConfigState {
  albumConfigs: AlbumConfig[]
}


const flow1000ConfigSlice = createSlice({
  name: "flow1000Config",
  initialState: {
    albumConfigs: [{
      name: "flow1000",
      encryped: true,
      baseUrl: "encrypted"
    }, {
      name: "ship",
      encryped: true,
      baseUrl: "encrypted"
    }, {
      name: "1803",
      encryped: false,
      baseUrl: "1803"
    }, {
      name: "1805",
      encryped: false,
      baseUrl: "1805"
    }, {
      name: "1804",
      encryped: false,
      baseUrl: "1804"
    }],
  },
  reducers: {
  }
})

const flow1000Reducer = flow1000Slice.reducer;
const flow1000ConfigReducer = flow1000ConfigSlice.reducer;

const store = configureStore({
  reducer: {
    flow1000: flow1000Reducer,
    flow1000Config: flow1000ConfigReducer,
    flowTitle: titleReducer,
  }
})

export default store;

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
