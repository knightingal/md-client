import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { Reducer, Action } from 'redux';

// import { router } from "umi";
interface SetWindowSizeAction extends Action {
  height: number;
  width: number;
}
interface SearchAction extends Action {
  searchKey: string
}
interface SetSectionListAction extends Action {
  sectionList: Array<PicIndex>
}
interface InScrollingAction extends Action {
  inScrolling: boolean
}
interface ImgMouseOverAction extends Action {
  imgIndex: number;
}
interface ImgClickAction extends Action {
  imgIndex: number;
}

interface ScrollTopAction extends Action {
  scrollTop: number;
}

export interface Flow1000ModelType {
  namespace: "flow1000";
  name: "flow1000";
  initialState: Flow1000ModelState;
  state: Flow1000ModelState;
  reducers: {
    setWindowSize: Reducer<Flow1000ModelState, SetWindowSizeAction>;
    imgMouseOver: Reducer<Flow1000ModelState, ImgMouseOverAction>;
    imgMouseLeave: Reducer<Flow1000ModelState, ImgMouseOverAction>;
    imgClick: Reducer<Flow1000ModelState, ImgClickAction>;
    scrollTop: Reducer<Flow1000ModelState, ScrollTopAction>;
    search: Reducer<Flow1000ModelState, SearchAction>;
    setSeciontList: Reducer<Flow1000ModelState, SetSectionListAction>;
    inScrolling: Reducer<Flow1000ModelState, InScrollingAction>;
  };
  extraReducers: (builder: ActionReducerMapBuilder<Flow1000ModelState>) => void;
}


interface PicIndex {
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

export interface Flow1000ModelState {
  height: number;
  width: number;
  scrollTop: number;
  searchKey: string;
  expandImgIndex: number[];
  sectionIndex: number;
  scrolling: boolean
  sectionList: Array<PicIndex>
}


export interface Device {
  appKey: string;
  userId: string;
  esn: string;
  outerNetwork: string;
  id: string;
  pushToken: string | null;
  appId: string | null;
}

export const refreshSectionList = createAsyncThunk<Array<PicIndex>, undefined>(
  "flow1000/refresh", async (undefined, { getState }) => {
    const searchKey = (getState() as any).flow1000.searchKey;
    const battleShipPage = false;
    let fetchUrl = battleShipPage
      ? '/local1000/picIndexAjax?album=ship'
      : '/local1000/picIndexAjax?';
    if (searchKey != null && searchKey !== '') {
      fetchUrl = fetchUrl.concat("&searchKey=" + searchKey)
    }

    return fetch(fetchUrl)
      .then((resp: Response) => resp.json())
})

const Flow1000Model: Flow1000ModelType = {
  namespace: "flow1000",
  name: "flow1000",
  initialState: {
    height: 0, width: 0, expandImgIndex: [], sectionIndex: -1, scrollTop: 0, searchKey: "", sectionList: [], scrolling: false
  },
  state: {
    height: 0, width: 0, expandImgIndex: [], sectionIndex: -1, scrollTop: 0, searchKey: "", sectionList: [], scrolling: false
  },
  extraReducers: (builder: ActionReducerMapBuilder<Flow1000ModelState>) => {
    builder.addCase(refreshSectionList.fulfilled, (state0, {payload}) => {
      console.log("refreshSectionList.fulfilled", payload)
      payload.forEach((picIndex: PicIndex, index: number) => {
        picIndex.sectionIndex = picIndex.index;
        picIndex.expanded = false;
        picIndex.index = index;
      })
      state0.sectionList = payload
    })
  },
  reducers: {
    setWindowSize(state: Flow1000ModelState | undefined, action: SetWindowSizeAction) {
      return { ...(state as Flow1000ModelState), height: action.height, width: action.width };
    },
    imgMouseOver(state: Flow1000ModelState | undefined, action: ImgMouseOverAction) {
      const state0 = (state as Flow1000ModelState);
      state0.sectionList[action.imgIndex].expanded = true;
      state0.expandImgIndex.push(action.imgIndex);
      return state0;
    },
    imgMouseLeave(state: Flow1000ModelState | undefined, action: ImgMouseOverAction) {
      const state0 = (state as Flow1000ModelState);
      state0.sectionList[action.imgIndex].expanded = false;
      state0.expandImgIndex = state0.expandImgIndex.filter(item => item !== action.imgIndex);
      return state0;
    },
    imgClick(state: Flow1000ModelState | undefined, action: ImgClickAction) {
      console.log("imgClick");
      console.log(action);
      return { ...(state as Flow1000ModelState), sectionIndex: action.imgIndex, expandImgIndex: [] }
    },
    scrollTop(state: Flow1000ModelState | undefined, action: ScrollTopAction) {
      console.log("scrollTop");
      console.log(action)
      return { ...(state as Flow1000ModelState), scrollTop: action.scrollTop }
    },
    search(state: Flow1000ModelState | undefined, action: SearchAction) {
      return { ...(state as Flow1000ModelState), searchKey: action.searchKey }

    },
    setSeciontList(state: Flow1000ModelState | undefined, action: SetSectionListAction) {
      return { ...(state as Flow1000ModelState), sectionList: action.sectionList }

    },

    inScrolling(state: Flow1000ModelState | undefined, action: InScrollingAction) {
      const state0 = (state as Flow1000ModelState);
      state0.scrolling = action.inScrolling;
      state0.expandImgIndex.forEach(imgIndex => state0.sectionList[imgIndex].expanded = false)
      state0.expandImgIndex = [];
      return state0;
    }

  }
};

export default Flow1000Model;

