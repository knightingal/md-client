import { Actions, CaseReducers, configureStore, CreateSliceOptions } from '@reduxjs/toolkit'
import Flow1000Module from './models/flow1000'
import { createSlice } from '@reduxjs/toolkit'

const flow1000Slice = createSlice(Flow1000Module as any)

export interface AlbumConfig {
  name: string,
  encryped: boolean,
  baseUrl: string
}

export interface ConfigState {
  albumConfigs: AlbumConfig[]
}

interface ConfigAction extends Actions {

}

interface Red extends CaseReducers<ConfigState, ConfigAction> {
  // add: (state: ConfigState) => void
}

const configOption: CreateSliceOptions<ConfigState, Red, string> = {
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
    // add: (state: ConfigState) => {
    //   state.config1 += 1
    // }
  }
}


const flow1000ConfigSlice = createSlice(configOption)

const flow1000Reducer = flow1000Slice.reducer;
const flow1000ConfigReducer = flow1000ConfigSlice.reducer;

export default configureStore({
  reducer: {
    flow1000: flow1000Reducer,
    flow1000Config: flow1000ConfigReducer,
  }
})

export const { add } = flow1000ConfigSlice.actions;