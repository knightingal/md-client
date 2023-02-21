import React, { useEffect, useState } from 'react';
import { ReactNode, } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Grid from '@mui/material/Grid';
import { lazyLoader, LazyProps, HeightType, ParentCompHandler } from '../../components/LazyLoader';
import ImgComponent from '../../components/SectionImgComponent';

import { connect, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Flow1000ModelState } from '../../models/flow1000';
import { ConfigState } from '../../store';
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

function RecipeReviewCard(props: {
  title: string;
  imgSrc: string;
  sectionIndex: number;
  mount: boolean;
  index: number;
  coverHeight: number;
  coverWidth: number;
  timeStamp: string;
}) {

  return (
    <Card >
      <CardHeader title={props.title} subheader={props.timeStamp} />
      <ImgComponent
        sectionIndex={props.sectionIndex}
        src={props.imgSrc}
        password="yjmK14040842$000"
        mount={props.mount}
        index={props.index}
        height={props.coverHeight}
        width={props.coverWidth}
      />
      <CardActions disableSpacing={true}>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

class SectionInfo {
  imgSrc: string;

  title: string;
  timeStamp: string;
  index: number;
  sectionIndex: number;

  coverHeight: number;
  coverWidth: number;

  constructor(value: PicIndex) {
    // this.imgSrc = "http://127.0.0.1:3000/tarsylia_resources/120.jpg";
    this.imgSrc = `/linux1000/encrypted/${value.name}/${value.cover}.bin`;
    this.title = value.name.substring(14);
    this.timeStamp = value.name.substring(0, 14);
    this.sectionIndex = value.sectionIndex;
    this.index = value.index;
    this.coverHeight = value.coverHeight;
    this.coverWidth = value.coverWidth;
  }
}

class GridLineBean implements HeightType {
  height: number;
  expand: boolean;

  section0: SectionInfo;
  section1: SectionInfo | null;
  section2: SectionInfo | null;
  section3: SectionInfo | null;


  constructor(value0: PicIndex, value1: PicIndex | null, value2: PicIndex | null, value3: PicIndex | null) {
    this.height = 360;
    this.expand = false;
    this.section0 = new SectionInfo(value0);
    this.section1 = value1 != null ? new SectionInfo(value1) : null;
    this.section2 = value2 != null ? new SectionInfo(value2) : null;
    this.section3 = value3 != null ? new SectionInfo(value3) : null;

  }
}


interface SectionListProps { }

interface SectionListStatus { }

const GridLine = (props: { sectionBean: GridLineBean; mount: boolean }) => {

  const section1 =
    props.sectionBean.section1 != null ? (
      <Grid item={true} xs={3}>
        <RecipeReviewCard
          sectionIndex={props.sectionBean.section1.sectionIndex}
          index={props.sectionBean.section1.index}
          mount={props.mount}
          timeStamp={props.sectionBean.section1.timeStamp}
          title={props.sectionBean.section1.title}
          imgSrc={props.sectionBean.section1.imgSrc}
          coverHeight={props.sectionBean.section1.coverHeight}
          coverWidth={props.sectionBean.section1.coverWidth}
        />
      </Grid>
    ) : null;
  const section2 =
    props.sectionBean.section2 != null ? (
      <Grid item={true} xs={3}>
        <RecipeReviewCard
          sectionIndex={props.sectionBean.section2.sectionIndex}
          index={props.sectionBean.section2.index}
          mount={props.mount}
          timeStamp={props.sectionBean.section2.timeStamp}
          title={props.sectionBean.section2.title}
          imgSrc={props.sectionBean.section2.imgSrc}
          coverHeight={props.sectionBean.section2.coverHeight}
          coverWidth={props.sectionBean.section2.coverWidth}
        />
      </Grid>
    ) : null;
  const section3 =
    props.sectionBean.section3 != null ? (
      <Grid item={true} xs={3}>
        <RecipeReviewCard
          sectionIndex={props.sectionBean.section3.sectionIndex}
          index={props.sectionBean.section3.index}
          mount={props.mount}
          timeStamp={props.sectionBean.section3.timeStamp}
          title={props.sectionBean.section3.title}
          imgSrc={props.sectionBean.section3.imgSrc}
          coverHeight={props.sectionBean.section3.coverHeight}
          coverWidth={props.sectionBean.section3.coverWidth}
        />
      </Grid>
    ) : null;

  return (
    <div style={{ "height": "360px" }}>
      <Grid container={true} spacing={1} sx={{ marginTop: "auto" }}  >
        <Grid item={true} xs={3}>
          <RecipeReviewCard
            sectionIndex={props.sectionBean.section0.sectionIndex}
            index={props.sectionBean.section0.index}
            timeStamp={props.sectionBean.section0.timeStamp}
            mount={props.mount}
            title={props.sectionBean.section0.title}
            imgSrc={props.sectionBean.section0.imgSrc}
            coverHeight={props.sectionBean.section0.coverHeight}
            coverWidth={props.sectionBean.section0.coverWidth}
          />
        </Grid>
        {section1}
        {section2}
        {section3}
      </Grid>
    </div>
  );
};


class SectionItem extends React.Component<{ item: GridLineBean, parentComp: GridContainer | ((props: any) => JSX.Element), mount: boolean }> {
  render() {
    return <GridLine sectionBean={this.props.item} mount={this.props.mount} />
  }
}
const LazyLoader: React.ComponentClass<LazyProps<
  GridLineBean,
  SectionListProps,
  SectionListStatus,
  GridContainer
>> = lazyLoader(SectionItem, 'SectionList');

interface PicIndex {
  sectionIndex: number;
  name: string;
  cover: string;
  index: number;
  coverWidth: number;
  coverHeight: number;
  expanded: boolean;
}


const GridContainerFunc = (props: {
  height: number;
  expandImgIndex: number[];
  searchKey: string
  dispatch: Dispatch<any>;
  scrollTop: number, subRest: PicIndex[]
}) => {
  const albumConfig = useSelector(({ flow1000Config }: { flow1000Config: ConfigState }) => flow1000Config)
  console.log(`albumConfig=`);
  console.log(albumConfig.albumConfigs);

  const parentCompHandler: ParentCompHandler = {
    refreshScrollTop: (scrollTop: number) => {
      props.dispatch({
        type: 'flow1000/scrollTop',
        scrollTop: scrollTop,
      });
    },

    inScrolling: (inScrolling: boolean) => {
      props.dispatch({
        type: 'flow1000/inScrolling',
        inScrolling,
      });
    }
  }

  function fecthSectionList() {
    // const battleShipPage = false;
    const battleShipPage = true;
    let fetchUrl = battleShipPage
      ? '/local1000/picIndexAjax?album=ship'
      : '/local1000/picIndexAjax?';

    if (props.searchKey != null && props.searchKey !== '') {
      fetchUrl = fetchUrl.concat("&searchKey=" + props.searchKey)
    }

    fetch(fetchUrl)
      .then((resp: Response) => {
        return resp.json();
      })
      .then((json: Array<PicIndex>) => {
        let subRest: Array<PicIndex>;
        subRest = json;
        subRest.forEach((picIndex: PicIndex, index: number) => {
          picIndex.sectionIndex = picIndex.index;
          picIndex.expanded = false;
          picIndex.index = index;
        });

        props.dispatch({
          type: 'flow1000/setSeciontList',
          sectionList: subRest,
        });
        initBySectionData(subRest);
      });
  }

  function initBySectionData(subRest: PicIndex[]) {
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

    const sectionList = sub0.map((value: PicIndex, index: number) => {
      return new GridLineBean(
        value,
        index < sub1.length ? sub1[index] : null,
        index < sub2.length ? sub2[index] : null,
        index < sub3.length ? sub3[index] : null,
      );
    });

    setSectionList(sectionList)

  }

  const [sectionList, setSectionList] = useState<GridLineBean[]>([])

  useEffect(() => {
    fecthSectionList();
  }, [props.searchKey])


  return (
    <div style={{ height: `${props.height - 64}px` }} >
      <LazyLoader
        dataList={sectionList}
        scrollTop={props.scrollTop}
        parentComp={GridContainerFunc}
        height={props.height - 64}
        dispatchHandler={parentCompHandler}
      />
    </div>
  );

}


class GridContainer extends React.Component<
  {
    height: number;
    expandImgIndex: number[];
    searchKey: string
    dispatch: Dispatch<any>;
    scrollTop: number, subRest: PicIndex[]
  },
  { sectionList: Array<GridLineBean> }
> implements ParentCompHandler {
  constructor(props: { height: number; expandImgIndex: number[]; dispatch: Dispatch<any>; scrollTop: number; searchKey: string; subRest: PicIndex[] }) {
    super(props);
    this.state = { sectionList: [] };
    this.prevExpandIndex = -1;
  }

  refreshScrollTop(scrollTop: number) {
    this.props.dispatch({
      type: 'flow1000/scrollTop',
      scrollTop: scrollTop,
    });
  }

  inScrolling: (inScrolling: boolean) => void = (inScrolling: boolean) => {
    this.props.dispatch({
      type: 'flow1000/inScrolling',
      inScrolling,
    });

  }

  prevExpandIndex: number;


  fecthSectionList() {
    const battleShipPage = false;
    // const battleShipPage = true;
    let fetchUrl = battleShipPage
      ? '/local1000/picIndexAjax?album=ship'
      : '/local1000/picIndexAjax?';

    if (this.props.searchKey != null && this.props.searchKey !== '') {
      fetchUrl = fetchUrl.concat("&searchKey=" + this.props.searchKey)
    }

    fetch(fetchUrl)
      .then((resp: Response) => {
        return resp.json();
      })
      .then((json: Array<PicIndex>) => {
        let subRest: Array<PicIndex>;
        if (battleShipPage) {
          // subRest = json.concat(json, json, json, json, json, json, json, json);
          subRest = json;
        } else {
          subRest = json;
        }
        subRest.forEach((picIndex: PicIndex, index: number) => {
          picIndex.sectionIndex = picIndex.index;
          picIndex.expanded = false;
          picIndex.index = index;
        });

        this.props.dispatch({
          type: 'flow1000/setSeciontList',
          sectionList: subRest,
        });
        this.initBySectionData(subRest);
      });
  }

  initBySectionData(subRest: PicIndex[]) {
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

    const sectionList = sub0.map((value: PicIndex, index: number) => {
      return new GridLineBean(
        value,
        index < sub1.length ? sub1[index] : null,
        index < sub2.length ? sub2[index] : null,
        index < sub3.length ? sub3[index] : null,
      );
    });

    this.setState({
      sectionList: sectionList,
    });

  }

  componentDidMount() {
    if (this.props.subRest.length <= 0) {
      this.fecthSectionList();

    } else {
      this.initBySectionData(this.props.subRest);
    }
  }

  componentDidUpdate(prevProps: { searchKey: string }) {
    if (this.props.searchKey !== prevProps.searchKey) {
      this.fecthSectionList();
    }
  }

  render() {
    return (
      <div style={{ height: `${this.props.height - 64}px` }} >
        <LazyLoader
          dataList={this.state.sectionList}
          scrollTop={this.props.scrollTop}
          parentComp={this}
          height={this.props.height - 64}
          dispatchHandler={this}
        />
      </div>
    );
  }
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