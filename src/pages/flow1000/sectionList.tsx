import React, { CSSProperties } from 'react';
import { ReactNode, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import Grid from '@material-ui/core/Grid';
import { lazyLoader, LazyProps, HeightType } from '../../components/LazyLoader';
import ImgComponent from '../../components/SectionImgComponent';
import PwdDialog from '../../components/PwdDialog';

import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Flow1000ModelState } from '../../models/flow1000';
interface Flow1000Props {
  height: number;
  expandImgIndex: number;
  dispatch: Dispatch<any>;
  scrollTop: number;
  pwd: string;
  search: string;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {},
    media: {
      height: '200px',
    },
    gridItem: {
      margin: 0,
    },
    expandGridItem: {},
  }),
);
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
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title={props.title} subheader={props.timeStamp} />
      <ImgComponent
        sectionIndex={props.sectionIndex}
        src={props.imgSrc}
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
    this.imgSrc = `/static/encrypted/${value.name}/${value.cover}.bin`;
    this.title = value.name.substring(14);
    this.timeStamp = value.name.substring(0, 14);
    this.sectionIndex = value.sectionIndex;
    this.index = value.index;
    this.coverHeight = value.coverHeight;
    this.coverWidth = value.coverWidth;
  }
}

class SectionLine implements HeightType {
  height: number;
  expand: boolean;

  section0: SectionInfo;
  section1: SectionInfo | null;
  section2: SectionInfo | null;
  section3: SectionInfo | null;

  constructor(
    value0: PicIndex,
    value1: PicIndex | null,
    value2: PicIndex | null,
    value3: PicIndex | null,
  ) {
    this.height = 360;
    this.expand = false;
    this.section0 = new SectionInfo(value0);
    this.section1 = value1 != null ? new SectionInfo(value1) : null;
    this.section2 = value2 != null ? new SectionInfo(value2) : null;
    this.section3 = value3 != null ? new SectionInfo(value3) : null;
  }
}

interface SectionListProps {}

interface SectionListStatus {}

const GridLine = (props: { sectionLine: SectionLine; mount: boolean }) => {
  const classes = useStyles();

  const section0 = (
    <Grid item={true} xs={3}>
      <RecipeReviewCard
        sectionIndex={props.sectionLine.section0.sectionIndex}
        index={props.sectionLine.section0.index}
        timeStamp={props.sectionLine.section0.timeStamp}
        mount={props.mount}
        title={props.sectionLine.section0.title}
        imgSrc={props.sectionLine.section0.imgSrc}
        coverHeight={props.sectionLine.section0.coverHeight}
        coverWidth={props.sectionLine.section0.coverWidth}
      />
    </Grid>
  );

  const section1 =
    props.sectionLine.section1 != null ? (
      <Grid item={true} xs={3}>
        <RecipeReviewCard
          sectionIndex={props.sectionLine.section1.sectionIndex}
          index={props.sectionLine.section1.index}
          mount={props.mount}
          timeStamp={props.sectionLine.section1.timeStamp}
          title={props.sectionLine.section1.title}
          imgSrc={props.sectionLine.section1.imgSrc}
          coverHeight={props.sectionLine.section1.coverHeight}
          coverWidth={props.sectionLine.section1.coverWidth}
        />
      </Grid>
    ) : null;
  const section2 =
    props.sectionLine.section2 != null ? (
      <Grid item={true} xs={3}>
        <RecipeReviewCard
          sectionIndex={props.sectionLine.section2.sectionIndex}
          index={props.sectionLine.section2.index}
          mount={props.mount}
          timeStamp={props.sectionLine.section2.timeStamp}
          title={props.sectionLine.section2.title}
          imgSrc={props.sectionLine.section2.imgSrc}
          coverHeight={props.sectionLine.section2.coverHeight}
          coverWidth={props.sectionLine.section2.coverWidth}
        />
      </Grid>
    ) : null;
  const section3 =
    props.sectionLine.section3 != null ? (
      <Grid item={true} xs={3}>
        <RecipeReviewCard
          sectionIndex={props.sectionLine.section3.sectionIndex}
          index={props.sectionLine.section3.index}
          mount={props.mount}
          timeStamp={props.sectionLine.section3.timeStamp}
          title={props.sectionLine.section3.title}
          imgSrc={props.sectionLine.section3.imgSrc}
          coverHeight={props.sectionLine.section3.coverHeight}
          coverWidth={props.sectionLine.section3.coverWidth}
        />
      </Grid>
    ) : null;
  const className = !props.sectionLine.expand
    ? classes.gridItem
    : `${classes.gridItem} ${classes.expandGridItem}`;

  const style: CSSProperties = !props.sectionLine.expand ? { height: '360px' } : {};
  return (
    <div style={style}>
      <Grid container={true} spacing={1} className={className}>
        {section0}
        {section1}
        {section2}
        {section3}
      </Grid>
    </div>
  );
};

