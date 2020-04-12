import React, { CSSProperties, useState, useEffect } from 'react';
import { lazyLoader, LazyProps, HeightType } from '../../components/LazyLoader';

import ImgComponent from '../../components/ImgComponent';
import { Flow1000ModelState } from '../../models/flow1000';
import { connect } from 'dva';
import { SectionContentState, SectionDetail, ImgDetail } from './model';

import { Dispatch } from 'redux';
/**
 * props type of Content
 */
interface ContentProps {
  dispatch: Dispatch<any>;
  index: number;
  height: number;
  sectionDetail?: SectionDetail;
  scrollTop: number;
}

const Content = (props: ContentProps) => {
  useEffect(() => {
    props.dispatch({ type: 'flow1000SectionContent/fetchSectionList', index: props.index });
  }, []);

  if (props.sectionDetail) {
    return (
      <LazyLoader
        height={props.height - 64}
        dataList={props.sectionDetail.pics}
        scrollTop={props.scrollTop}
        itemProps={props.sectionDetail.dirName}
      />
    );
  } else {
    return null;
  }
};

export default connect(
  ({
    flow1000,
    flow1000SectionContent,
  }: {
    flow1000: Flow1000ModelState;
    flow1000SectionContent: SectionContentState;
  }) => ({
    height: flow1000.height,
    index: flow1000.sectionIndex,
    sectionDetail: flow1000SectionContent.sectionDetail,
    scrollTop: flow1000SectionContent.scrollTop,
  }),
)(Content);

interface ImgComponentItemProps {
  dirName: string;
  index: number;
}

const ImgComponentItem = (props: { mount: boolean; item: ImgDetail; itemProps?: ImgComponentItemProps }) => (
  <ImgComponent
    width={props.item.width}
    height={props.item.height}
    index={props.itemProps?.index}
    // src={props.itemProps ? `/static/encrypted/${props.itemProps?.dirName}/${props.item.name}.bin` : undefined}
  />
);

const LazyLoader: React.ComponentClass<LazyProps<
  ImgDetail,
  { index: number; password: string },
  {},
  null,
  any
>> = lazyLoader(ImgComponentItem, 'Content', 2, (dirName:string, index:number): ImgComponentItemProps => ({dirName, index}));
