import {Reducer, Action} from 'redux';

// import { router } from "umi";
interface SetWindowSizeAction extends Action {
    height:number;
    width:number;
}
interface SearchAction extends Action {
    searchKey: string
}
interface ImgMouseOverAction extends Action{
    imgIndex: number;
}
interface ImgClickAction extends Action{
    imgIndex: number;
}

interface ScrollTopAction extends Action{
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
        imgClick: Reducer<Flow1000ModelState, ImgClickAction>;
        scrollTop: Reducer<Flow1000ModelState, ScrollTopAction>;
        search: Reducer<Flow1000ModelState, SearchAction>;
    };
}

interface WindowSizeState {
    height: number;
    width: number;
    scrollTop: number;
}

interface ImgMouseOverState {
    expandImgIndex:number;
}

interface SectionContent {
    sectionIndex:number;
}

interface SearchKey {
    searchKey: string
}

export interface Flow1000ModelState extends WindowSizeState, ImgMouseOverState, SectionContent, SearchKey {
}

export interface Device {
    appKey:string;
    userId:string;
    esn:string;
    outerNetwork:string;
    id:string;
    pushToken:string|null;
    appId:string|null;
}

const Flow1000Model: Flow1000ModelType = {
    namespace: "flow1000",
    name: "flow1000",
    initialState: {
        height:0,width:0,expandImgIndex:-1,sectionIndex:-1, scrollTop:0, searchKey: ""
    },
    state: {
        height:0,width:0,expandImgIndex:-1,sectionIndex:-1, scrollTop:0, searchKey: ""
    },
    reducers:{
        setWindowSize(state: Flow1000ModelState|undefined, action:SetWindowSizeAction) {
            return {...(state as Flow1000ModelState), height:action.height, width:action.width};
        },
        imgMouseOver(state: Flow1000ModelState|undefined, action:ImgMouseOverAction) {
            const state0 = (state as Flow1000ModelState);
            console.log(action);
            return {...state0, expandImgIndex: action.imgIndex};
        },
        imgClick(state: Flow1000ModelState|undefined, action:ImgClickAction) {
            console.log("imgClick");
            console.log(action);
            return {...(state as Flow1000ModelState), sectionIndex: action.imgIndex, expandImgIndex: -1}
        },
        scrollTop(state: Flow1000ModelState|undefined, action: ScrollTopAction) {
            console.log("scrollTop");
            console.log(action)
            return {...(state as Flow1000ModelState), scrollTop: action.scrollTop}
        },
        search(state: Flow1000ModelState|undefined, action: SearchAction) {
            return {...(state as Flow1000ModelState), searchKey: action.searchKey }

        }
    }
};

export default Flow1000Model;

