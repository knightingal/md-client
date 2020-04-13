import React, { useEffect } from 'react';
import { lazyLoader, LazyProps } from '../../components/LazyLoader';

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
        extProps={props.sectionDetail.dirName}
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

interface ImgComponentItemExtType {
  dirName: string;
}

interface ImgComponentItemProps {
  item: ImgDetail;
  index: number;
}

const ImgComponentItem = (props: ImgComponentItemProps) => (
  <ImgComponent
    width={props.item.width}
    height={props.item.height}
    index={props.index}
  // index={(props.itemProps as ImgComponentItemProps).index}
  />
);

const LazyLoader: React.ComponentClass<LazyProps<
  ImgDetail,
  { index: number; password: string },
  {},
  string,
  null
>> = lazyLoader(
  ImgComponentItem,
  'Content',
  2,
  (dirName: string): ImgComponentItemExtType => ({ dirName: dirName }),
);
