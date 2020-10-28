import * as React from 'react';
import { connect   } from 'dva';
import { useEffect } from 'react';

import { Dispatch } from 'redux';
import { SectionContentState } from '@/pages/flow1000/model';
interface ImgComponentProp {
  src?: string;
  height: number;
  width: number;
  index?: number;
  dispatch: Dispatch<any>;
  url?: string;
}

const ImgComponent = (props: ImgComponentProp) => {

  useEffect(() => {
    props.dispatch({type: "flow1000SectionContent/fetchImgContent", imgIndex: props.index})
  }, []);

  return (
    <img
      src={props.url}
      style={{ display: 'block', margin: 'auto' }}
      height={`${props.height}px`}
      width={`${props.width}px`}
    />
  );
};

export default connect(({flow1000SectionContent}: {flow1000SectionContent: SectionContentState}, props: {index: number}) => {
  return { 
    url: flow1000SectionContent.sectionDetail?.pics[props.index].url 
  };
})(ImgComponent);
