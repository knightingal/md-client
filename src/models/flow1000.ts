import { Action} from 'redux';
import {Reducer, } from 'react';

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

interface SearchAction extends Action {
  search: string;
}

export interface PwdDialogDispAction extends Action {
  pwdDialogDisp: boolean;
}

export interface PwdAction extends Action {
  pwd: string;
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
    search: Reducer<Flow1000ModelState, SearchAction>;
    setPwdDialogDisp: Reducer<Flow1000ModelState, PwdDialogDispAction>;
    setPwd: Reducer<Flow1000ModelState, PwdAction>;
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
  search: string;
  subRest: Array<PicIndex>;
  pwdDialogDisp: boolean;
  pwd: string;
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
    search: '',
    pwdDialogDisp: false,
    pwd: '',
  },
  reducers: {
    setWindowSize(state: Flow1000ModelState, action: SetWindowSizeAction) {
      return { ...(state ), height: action.height, width: action.width };
    },
    imgMouseOver(state: Flow1000ModelState, action: ImgMouseOverAction) {
      const state0 = state;
      return { ...state0, expandImgIndex: action.imgIndex };
    },
    imgClick(state: Flow1000ModelState, action: ImgClickAction) {
      return {
        ...(state),
        sectionIndex: action.imgIndex,
        expandImgIndex: -1,
        title: (state).subRest[action.index].name,
      };
    },
    scrollTop(state: Flow1000ModelState, action: ScrollTopAction) {
      return { ...(state), scrollTop: action.scrollTop };
    },

    sectionList(state: Flow1000ModelState, action: SectionListAction) {
      return { ...(state), subRest: action.subRest };
    },

    search(state: Flow1000ModelState, action: SearchAction) {
      return { ...(state),  search: action.search };
    },

    setPwdDialogDisp(state: Flow1000ModelState, action: PwdDialogDispAction) {
      return { ...(state),  pwdDialogDisp: action.pwdDialogDisp };
    },

    setPwd(state: Flow1000ModelState, action: PwdAction) {
      return { ...(state),  pwd: action.pwd, pwdDialogDisp: false };
    }
  },
};

export default Flow1000Model;

