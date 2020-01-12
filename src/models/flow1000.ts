import {Reducer, Action} from 'redux';

import { router } from "umi";
interface SetWindowSizeAction extends Action {
    height:number;
    width:number;
}
 
interface ImgMouseOverAction extends Action{
    imgIndex: number;
}

export interface Flow1000ModelType {
    namespace: "flow1000";
    state: Flow1000ModelState;
    reducers: {
        setWindowSize: Reducer<Flow1000ModelState, SetWindowSizeAction>;
        imgMouseOver: Reducer<Flow1000ModelState, ImgMouseOverAction>;
    };
}

interface WindowSizeState {
    height: number;
    width: number;
}

interface ImgMouseOverState {
    expandImgIndex:number;
}

export interface Flow1000ModelState extends WindowSizeState, ImgMouseOverState {
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
        height:0,width:0,expandImgIndex:-1
    },
    reducers:{
        setWindowSize(state: Flow1000ModelState|undefined, action:SetWindowSizeAction) {
            return {...(state as Flow1000ModelState), height:action.height, width:action.width};
        },
        imgMouseOver(state: Flow1000ModelState|undefined, action:ImgMouseOverAction) {
            const state0 = (state as Flow1000ModelState);
            console.log(action);
            return {...state0, expandImgIndex: action.imgIndex};
        }
    }
};

export default Flow1000Model;

