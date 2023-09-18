import React, { useEffect, useState } from 'react';
import { ReactNode, } from 'react';
import { lazyLoader, LazyProps, ParentCompHandler } from '../../components/LazyLoader';

import { connect, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Flow1000ModelState, refreshSectionList } from '../../models/flow1000';
import { AlbumConfig, ConfigState } from '../../store';
import { GridLine, GridLineBean, PicIndex } from '../../components/GridLine';
interface Flow1000Props {
  height: number;
  width: number;
  expandImgIndex: number[];
  children?: ReactNode;
  dispatch: Dispatch<any>;
  scrollTop: number;
  searchKey: string;
  sectionList: PicIndex[];
}

const LazyLoader: React.ComponentClass<LazyProps<
  GridLineBean
>> = lazyLoader(GridLine, 'SectionList');

const GridContainerFunc = (props: {
  height: number;
  expandImgIndex: number[];
  searchKey: string
  dispatch: Dispatch<any>;
  scrollTop: number, subRest: PicIndex[]
}) => {
  const albumConfigs = useSelector((state: {
    flow1000Config: ConfigState,
  }) => {
    return state.flow1000Config.albumConfigs;
  })

  const sectionDataList = useSelector((state: {
    flow1000: {sectionList: Array<PicIndex>}
  }) => {
    return state.flow1000.sectionList;
  })

  const { searchKey, dispatch } = props;
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

  const sectionList = initBySectionData(sectionDataList)


  useEffect(() => {
    // const fecthSectionList = () => {
    //   const battleShipPage = false;
    //   // const battleShipPage = true;
    //   let fetchUrl = battleShipPage
    //     ? '/local1000/picIndexAjax?album=ship'
    //     : '/local1000/picIndexAjax?';

    //   if (searchKey != null && searchKey !== '') {
    //     fetchUrl = fetchUrl.concat("&searchKey=" + searchKey)
    //   }

    //   fetch(fetchUrl)
    //     .then((resp: Response) => resp.json())
    //     .then((json: Array<PicIndex>) => {
    //       let subRest: Array<PicIndex>;
    //       subRest = json;
    //       subRest.forEach((picIndex: PicIndex, index: number) => {
    //         picIndex.sectionIndex = picIndex.index;
    //         picIndex.expanded = false;
    //         picIndex.index = index;
    //       });

    //       dispatch({
    //         type: 'flow1000/setSeciontList',
    //         sectionList: subRest,
    //       });
    //       initBySectionData(subRest);
    //     });
    // }
    // fecthSectionList();
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
        dataList={sectionList}
        scrollTop={props.scrollTop}
        height={props.height - 64}
        dispatchHandler={parentCompHandler}
      />
    </div>
  );
}

export default connect(({ flow1000 }: { flow1000: Flow1000ModelState }) => {
  return {
    height: flow1000.height,
    width: flow1000.width,
    expandImgIndex: flow1000.expandImgIndex,
    scrollTop: flow1000.scrollTop,
    searchKey: flow1000.searchKey,
    sectionList: flow1000.sectionList,
  };
})(function (props: Flow1000Props) {
  console.log("GridContainer:" + props.height);
  return <GridContainerFunc subRest={props.sectionList} scrollTop={props.scrollTop} height={props.height} expandImgIndex={props.expandImgIndex} dispatch={props.dispatch} searchKey={props.searchKey} />;
});