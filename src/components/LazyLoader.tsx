import * as React from 'react';
import { createRef, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

interface WrappedProps<ITEM_TYPE> {
  item: ITEM_TYPE;
  mount: boolean;
}

interface LazyState {
  currentTopPicIndex: number | null;
  currentButtonPicIndex: number | null;
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

export function lazyLoaderFun<
  ITEM_TYPE extends HeightType
>(WrappedComponent: (props: WrappedProps<ITEM_TYPE>) => JSX.Element,
  className: string,
  preLoadOffSet: number = 1
) {
  return (props: LazyProps<ITEM_TYPE>) =>  {
    const {height, scrollTop, dataList} = props 
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
    const dispatchHandler = useDispatch<any>();

    const divRefs: React.RefObject<HTMLDivElement> = createRef();
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
      if (mount === true) {
        setMount(false);
      }
      lastTimeStampe.current = e.timeStamp;
      const scrollTop: number = (e.target as HTMLDivElement).scrollTop;
      dispatchHandler.refreshScrollTop(scrollTop);
      dispatchHandler.inScrolling(true);
      const clientHeight: number = (e.target as HTMLDivElement).clientHeight;
      // calculate the index of top picture after scroll
      const refreshTopPicIndex = checkPostionInPic(scrollTop);
      setTimeout(
        (timeStamp: number) => {
          if (lastTimeStampe.current === timeStamp) {
            setMount(true)
            dispatchHandler.inScrolling(false);
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



export function lazyLoader<
  ITEM_TYPE extends HeightType
>(
  WrappedComponent: (props: WrappedProps<ITEM_TYPE>) => JSX.Element,
  className: string,
  preLoadOffSet: number = 1,
): React.ComponentClass<LazyProps<ITEM_TYPE>> {

  class LazyLoader extends React.Component<
    LazyProps<ITEM_TYPE>,
    LazyState
  > {
    constructor(props: LazyProps<ITEM_TYPE>) {
      super(props);
      const itemHeightList: Array<number> = props.dataList.map(
        (value: ITEM_TYPE, index: number, array: Array<ITEM_TYPE>): number => {
          return value.height;
        },
      );
      this.itemHeightStep = itemHeightList.map(
        (value: number, index: number, array: Array<number>): number => {
          if (index === 0) {
            return 0;
          }
          return array
            .slice(0, index)
            .reduce((value: number, current: number): number => value + current);
        },
      );

      this.state = {
        currentButtonPicIndex: null,
        currentTopPicIndex: null,
        mount: true,
      };

      this.divRefs = React.createRef();
      this.lastTimeStampe = -1;
      this.scrollHeight = 0;
    }

    divRefs: React.RefObject<HTMLDivElement>;
    itemHeightStep: Array<number>;
    scrollHeight: number;
    lastTimeStampe: number;

    scrollHandler(e: React.UIEvent) {
      if (this.state.mount === true) {
        this.setState({
          mount: false,
        });
      }
      this.lastTimeStampe = e.timeStamp;
      const scrollTop: number = (e.target as HTMLDivElement).scrollTop;
      this.props.dispatchHandler.refreshScrollTop(scrollTop);
      this.props.dispatchHandler.inScrolling(true);
      const clientHeight: number = (e.target as HTMLDivElement).clientHeight;
      // calculate the index of top picture after scroll
      const refreshTopPicIndex = this.checkPostionInPic(scrollTop);
      setTimeout(
        (timeStamp: number) => {
          if (this.lastTimeStampe === timeStamp) {
            this.setState({ mount: true });
            this.props.dispatchHandler.inScrolling(false);
          }
        },
        300,
        e.timeStamp,
      );

      if (refreshTopPicIndex !== this.state.currentTopPicIndex
        && refreshTopPicIndex !== this.props.dataList.length) {
        this.setState({ currentTopPicIndex: refreshTopPicIndex });
      }
      // calculate the index of button picture after scroll
      const refreshButtonPicIndex = this.checkPostionInPic(scrollTop + clientHeight);
      if (refreshButtonPicIndex !== this.state.currentButtonPicIndex
        && refreshButtonPicIndex !== this.props.dataList.length) {
        this.setState({ currentButtonPicIndex: refreshButtonPicIndex });
      }
    }

    TopPadding(props: { self: LazyLoader }) {
      let self = props.self;
      if (
        self.itemHeightStep != null &&
        self.state.currentTopPicIndex != null &&
        self.props.dataList != null
      ) {
        // 这里有个bug： 滚轴滑动到最顶端时，currentTopPicIndex会=-1，这会导致sectionItemHeightStep[-1]取值异常，
        // react就不会去更新topPadding的高度，在滑动速度很快时，顶端就会留下一块空白
        // 所以这里为了修复这个问题，对currentTopPicIndex的值做了判定，<0时，topPadding高度设置为0
        const currentTopPicIndex: number = self.state.currentTopPicIndex - preLoadOffSet;
        if (currentTopPicIndex < 0) {
          return <div style={{ height: '0px' }} />;
        }
        if (self.props.dataList.length === 0) {
          return <div style={{ height: '0px' }} />;
        }
        const topPaddingHeight = self.itemHeightStep[currentTopPicIndex];
        return <div style={{ height: `${topPaddingHeight}px` }} />;
      }
      return null;
    }

    checkPostionInPic(postion: number): number {
      return (
        this.itemHeightStep.filter(height => {
          return height < postion;
        }).length - 1
      );
    }

    componentDidUpdate(
      prevProps: LazyProps<ITEM_TYPE>,
      prevState: LazyState,
    ) {
      if (this.scrollHeight <= (this.divRefs.current as HTMLDivElement).clientHeight
        && (this.divRefs.current as HTMLDivElement).scrollHeight > (this.divRefs.current as HTMLDivElement).clientHeight) {
        (this.divRefs.current as HTMLDivElement).scrollTo(0, this.props.scrollTop);
      }
      this.scrollHeight = (this.divRefs.current as HTMLDivElement).scrollHeight;
      if (prevProps.height !== this.props.height) {
        this.setState({
          currentButtonPicIndex: this.checkPostionInPic(
            (this.divRefs.current as HTMLDivElement).clientHeight,
          ),
        });
      }
      if (this.props.dataList.length !== prevProps.dataList.length) {
        const itemHeightList: Array<number> = this.props.dataList.map(
          (value: ITEM_TYPE, index: number, array: Array<ITEM_TYPE>): number => {
            return value.height;
          },
        );
        this.itemHeightStep = itemHeightList.map(
          (value: number, index: number, array: Array<number>): number => {
            if (index === 0) {
              return 0;
            }
            const subArray = array.slice(0, index);
            return subArray.reduce((value: number, current: number): number => value + current);
          },
        );
        if (this.divRefs.current != null) {
          const scrollTop: number = this.divRefs.current.scrollTop;
          const clientHeight: number = this.divRefs.current.clientHeight;
          this.setState({
            currentTopPicIndex: this.checkPostionInPic(scrollTop),
            currentButtonPicIndex: this.checkPostionInPic(scrollTop + clientHeight),
          });
        }
      }
    }

    componentDidMount() {
      this.setState({
        currentTopPicIndex: 0,
        currentButtonPicIndex: this.checkPostionInPic(
          (this.divRefs.current as HTMLDivElement).clientHeight,
        ),
      });
    }

    BottomPadding(props: { self: LazyLoader }) {
      let self = props.self;
      if (self.itemHeightStep != null && self.state.currentButtonPicIndex != null) {
        const currentButtonPicIndex = self.state.currentButtonPicIndex + preLoadOffSet;
        if (currentButtonPicIndex + 1 >= self.props.dataList.length) {
          return <div style={{ height: '0px' }} />;
        }
        return (
          <div
            style={{
              height: `${self.itemHeightStep[self.itemHeightStep.length - 1] +
                self.props.dataList[self.props.dataList.length - 1].height -
                self.itemHeightStep[currentButtonPicIndex + 1]}px`,
            }}
          />
        );
      }
      return null;
    }

    render() {
      return (
        <div
          className={className}
          onScroll={e => this.scrollHandler(e)}
          ref={this.divRefs}
          style={{
            height: `${this.props.height}px`,
            willChange: 'transform',
            overflowY: 'scroll',
            overflowX: 'hidden',
          }}
        >
          <this.TopPadding self={this} />
          {this.props.dataList
            .map((itemBean: ITEM_TYPE, index: number) => {
              if (
                this.state.currentButtonPicIndex != null &&
                this.state.currentTopPicIndex != null
              ) {
                const display =
                  index >= this.state.currentTopPicIndex - preLoadOffSet &&
                  index <= this.state.currentButtonPicIndex + preLoadOffSet;
                return display ? (
                  <WrappedComponent
                    key={index}
                    item={itemBean}
                    mount={this.state.mount}
                  />
                ) : null;
              }
              return null;
            })
            .filter((value: JSX.Element | null, index: number, array: (JSX.Element | null)[]) => {
              return value != null;
            })}
          <this.BottomPadding self={this} />
        </div>
      );
    }
  };
  return (LazyLoader);
}

export class SectionBean implements HeightType {
  name: string;
  height: number;
  constructor(name: string) {
    this.name = name;
    this.height = 21;
  }
}
