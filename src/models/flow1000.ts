import {Reducer, Action} from 'redux';

import { router } from "umi";
interface SetWindowSizeAction extends Action {
    height:number;
    width:number;
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
    state: Flow1000ModelState;
    reducers: {
        setWindowSize: Reducer<Flow1000ModelState, SetWindowSizeAction>;
        imgMouseOver: Reducer<Flow1000ModelState, ImgMouseOverAction>;
        imgClick: Reducer<Flow1000ModelState, ImgClickAction>;
        scrollTop: Reducer<Flow1000ModelState, ScrollTopAction>;
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

export interface Flow1000ModelState extends WindowSizeState, ImgMouseOverState, SectionContent {
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
    state: {
        height:0,width:0,expandImgIndex:-1,sectionIndex:-1, scrollTop:0
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
        }
    }
};

export default Flow1000Model;

