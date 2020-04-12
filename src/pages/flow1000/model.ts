import { HeightType } from '../../components/LazyLoader';
import { Effect, EffectsCommandMap } from 'dva';
import { Action, AnyAction } from 'redux';
import { Reducer } from 'react';
import { decryptArray } from '@/lib/decryptoArray';
import { Flow1000ModelState } from '@/models/flow1000';

export interface SectionDetail {
  dirName: string;
  picPage: string;
  pics: Array<ImgDetail>;
}

export interface ImgDetail extends HeightType {
  name: string;
  width: number;
  height: number;
  url?: string;
}

export interface SectionContentState {
  sectionDetail?: SectionDetail;
  scrollTop: number;
}

interface SetSectionDetailActoin extends Action {
  sectionDetail: SectionDetail;
}

export interface Flow1000SectionContentModelType {
  namespace: string;
  state: SectionContentState;
  reducers: {
    setSectionDetail: Reducer<SectionContentState, SetSectionDetailActoin>;
    clear: Reducer<SectionContentState, Action>;
    setObjectUrl: Reducer<SectionContentState, AnyAction>;
  };
  effects: {
    fetchSectionList: Effect;
    fetchImgContent: Effect;
  };
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
      const sectionDetail: SectionDetail = json;
      return sectionDetail;
    });
};

const fetchImgContent = (url: string, password: string) =>
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => {
      const decrypted = decryptArray(arrayBuffer, password);
      const objectURL = URL.createObjectURL(new Blob([decrypted]));
      return objectURL;
    });

const Flow1000SectionContentModel: Flow1000SectionContentModelType = {
  namespace: 'flow1000SectionContent',
  state: {
    scrollTop: 0,
  },
  reducers: {
    setSectionDetail(state: SectionContentState, action: SetSectionDetailActoin) {
      return {
        ...state,
        sectionDetail: action.sectionDetail,
      };
    },
    clear(state: SectionContentState, action: Action) {
      return { scrollTop: 0 };
    },
    setObjectUrl(state: SectionContentState, action: AnyAction) {
      const pics = state.sectionDetail?.pics;
      if (pics) {
        pics[action.index].url = action.objectURL;
      }
      return { ...state  };
    },
  },
  effects: {
    *fetchSectionList(action: AnyAction, effects: EffectsCommandMap) {
      const sectoinDetail = yield effects.call(fecthSectionList, action.index);
      yield effects.put({ type: 'setSectionDetail', sectionDetail: sectoinDetail });
    },
    *fetchImgContent(action: AnyAction, effects: EffectsCommandMap) {
      const state:{dirName:string, picName: string} = yield effects.select(
        ({flow1000SectionContent}: { flow1000SectionContent: SectionContentState }) =>
          ({
            dirName: flow1000SectionContent.sectionDetail?.dirName, 
            picName: flow1000SectionContent.sectionDetail?.pics[action.imgIndex].name
          })
      );
      const src = `/static/encrypted/${state.dirName}/${state.picName}.bin`
      const password = yield effects.select(
        ({flow1000}:{flow1000:Flow1000ModelState}) => flow1000.pwd
      );
      const objectURL = yield effects.call(fetchImgContent, src, password);
      yield effects.put({ type: 'setObjectUrl', objectURL, index: action.imgIndex });
    },
  },
};


export default Flow1000SectionContentModel;
