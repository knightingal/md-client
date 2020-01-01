import {Reducer, Action} from 'redux';

import { router } from "umi";
interface SetWindowSizeAction extends Action {
    height:number;
    width:number;
}

export interface Flow1000ModelType {
    namespace: "flow1000";
    state: Flow1000ModelState;
    reducers: {
        setWindowSize: Reducer<Flow1000ModelState, SetWindowSizeAction>;
    };
}

export interface Flow1000ModelState {
    height:number;
    width:number;
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
        height:0,width:0
    },
    reducers:{
        setWindowSize(state: Flow1000ModelState|undefined, action:SetWindowSizeAction) {
            console.log(action);
            // router.push("/md-page/")
            return {height:action.height, width:action.width};
        }
    }
};

export default Flow1000Model;