class SectionItem extends React.Component<{
  item: SectionLine;
  mount: boolean;
  index: number;
}> {
  constructor(props: { item: SectionLine;  mount: boolean, index: number }) {
    super(props);
  }
  render() {
    return <GridLine sectionLine={this.props.item} mount={this.props.mount} />;
  }
}
const LazyLoader: React.ComponentClass<LazyProps<
  SectionLine,
  SectionListProps,
  SectionListStatus,
  null
>> = lazyLoader(SectionItem, 'SectionList');

interface PicIndex {
  sectionIndex: number;
  name: string;
  cover: string;
  index: number;
  coverWidth: number;
  coverHeight: number;
}

class GridContainer extends React.Component<
  Flow1000Props,
  { sectionList: Array<SectionLine> }
> {
  constructor(props: {
    height: number;
    expandImgIndex: number;
    dispatch: Dispatch<any>;
    scrollTop: number;
    pwd: string;
    search: string;
  }) {
    super(props);
    this.state = { sectionList: [] };
    this.prevExpandIndex = -1;
  }

  prevExpandIndex: number;

  fecthSectionList() {
    const battleShipPage = true;
    const fetchUrl = battleShipPage
      ? '/local1000/picIndexAjax?album=BattleShips'
      : this.props.search === '' ? '/local1000/picIndexAjax' : '/local1000/searchSection?name=' + this.props.search;

    fetch(fetchUrl)
      .then((resp: Response) => {
        return resp.json();
      })
      .then((json: Array<PicIndex>) => {
        let subRest: Array<PicIndex>;
        if (battleShipPage) {
          subRest = json;
        } else {
          subRest = json;
        }
        subRest.forEach((picIndex: PicIndex, index: number) => {
          picIndex.sectionIndex = picIndex.index;
          picIndex.index = index;
        });
        const sub0 = subRest.filter((_: PicIndex, index: number) => {
          return index % 4 == 0;
        });
        const sub1 = subRest.filter((_: PicIndex, index: number) => {
          return index % 4 == 1;
        });
        const sub2 = subRest.filter((_: PicIndex, index: number) => {
          return index % 4 == 2;
        });
        const sub3 = subRest.filter((_: PicIndex, index: number) => {
          return index % 4 == 3;
        });

        const sectionList = sub0.map((value: PicIndex, index: number) => {
          return new SectionLine(
            value,
            index < sub1.length ? sub1[index] : null,
            index < sub2.length ? sub2[index] : null,
            index < sub3.length ? sub3[index] : null,
          );
        });

        this.setState({
          sectionList: sectionList,
        });
        this.props.dispatch({
          type: 'flow1000/sectionList',
          subRest: subRest,
        });
      });
  }
  componentDidMount() {
    if (this.props.pwd == null || this.props.pwd.length == 0) {
      this.props.dispatch({
        type: "flow1000/setPwdDialogDisp",
        pwdDialogDisp: true
      });
    } else {
      this.fecthSectionList();
    }
  }

  componentDidUpdate(prevProps: { expandImgIndex: number; search: string; pwd: string }) {
    if (this.props.search != prevProps.search) {
      this.fecthSectionList();
    }
    if (this.props.pwd != prevProps.pwd && this.props.pwd != null && this.props.pwd.length != 0) {
      this.fecthSectionList();
    }

    if (this.props.expandImgIndex != prevProps.expandImgIndex) {
      const floorIndex = Math.floor(this.props.expandImgIndex / 4);
      if (this.state.sectionList[floorIndex] != undefined) {
        this.state.sectionList[floorIndex].expand = true;
        if (
          this.state.sectionList[this.prevExpandIndex] != undefined &&
          this.prevExpandIndex != floorIndex
        ) {
          this.state.sectionList[this.prevExpandIndex].expand = false;
        }
        this.prevExpandIndex = floorIndex;
        this.setState({
          sectionList: this.state.sectionList,
        });
      }
    }
  }

  render() {
    return (
      <div style={{ height: `${this.props.height - 64}px` }}>
        <LazyLoader
          dataList={this.state.sectionList}
          scrollTop={this.props.scrollTop}
          height={this.props.height - 64}
          dispatch={this.props.dispatch}
        />
        <PwdDialog />
      </div>
    );
  }
}
export default connect(({flow1000}: { flow1000: Flow1000ModelState, }) => ({
    height: flow1000.height,
    width: flow1000.width,
    expandImgIndex: flow1000.expandImgIndex,
    scrollTop: flow1000.scrollTop,
    pwd: flow1000.pwd,
    search: flow1000.search,
  })
)(GridContainer);
