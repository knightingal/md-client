import { configureStore } from '@reduxjs/toolkit'
import Flow1000Module from './models/flow1000'
import { createSlice } from '@reduxjs/toolkit'

const flow1000Slice = createSlice(Flow1000Module)

const flow1000ConfigSlice = createSlice({
  name: "flow1000Config",
  initialState: {
    config1: 0,
    albumConfig: []
  },
  reducers: {
    add: (state) => {
      state.config1 += 1;
    }
  }
})

const flow1000Reducer = flow1000Slice.reducer;
const flow1000ConfigReducer = flow1000ConfigSlice.reducer;

export default configureStore({
  reducer: {
    flow1000: flow1000Reducer,
    flow1000Config: flow1000ConfigReducer,
  }
})

export const { add } = flow1000ConfigSlice.actions;