import React, { CSSProperties, useState, useEffect } from 'react';
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

/**
 * a Component contain 4 sections in one line
 */
const GridLine = (props: { item: SectionLine; mount: boolean }) => {
  const classes = useStyles();
  const sectionLine: SectionLine = props.item;

  const section0 = (
    <Grid item={true} xs={3}>
      <RecipeReviewCard
        sectionIndex={sectionLine.section0.sectionIndex}
        index={sectionLine.section0.index}
        timeStamp={sectionLine.section0.timeStamp}
        mount={props.mount}
        title={sectionLine.section0.title}
        imgSrc={sectionLine.section0.imgSrc}
        coverHeight={sectionLine.section0.coverHeight}
        coverWidth={sectionLine.section0.coverWidth}
      />
    </Grid>
  );

  const section1 =
    sectionLine.section1 != null ? (
      <Grid item={true} xs={3}>
        <RecipeReviewCard
          sectionIndex={sectionLine.section1.sectionIndex}
          index={sectionLine.section1.index}
          mount={props.mount}
          timeStamp={sectionLine.section1.timeStamp}
          title={sectionLine.section1.title}
          imgSrc={sectionLine.section1.imgSrc}
          coverHeight={sectionLine.section1.coverHeight}
          coverWidth={sectionLine.section1.coverWidth}
        />
      </Grid>
    ) : null;
  const section2 =
    sectionLine.section2 != null ? (
      <Grid item={true} xs={3}>
        <RecipeReviewCard
          sectionIndex={sectionLine.section2.sectionIndex}
          index={sectionLine.section2.index}
          mount={props.mount}
          timeStamp={sectionLine.section2.timeStamp}
          title={sectionLine.section2.title}
          imgSrc={sectionLine.section2.imgSrc}
          coverHeight={sectionLine.section2.coverHeight}
          coverWidth={sectionLine.section2.coverWidth}
        />
      </Grid>
    ) : null;
  const section3 =
    sectionLine.section3 != null ? (
      <Grid item={true} xs={3}>
        <RecipeReviewCard
          sectionIndex={sectionLine.section3.sectionIndex}
          index={sectionLine.section3.index}
          mount={props.mount}
          timeStamp={sectionLine.section3.timeStamp}
          title={sectionLine.section3.title}
          imgSrc={sectionLine.section3.imgSrc}
          coverHeight={sectionLine.section3.coverHeight}
          coverWidth={sectionLine.section3.coverWidth}
        />
      </Grid>
    ) : null;
  const className = !sectionLine.expand
    ? classes.gridItem
    : `${classes.gridItem} ${classes.expandGridItem}`;

  const style: CSSProperties = !sectionLine.expand ? { height: '360px' } : {};
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

const LazyLoader: React.ComponentClass<LazyProps<
  SectionLine,
  SectionListProps,
  SectionListStatus,
  null
>> = lazyLoader(GridLine, 'SectionList');

interface PicIndex {
  sectionIndex: number;
  name: string;
  cover: string;
  index: number;
  coverWidth: number;
  coverHeight: number;
}

const GridContainer = (props: Flow1000Props) => {
  ////////////////  hocks ////////////////////////////////
  const [sectionList, setSectionList] = useState<Array<SectionLine>>([]);
  const [prevExpandIndex, setPrevExpandIndex] = useState(-1);
  useEffect(()=>{
    if (props.pwd == null || props.pwd.length == 0) {
      props.dispatch({
        type: 'flow1000/setPwdDialogDisp',
        pwdDialogDisp: true,
      });
    } else {
      fetchSectionList();
    }
  }, [])

  useEffect(() => {
    if (props.pwd.length > 0) {
      fetchSectionList();
    }
  }, [props.search, props.pwd]);

  useEffect(() => {
    const floorIndex = Math.floor(props.expandImgIndex / 4);
    if (sectionList[floorIndex] != undefined) {
      sectionList[floorIndex].expand = true;
      if (
        sectionList[prevExpandIndex] != undefined &&
        prevExpandIndex != floorIndex
      ) {
        sectionList[prevExpandIndex].expand = false;
      }
      setPrevExpandIndex(floorIndex);
      setSectionList(sectionList);
    }
  }, [props.expandImgIndex]);
  
  //////////////////////////////////////////////////////// 
  
  const fetchSectionList = () => {
    const battleShipPage = false;
    const fetchUrl = battleShipPage
      ? '/local1000/picIndexAjax?album=BattleShips'
      : props.search === ''
      ? '/local1000/picIndexAjax'
      : '/local1000/searchSection?name=' + props.search;

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

        setSectionList(sectionList);
        props.dispatch({
          type: 'flow1000/sectionList',
          subRest: subRest,
        });
      });
  }

  return (
    <div style={{ height: `${props.height - 64}px` }}>
      <LazyLoader
        dataList={sectionList}
        scrollTop={props.scrollTop}
        height={props.height - 64}
        dispatch={props.dispatch}
      />
      <PwdDialog />
    </div>
  );
}

export default connect((status: { flow1000: Flow1000ModelState }) => ({
  height: status.flow1000.height,
  width: status.flow1000.width,
  expandImgIndex: status.flow1000.expandImgIndex,
  scrollTop: status.flow1000.scrollTop,
  pwd: status.flow1000.pwd,
  search: status.flow1000.search,
}))(GridContainer);
