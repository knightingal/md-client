import React, { CSSProperties, useState, useEffect } from 'react';
import { lazyLoader, LazyProps, HeightType } from '../../components/LazyLoader';

import ImgComponent from '../../components/ImgComponent';
import { Flow1000ModelState } from '../../models/flow1000';
import { connect } from 'dva';
import { SectionContentState, SectionDetail, ImgDetail } from './model';

import { Dispatch } from 'redux';
const Content = (props: {
  dispatch: Dispatch<any>;
  index: number;
  height: number;
  sectionDetail: SectionDetail | null;
  scrollTop: number;
}) => {
  useEffect(() => {
    props.dispatch({ type: 'flow1000SectionContent/fetchSectionList', index: props.index });
  }, []);

  if (props.sectionDetail == null) {
    return null;
  } else {
    return (
      <LazyLoader
        height={props.height - 64}
        dataList={props.sectionDetail.pics}
        scrollTop={props.scrollTop}
        itemProps={props.sectionDetail.dirName}
      />
    );
  }
};

export default connect(
  ({
    flow1000,
    flow1000SectionContent,
  }: {
    flow1000: Flow1000ModelState;
    flow1000SectionContent: SectionContentState;
  }) => {
    console.log(flow1000SectionContent);
    const props = {
      height: flow1000.height,
      index: flow1000.sectionIndex,
      sectionDetail: flow1000SectionContent.sectionDetail,
      scrollTop: flow1000SectionContent.scrollTop,
    };
    return props;
  },
)(Content);

const ImgComponentItem = (props: { mount: boolean; item: ImgDetail; itemProps?: string }) => (
  <ImgComponent
    width={props.item.width}
    height={props.item.height}
    src={`/static/encrypted/${props.itemProps}/${props.item.name}.bin`}
  />
);

const LazyLoader: React.ComponentClass<LazyProps<
  ImgDetail,
  { index: number; password: string },
  {},
  null,
  string
>> = lazyLoader(ImgComponentItem, 'Content', 2, (itemProps: string): string => itemProps);
