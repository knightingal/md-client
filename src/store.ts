import { configureStore, PayloadAction, createAsyncThunk, SliceCaseReducers } from '@reduxjs/toolkit'
import Flow1000Module from './models/flow1000'
import { createSlice } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

const flow1000Slice = createSlice(Flow1000Module as any)

export const flow1000TitleSlice = createSlice({
  name: "title",
  initialState: {
    title: "Welcome to user Flow1000",
    displaySyncBtn: false,
    sectionIndex: -1
  },
  reducers: {
    setTitle: (state, action: PayloadAction<{title:string, index:number, displaySyncBtn:boolean}>) => {
      state.title = action.payload.title;
      state.displaySyncBtn = action.payload.displaySyncBtn;
      state.sectionIndex = action.payload.index;
    },
    resetTitle: (state) => {
      state.title = "Welcome to user Flow1000";
      state.displaySyncBtn = false;
      state.sectionIndex = -1;
    }
  }
});

interface PicDetail {
  sectionIndex: number;
  name: string;
  cover: string;
  index: number;
  coverWidth: number;
  coverHeight: number;
  expanded: boolean;
  album: string;
  clientStatus: string;
}

interface Flow1000ContentState {
  height: number;
  width: number;
  scrollTop: number;
  searchKey: string;
  expandImgIndex: number[];
  sectionIndex: number;
  scrolling: boolean
  sectionList: PicDetail[];
}

interface Flow1000Reducer extends SliceCaseReducers<Flow1000ContentState>{
  setWindowSize: (state: Flow1000ContentState, action: PayloadAction<{height: number; width: number;}>) => void
  imgMouseOver: (state: Flow1000ContentState, action: PayloadAction<{imgIndex:number}>) => void
  imgMouseLeave: (state: Flow1000ContentState, action: PayloadAction<{imgIndex:number}>) => void
  imgClick: (state: Flow1000ContentState, action: PayloadAction<{imgIndex:number}>) => void
  scrollTop: (state: Flow1000ContentState, action: PayloadAction<{scrollTop:number}>) => void
  search: (state: Flow1000ContentState, action: PayloadAction<{searchKey:string}>) => void
  inScrolling: (state: Flow1000ContentState, action: PayloadAction<{inScrolling: boolean}>) => void

  setSectionList: (state: Flow1000ContentState, action: PayloadAction<Array<PicDetail>>) => void
}

const flow1000ContentSlice = createSlice<Flow1000ContentState, Flow1000Reducer, "content">({
  name:"content",
  initialState: {
    height: 0, 
    width: 0, 
    expandImgIndex: [],
    sectionIndex: -1, 
    scrollTop: 0, 
    searchKey: "", 
    sectionList: [], 
    scrolling: false
  },
  reducers: {
    setSectionList: (state: Flow1000ContentState, action: PayloadAction<Array<PicDetail>>): void => {
      state.sectionList = action.payload
    },
    setWindowSize: (state: Flow1000ContentState, action: PayloadAction<{height: number; width: number;}>) => {
      state.height = action.payload.height;
      state.width = action.payload.width
    },
    imgMouseOver: (state: Flow1000ContentState, action: PayloadAction<{imgIndex:number}>): void => {
      state.sectionList[action.payload.imgIndex].expanded = true;
      state.expandImgIndex.push(action.payload.imgIndex);
    },
    imgMouseLeave: (state: Flow1000ContentState, action: PayloadAction<{imgIndex:number}>): void => {
      state.sectionList[action.payload.imgIndex].expanded = false;
      state.expandImgIndex = state.expandImgIndex.filter(item => item !== action.payload.imgIndex);
    },
    imgClick: (state: Flow1000ContentState, action: PayloadAction<{imgIndex:number}>): void => {
      console.log("imgClick");
      console.log(action);
      state.sectionIndex = action.payload.imgIndex;
      state.expandImgIndex = [];
    },
    scrollTop: (state: Flow1000ContentState, action: PayloadAction<{scrollTop:number}>): void => {
      console.log("scrollTop");
      console.log(action)
      state.scrollTop = action.payload.scrollTop;
    },
    search: (state: Flow1000ContentState, action: PayloadAction<{searchKey:string}>): void  => {
      state.searchKey = action.payload.searchKey;
    },
    inScrolling: (state: Flow1000ContentState, action: PayloadAction<{inScrolling: boolean}>): void => {
      state.scrolling = action.payload.inScrolling;
      state.expandImgIndex.forEach(imgIndex => state.sectionList[imgIndex].expanded = false)
      state.expandImgIndex = [];
    },
  },
  extraReducers: (builder) => {
      
  },
})


const flow1000TitleReducer = flow1000TitleSlice.reducer;
const flow1000ContentReducer = flow1000ContentSlice.reducer;

export const { setTitle, resetTitle } = flow1000TitleSlice.actions;
export const { setSectionList, } = flow1000ContentSlice.actions;

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
    flow1000Content: flow1000ContentReducer,
  },
})

export default store;

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
