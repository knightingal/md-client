import { HeightType, ParentCompHandler, lazyLoaderFun } from "../components/LazyLoader"

const ListItem = (props: {item: ItemProps, mount: boolean}) => {
  return <div style={{height: "32px"}}>item {props.item.text}</div>
}

class ItemProps implements HeightType {
  height: number;
  text: string;

  constructor(height: number, text: string) {
    this.height = height;
    this.text = text;
  }
}

const LazyTestPage = () => {
  const dataList: ItemProps[] = [
    new ItemProps(32, "0"), new ItemProps(32, "1"),
    new ItemProps(32, "2"), new ItemProps(32, "3"),
    new ItemProps(32, "4"), new ItemProps(32, "5"),
    new ItemProps(32, "6"), new ItemProps(32, "7"),
    new ItemProps(32, "8"), new ItemProps(32, "9"),
    new ItemProps(32, "10"), new ItemProps(32, "11"),
    new ItemProps(32, "12"), new ItemProps(32, "13"),
    new ItemProps(32, "14"), new ItemProps(32, "15"),
    new ItemProps(32, "16"), new ItemProps(32, "17"),
    new ItemProps(32, "18"), new ItemProps(32, "19"),
    new ItemProps(32, "20"), new ItemProps(32, "21"),
    new ItemProps(32, "22"), new ItemProps(32, "23"),
    new ItemProps(32, "24"), new ItemProps(32, "25"),
    new ItemProps(32, "26"), new ItemProps(32, "27"),
    new ItemProps(32, "28"), new ItemProps(32, "29"),
  ]

  const LazyLoader = lazyLoaderFun<ItemProps>(ListItem, "TestLazy", 1)

  const parentCompHandler: ParentCompHandler = {
    refreshScrollTop: (_: number) => void {
    },
    inScrolling: (_: boolean) => void {
    }
  }
  return <div>
    <LazyLoader height={240} dataList={dataList} scrollTop={0} dispatchHandler={parentCompHandler}/>
  </div>
}

export default LazyTestPage;