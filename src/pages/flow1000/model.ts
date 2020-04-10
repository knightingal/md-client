import { HeightType,  } from '../../components/LazyLoader';
import { Effect, EffectsCommandMap } from 'dva';
import {
  Action, AnyAction
} from 'redux';
import { Reducer } from 'react';
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
    sectionDetail: SectionDetail | null;
    scrollTop: number;
}

interface SetSectionDetailActoin extends Action {
    sectionDetail: SectionDetail
}

export interface Flow1000SectionContentModelType {
    namespace: string,
    state: SectionContentState,
    reducers: {
        setSectionDetail: Reducer<SectionContentState, SetSectionDetailActoin>
    },
    effects :{
        fetchSectionList: Effect
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
const Flow1000SectionContentModel : Flow1000SectionContentModelType = {
    namespace: "flow1000SectionContent",
    state: {
        sectionDetail: null,
        scrollTop: 0,
    },
    reducers:{
        setSectionDetail(state: SectionContentState, action: AnyAction) {
            console.log(action);
            return {...state, sectionDetail: action.sectionDetail};
        }
    },
    effects:{
        *fetchSectionList(action: AnyAction, effects: EffectsCommandMap) {
            const sectoinDetail = yield effects.call(fecthSectionList, action.index);
            yield effects.put({type:"setSectionDetail", sectionDetail: sectoinDetail});
        }
    }
}

export default Flow1000SectionContentModel;