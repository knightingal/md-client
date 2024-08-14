import { useEffect, } from 'react';
import { ParentCompHandler, lazyLoaderFun, } from '../../components/LazyLoader';

import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState, refreshSectionList } from '../../store';
import { AlbumConfig, scrollTop as scrollTopAction, inScrolling as inScrollingAction } from '../../store';
import { GridLine, GridLineBean, PicIndex } from '../../components/GridLine';

const LazyLoader = lazyLoaderFun<GridLineBean>(GridLine, 'SectionList');

const GridContainerFunc = () => {

  const sectionList = useSelector((state: RootState) => state.flow1000Content.sectionList);
  const scrollTop = useSelector((state: RootState) => state.flow1000Content.scrollTop);
  const albumConfigs = useSelector((state: RootState) => state.flow1000Config.albumConfigs);
  const searchKey = useSelector((state: RootState) => state.flow1000Content.searchKey);
  const height = useSelector((state: RootState) => state.flow1000Content.height);
  const albumConfigMap = new Map(albumConfigs.map(config => [config.name, config]))

  const dispatch: Dispatch<any> = useDispatch<any>()


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
      dispatch(scrollTopAction({scrollTop: scrollTop}))
    },

    inScrolling: (inScrolling: boolean) => {
      dispatch(inScrollingAction({inScrolling: inScrolling}))
    }
  }

  return (
    <div style={{ height: `${height - 64}px` }} >
      <LazyLoader
        dataList={gridDataList}
        scrollTop={scrollTop}
        height={height - 64}
        dispatchHandler={parentCompHandler}
      />
    </div>
  );
}

export default GridContainerFunc;