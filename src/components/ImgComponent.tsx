import * as React from 'react';
import { decryptArray } from '../lib/decryptoArray';
import { connect,   } from 'dva';
import { Flow1000ModelState } from '@/models/flow1000';
import { useState, useEffect } from 'react';

import { Dispatch } from 'redux';
import { SectionContentState } from '@/pages/flow1000/model';
interface ImgComponentProp {
  src?: string;
  height: number;
  width: number;
  password: string;
  index?: number;
  dispatch: Dispatch<any>;
  url?: any;
}

const ImgComponent = (props: ImgComponentProp) => {
  const fetchImgByUrl = (url: string) => {
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        const decrypted = decryptArray(arrayBuffer, props.password);
        const objectURL = URL.createObjectURL(new Blob([decrypted]));
      });
  };
  useEffect(() => {
    props.dispatch({type: "flow1000SectionContent/fetchImgContent", imgIndex: props.index, src: props.src, password: props.password})
  }, []);
  useEffect(() => {
    console.log("props.url = " + props.url);
  }, [props.url]);


  return (
    <img
      src={props.url ?  props.url: ""}
      style={{ display: 'block', margin: 'auto' }}
      height={`${props.height}px`}
      width={`${props.width}px`}
    />
  );
};

export default connect(({ flow1000, flow1000SectionContent }: { flow1000: Flow1000ModelState, flow1000SectionContent: SectionContentState }, props: {index?: number}) => {
  console.log(`bind ImgComponent for ${props.index}`)
  return { 
    password: flow1000.pwd, 
    src: `/static/encrypted/${flow1000SectionContent.sectionDetail?.dirName}/${flow1000SectionContent.sectionDetail?.pics[props.index? props.index: 0].name}.bin`,
    url: flow1000SectionContent.picConetent?.[props.index? props.index:0] 
  };
})(ImgComponent);
