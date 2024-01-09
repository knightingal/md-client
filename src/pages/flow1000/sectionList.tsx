import React, { useEffect, useState } from 'react';
import { ReactNode, } from 'react';
import { lazyLoader, LazyProps, ParentCompHandler } from '../../components/LazyLoader';

import { connect, useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Flow1000ContentState, RootState, refreshSectionList } from '../../store';
import { AlbumConfig, ConfigState } from '../../store';
import { GridLine, GridLineBean, PicIndex } from '../../components/GridLine';
interface Flow1000Props {
  height: number;
  width: number;
  expandImgIndex: number[];
  children?: ReactNode;
  dispatch: Dispatch<any>;
  searchKey: string;
}

const LazyLoader: React.ComponentClass<LazyProps<
  GridLineBean
>> = lazyLoader(GridLine, 'SectionList');

const GridContainerFunc = (props: {
  height: number;
  expandImgIndex: number[];
  searchKey: string
}) => {

  const {sectionList, scrollTop, albumConfigs} = useSelector((state: RootState) => ({
    sectionList: state.flow1000Content.sectionList,
    scrollTop: state.flow1000Content.scrollTop,
    albumConfigs: state.flow1000Config.albumConfigs,
  })) 

  const dispatch: Dispatch<any> = useDispatch<any>()

  const {searchKey } = props;
  const albumConfigMap = new Map(albumConfigs.map(config => [config.name, config]))

  const initBySectionData = (subRest: PicIndex[]) => {
    const getConfigMap: (album: string) => AlbumConfig = (album: string): AlbumConfig => {
      const albumConfig = albumConfigMap.get(album);
      if (albumConfig) {
        return albumConfig;
      }
      return albumConfigs[0];
    }

    const sub0 = subRest.filter((_: PicIndex, index: number) => {
      return index % 4 === 0;
    });
    const sub1 = subRest.filter((_: PicIndex, index: number) => {
      return index % 4 === 1;
    });
    const sub2 = subRest.filter((_: PicIndex, index: number) => {
      return index % 4 === 2;
    });
    const sub3 = subRest.filter((_: PicIndex, index: number) => {
      return index % 4 === 3;
    });

    const sectionList = albumConfigs.length === 0 ? [] : sub0.map((value: PicIndex, index: number) => {
      return new GridLineBean(
        value,
        index < sub1.length ? sub1[index] : null,
        index < sub2.length ? sub2[index] : null,
        index < sub3.length ? sub3[index] : null,
        getConfigMap,
      );
    });

    return sectionList;
  }

  const gridDataList = initBySectionData(sectionList)

  useEffect(() => {
    dispatch(refreshSectionList())
    dispatch({ type: 'title/resetTitle' });
  }, [searchKey, albumConfigs, dispatch])


  const parentCompHandler: ParentCompHandler = {
    refreshScrollTop: (scrollTop: number) => {
      dispatch({
        type: 'flow1000/scrollTop',
        scrollTop: scrollTop,
      });
    },

    inScrolling: (inScrolling: boolean) => {
      dispatch({
        type: 'flow1000/inScrolling',
        inScrolling,
      });
    }
  }
  return (
    <div style={{ height: `${props.height - 64}px` }} >
      <LazyLoader
        dataList={gridDataList}
        scrollTop={scrollTop}
        height={props.height - 64}
        dispatchHandler={parentCompHandler}
      />
    </div>
  );
}

export default connect(({ flow1000Content }: RootState) => {
  return {
    height: flow1000Content.height,
    width: flow1000Content.width,
    expandImgIndex: flow1000Content.expandImgIndex,
    searchKey: flow1000Content.searchKey,
  };
})(function (props: Flow1000Props) {
  // console.log("GridContainer:" + props.height);
  return <GridContainerFunc   height={props.height} expandImgIndex={props.expandImgIndex}  searchKey={props.searchKey} />;
});