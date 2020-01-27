import {Reducer, Action} from 'redux';

interface SetWindowSizeAction extends Action {
  height: number;
  width: number;
}

interface ImgMouseOverAction extends Action {
  imgIndex: number;
}
interface ImgClickAction extends Action {
  imgIndex: number;
  index: number;
}

interface ScrollTopAction extends Action {
  scrollTop: number;
}

interface PicIndex {
  sectionIndex: number;
  name: string;
  cover: string;
  index: number;
  coverWidth: number;
  coverHeight: number;
}
interface SectionListAction extends Action {
  subRest: Array<PicIndex>;
}

export interface Flow1000ModelType {
  namespace: 'flow1000';
  state: Flow1000ModelState;
  reducers: {
    setWindowSize: Reducer<Flow1000ModelState, SetWindowSizeAction>;
    imgMouseOver: Reducer<Flow1000ModelState, ImgMouseOverAction>;
    imgClick: Reducer<Flow1000ModelState, ImgClickAction>;
    scrollTop: Reducer<Flow1000ModelState, ScrollTopAction>;
    sectionList: Reducer<Flow1000ModelState, SectionListAction>;
  };
}

interface WindowSizeState {
  height: number;
  width: number;
  scrollTop: number;
}

interface ImgMouseOverState {
  expandImgIndex: number;
}

interface SectionContent {
  sectionIndex: number;
}

export interface Flow1000ModelState extends WindowSizeState, ImgMouseOverState, SectionContent {
  title: string;

  subRest: Array<PicIndex>;
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

const Flow1000Model: Flow1000ModelType = {
  namespace: 'flow1000',
  state: {
    height: 0,
    width: 0,
    expandImgIndex: -1,
    sectionIndex: -1,
    scrollTop: 0,
    title: 'Welcome to use Flow1000',
    subRest: [],
  },
  reducers: {
    setWindowSize(state: Flow1000ModelState | undefined, action: SetWindowSizeAction) {
      return { ...(state as Flow1000ModelState), height: action.height, width: action.width };
    },
    imgMouseOver(state: Flow1000ModelState | undefined, action: ImgMouseOverAction) {
      const state0 = state as Flow1000ModelState;
      return { ...state0, expandImgIndex: action.imgIndex };
    },
    imgClick(state: Flow1000ModelState | undefined, action: ImgClickAction) {
      return {
        ...(state as Flow1000ModelState),
        sectionIndex: action.imgIndex,
        expandImgIndex: -1,
        title: (state as Flow1000ModelState).subRest[action.index].name,
      };
    },
    scrollTop(state: Flow1000ModelState | undefined, action: ScrollTopAction) {
      return { ...(state as Flow1000ModelState), scrollTop: action.scrollTop };
    },

    sectionList(state: Flow1000ModelState | undefined, action: SectionListAction) {
      return { ...(state as Flow1000ModelState), subRest: action.subRest };
    },
  },
};

export default Flow1000Model;

