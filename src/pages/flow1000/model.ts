import { HeightType,  } from '../../components/LazyLoader';
import { Effect, EffectsCommandMap } from 'dva';
import {
  Action, AnyAction
} from 'redux';
import { Reducer } from 'react';
import { decryptArray } from '@/lib/decryptoArray';

export interface SectionDetail {
  dirName:string;
  picPage:string;
  pics:Array<ImgDetail>;
}

export interface ImgDetail extends HeightType{
  name:string;
  width:number;
  height:number;
}

export interface SectionContentState {
    sectionDetail?: SectionDetail;
    picConetent?: Array<any>;
    scrollTop: number;
}

interface SetSectionDetailActoin extends Action {
    sectionDetail: SectionDetail
}

export interface Flow1000SectionContentModelType {
    namespace: string,
    state: SectionContentState,
    reducers: {
        setSectionDetail: Reducer<SectionContentState, SetSectionDetailActoin>;
        clear: Reducer<SectionContentState, Action>;
        setObjectUrl: Reducer<SectionContentState, AnyAction>;
    },
    effects :{
        fetchSectionList: Effect;
        fetchImgContent: Effect;
    },
}

const fecthSectionList = (index: number) => {
    if (index <= 0) {
        return;
    }

    return fetch(`/local1000/picDetailAjax?id=${index}`)
    .then((resp: Response) => {
        return resp.json();
    })
    .then((json: any) => {
        const sectionDetail:SectionDetail = json;
        return sectionDetail;
    });
}

const fetchImgContent = (url: string, password: string) => {
    console.log("fetch " + url + ", password " + password);

    return fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        const decrypted = decryptArray(arrayBuffer, password);
        // return decrypted;
        // return new Blob([decrypted]);
        const objectURL = URL.createObjectURL(new Blob([decrypted]));
        // setUrl(objectURL);
        return objectURL;
      });
}
const Flow1000SectionContentModel : Flow1000SectionContentModelType = {
    namespace: "flow1000SectionContent",
    state: {
        sectionDetail: undefined,
        scrollTop: 0,
    },
    reducers:{
        setSectionDetail(state: SectionContentState, action: AnyAction) {
            console.log("setSectionDetail")
            console.log(action.sectionDetail);
            return {...state, sectionDetail: action.sectionDetail, picConetent: new Array<any>(100)};
        },
        clear(state: SectionContentState, action: Action) {
            console.log("clear")
            return {scrollTop: 0};
        },
        setObjectUrl(state: SectionContentState, action: AnyAction) {
            const picConetent = state.picConetent;
            if (picConetent) {
                console.log(`set ${action.index} as ${action.objectURL}`);
                picConetent[action.index] = action.objectURL;
            }
            return {...state, picConetent: picConetent};
        }
    },
    effects:{
        *fetchSectionList(action: AnyAction, effects: EffectsCommandMap) {
            const sectoinDetail = yield effects.call(fecthSectionList, action.index);
            yield effects.put({type:"setSectionDetail", sectionDetail: sectoinDetail});
        },
        *fetchImgContent(action: AnyAction, effects: EffectsCommandMap) {
            const objectURL = yield effects.call(fetchImgContent, action.src, action.password)
            yield effects.put({type:"setObjectUrl", objectURL, index: action.imgIndex});
        }
    }
}

export default Flow1000SectionContentModel;