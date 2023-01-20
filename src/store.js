import { configureStore } from '@reduxjs/toolkit'
import Flow1000Module from './models/flow1000'
import { createSlice } from '@reduxjs/toolkit'

const flow1000Slice = createSlice(Flow1000Module)

const flow1000Reducer = flow1000Slice.reducer;

export default configureStore({
  reducer:{
    flow1000:flow1000Reducer
  }
})