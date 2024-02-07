import * as React from 'react';
import { createRef, useEffect, useRef, useState } from 'react';

interface WrappedProps<ITEM_TYPE> {
  item: ITEM_TYPE;
  mount: boolean;
}

export interface HeightType {
  height: number;
}

export interface ParentCompHandler {
  refreshScrollTop: (scrollTop: number) => void
  inScrolling: (inScrolling: boolean) => void
}
// 输入的item数据必须包含一个height字段，用于表示每个item的高度
export interface LazyProps<ITEM_TYPE extends HeightType,> {
  dataList: Array<ITEM_TYPE>;
  scrollTop: number;
  height: number;
  dispatchHandler: ParentCompHandler
}

export interface FunLazyProps<ITEM_TYPE extends HeightType,> {
  dataList: Array<ITEM_TYPE>;
  scrollTop: number;
  height: number;
  dispatchHandler: ParentCompHandler
}

export function lazyLoaderFun<
  ITEM_TYPE extends HeightType
>(WrappedComponent: (props: WrappedProps<ITEM_TYPE>) => JSX.Element,
  className: string,
  preLoadOffSet: number = 1
) {
  return (props: FunLazyProps<ITEM_TYPE>) =>  {
    const {height, scrollTop, dataList, dispatchHandler} = props 
    const itemHeightList: Array<number> = dataList.map(
      (value: ITEM_TYPE, index: number, array: Array<ITEM_TYPE>): number => {
        return value.height;
      },
    );
    const itemHeightStep = itemHeightList.map(
      (value: number, index: number, array: Array<number>): number => {
        if (index === 0) {
          return 0;
        }
        return array
          .slice(0, index)
          .reduce((value: number, current: number): number => value + current);
      },
    );
    const [currentButtonPicIndex, setCurrentButtonPicIndex] = useState<number | null>(null)
    const [currentTopPicIndex, setCurrentTopPicIndex] = useState<number | null>(null)
    const [mount, setMount] = useState<boolean>(true)

    const divRefs: React.RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
    const lastTimeStampe = useRef(-1);
    const scrollHeight = useRef(0);
    const prevHeight = useRef(height)

    function checkPostionInPic(postion: number): number {
      return (
        itemHeightStep.filter(height => {
          return height < postion;
        }).length - 1
      );
    }
    useEffect(() => {
      setCurrentButtonPicIndex(
        checkPostionInPic((divRefs.current as HTMLDivElement).clientHeight + (divRefs.current as HTMLDivElement).scrollTop)
      )
    }, [itemHeightStep, divRefs])

    useEffect(() => {
      const divElement = divRefs.current as HTMLDivElement;
      if (scrollHeight.current <= divElement.clientHeight
        && divElement.scrollHeight > divElement.clientHeight) {
        (divRefs.current as HTMLDivElement).scrollTo(0, scrollTop);
      }
      scrollHeight.current = divElement.scrollHeight
      if (prevHeight.current !== height) {
        setCurrentButtonPicIndex(checkPostionInPic(divElement.clientHeight + divElement.scrollTop));
        prevHeight.current = height;
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [height, scrollTop])

    useEffect(() => {
      const divElement = divRefs.current as HTMLDivElement;
      if (divElement != null) {
        const scrollTop: number = divElement.scrollTop;
        const clientHeight: number = divElement.clientHeight;
        setCurrentTopPicIndex(checkPostionInPic(scrollTop));
        setCurrentButtonPicIndex(checkPostionInPic(scrollTop + clientHeight));
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataList])


    const TopPadding = () => {
      if (
        itemHeightStep != null &&
        currentTopPicIndex != null &&
        dataList != null
      ) {
        // 这里有个bug： 滚轴滑动到最顶端时，currentTopPicIndex会=-1，这会导致sectionItemHeightStep[-1]取值异常，
        // react就不会去更新topPadding的高度，在滑动速度很快时，顶端就会留下一块空白
        // 所以这里为了修复这个问题，对currentTopPicIndex的值做了判定，<0时，topPadding高度设置为0
        const currentTopPicIndex1: number = currentTopPicIndex - preLoadOffSet;
        if (currentTopPicIndex1 < 0) {
          return <div style={{ height: '0px' }} />;
        }
        if (dataList.length === 0) {
          return <div style={{ height: '0px' }} />;
        }
        const topPaddingHeight = itemHeightStep[currentTopPicIndex1];
        return <div style={{ height: `${topPaddingHeight}px` }} />;
      }
      return null;
    }

    const BottomPadding = () => {
      if (itemHeightStep != null && currentButtonPicIndex != null) {
        const currentButtonPicIndex1 = currentButtonPicIndex + preLoadOffSet;
        if (currentButtonPicIndex1 + 1 >= dataList.length) {
          return <div style={{ height: '0px' }} />;
        }
        return (
          <div
            style={{
              height: `${itemHeightStep[itemHeightStep.length - 1] +
                dataList[dataList.length - 1].height -
                itemHeightStep[currentButtonPicIndex1 + 1]}px`,
            }}
          />
        );
      }
      return null;
    }
    const scrollHandler = (e: React.UIEvent) => {
      // if (mount === true) {
      //   setMount(false);
      // }
      lastTimeStampe.current = e.timeStamp;
      const scrollTop: number = (e.target as HTMLDivElement).scrollTop;

      dispatchHandler.refreshScrollTop(scrollTop)
      dispatchHandler.inScrolling(true)
      const clientHeight: number = (e.target as HTMLDivElement).clientHeight;
      // calculate the index of top picture after scroll
      const refreshTopPicIndex = checkPostionInPic(scrollTop);
      setTimeout(
        (timeStamp: number) => {
          if (lastTimeStampe.current === timeStamp) {
            setMount(true)
            dispatchHandler.inScrolling(false)
          }
        },
        300,
        e.timeStamp,
      );

      if (refreshTopPicIndex !== currentTopPicIndex
        && refreshTopPicIndex !== dataList.length) {
        setCurrentTopPicIndex(refreshTopPicIndex)
      }
      // calculate the index of button picture after scroll
      const refreshButtonPicIndex = checkPostionInPic(scrollTop + clientHeight);
      if (refreshButtonPicIndex !== currentButtonPicIndex
        && refreshButtonPicIndex !== dataList.length) {
        setCurrentButtonPicIndex(refreshButtonPicIndex)
      }
    }

    return (
        <div
          className={className}
          onScroll={e => scrollHandler(e)}
          ref={divRefs}
          style={{
            height: `${height}px`,
            willChange: 'transform',
            overflowY: 'scroll',
            overflowX: 'hidden',
          }}
        >
          <TopPadding  />
          {dataList
            .map((itemBean: ITEM_TYPE, index: number) => {
              if (
                currentButtonPicIndex != null &&
                currentTopPicIndex != null
              ) {
                const display =
                  index >= currentTopPicIndex - preLoadOffSet &&
                  index <= currentButtonPicIndex + preLoadOffSet;
                return display ? (
                  <WrappedComponent
                    key={index}
                    item={itemBean}
                    mount={mount}
                  />
                ) : null;
              }
              return null;
            })
            .filter((value: JSX.Element | null, index: number, array: (JSX.Element | null)[]) => {
              return value != null;
            })}
          <BottomPadding  />
        </div>
    );
  }
}


export class SectionBean implements HeightType {
  name: string;
  height: number;
  constructor(name: string) {
    this.name = name;
    this.height = 21;
  }
}
