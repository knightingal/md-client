import {Reducer, Action} from 'redux';

interface SelectDeviceAction extends Action {
    device: Device
}

export interface SimClientModelType {
    namespace: "simClient";
    state: SimClientModelState;
    reducers: {
        selectDevice: Reducer<SimClientModelState, SelectDeviceAction>;
    };
}

export interface SimClientModelState {
    currentDevice: Device;
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

const SimClientModel: SimClientModelType = {
    namespace: "simClient",
    state: {
        currentDevice:{appId:"mip",appKey:"mip", userId:"user1", esn:"1111", outerNetwork:"1", id:"1", pushToken:null},
    },
    reducers:{
        selectDevice(state: SimClientModelState|undefined, action:SelectDeviceAction) {
            console.log(action);
            return {currentDevice: action.device};
        }
    }
};

export default SimClientModel;

