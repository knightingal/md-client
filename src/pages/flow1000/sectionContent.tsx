import React, { CSSProperties, useState } from 'react';
import {lazyLoader, LazyProps, HeightType,  } from '../../components/LazyLoader';

import ImgComponent  from '../../components/ImgComponent';
import {Flow1000ModelState} from '../../models/flow1000';
import { connect } from 'dva';
class SectionDetail {
  dirName:string;
  picPage:string;
  pics:Array<ImgDetail>;

  constructor() {
    this.dirName = "";
    this.picPage = "";
    this.pics = [];
  }
}

interface ImgDetail extends HeightType{
  name:string;
  width:number;
  height:number;
}

const Content = (props: {index:number, password:string, height: number}) => {

  const [sectionDetail, setDectionDetail] = useState(new SectionDetail());
  const [scrollTop, setScrollTop] = useState(0);

  const fecthSectionList = (index: number) => {
    if (index <= 0) {
      return;
    }
    fetch(`/local1000/picDetailAjax?id=${index}`)
    .then((resp: Response) => {
      return resp.json();
    })
    .then((json: any) => {
      const sectionDetail:SectionDetail = json;
      setDectionDetail(sectionDetail);
      setScrollTop(0);
    });
  }

  fecthSectionList(props.index);

  return <LazyLoader height={props.height - 64} dataList={sectionDetail.pics}  scrollTop={scrollTop} itemProps={sectionDetail.dirName}/>

}

export default connect(({flow1000}:{flow1000: Flow1000ModelState}) => {
  const props = {
    height: flow1000.height,
    index: flow1000.sectionIndex,
    password: ""
  }
  return props;
})(Content);

const ImgComponentItem = (props:{mount: boolean, item: ImgDetail, itemProps?: string }) => <ImgComponent 
  width={props.item.width} 
  height={props.item.height} 
  src={`/static/encrypted/${props.itemProps}/${props.item.name}.bin`} 
/> 

const LazyLoader: React.ComponentClass<
    LazyProps<
      ImgDetail, 
      {index:number, password:string}, 
      {}, 
      null,
      string
    >
  > 
= lazyLoader(ImgComponentItem, "Content", 2, (itemProps:string): string => itemProps)
