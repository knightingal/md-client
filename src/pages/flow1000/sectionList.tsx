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
import { Flow1000ModelState, SectionListAction, PwdDialogDispAction } from '../../models/flow1000';

const fetchSectionList = (search: string): Promise<PicIndex[]> => {
  const battleShipPage = true;
  const fetchUrl = battleShipPage
    ? '/local1000/picIndexAjax?album=BattleShips'
    : search === ''
    ? '/local1000/picIndexAjax'
    : '/local1000/searchSection?name=' + search;

  return fetch(fetchUrl)
    .then((resp: Response) => {
      return resp.json();
    })
    .then((json: PicIndex[]) => {
      const sectionList: PicIndex[] = json;
      sectionList.forEach((picIndex: PicIndex, index: number) => {
        picIndex.sectionIndex = picIndex.index;
        picIndex.index = index;
      });
      return sectionList;
    });
};

const splite2GridLine = (sectionList: Array<PicIndex>): SectionLine[] => {
  const sub0 = sectionList.filter((_: PicIndex, index: number) => index % 4 == 0);
  const sub1 = sectionList.filter((_: PicIndex, index: number) => index % 4 == 1);
  const sub2 = sectionList.filter((_: PicIndex, index: number) => index % 4 == 2);
  const sub3 = sectionList.filter((_: PicIndex, index: number) => index % 4 == 3);

  const sectionGrid: SectionLine[] = sub0.map((value: PicIndex, index: number) => {
    const picIndex: PicIndex[] = [value];
    if (index < sub1.length) {
      picIndex.push(sub1[index]);
    }
    if (index < sub2.length) {
      picIndex.push(sub2[index]);
    }
    if (index < sub3.length) {
      picIndex.push(sub3[index]);
    }
    return new SectionLine(picIndex);
  });
  return sectionGrid;
}
interface Flow1000Props {
  height: number;
  expandImgIndex: number;
  dispatch: Dispatch<SectionListAction | PwdDialogDispAction>;
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
  sectionList: SectionInfo[];

  constructor(picIndex: PicIndex[]) {
    this.height = 360;
    this.expand = false;
    this.sectionList = picIndex.map(value => new SectionInfo(value));
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

  const className = !sectionLine.expand
    ? classes.gridItem
    : `${classes.gridItem} ${classes.expandGridItem}`;

  const style: CSSProperties = !sectionLine.expand ? { height: '360px' } : {};
  return (
    <div style={style}>
      <Grid container={true} spacing={1} className={className}>
        {sectionLine.sectionList.map(section => {
          return (
            <Grid item={true} xs={3}>
              <RecipeReviewCard
                sectionIndex={section.sectionIndex}
                index={section.index}
                mount={props.mount}
                timeStamp={section.timeStamp}
                title={section.title}
                imgSrc={section.imgSrc}
                coverHeight={section.coverHeight}
                coverWidth={section.coverWidth}
              />
            </Grid>
          );
        })}
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

  const refreshSections = (sections: PicIndex[]) => {
    props.dispatch({
      type: 'flow1000/sectionList',
      subRest: sections,
    });
    setSectionList(splite2GridLine(sections));
  };

  const [sectionList, setSectionList] = useState<Array<SectionLine>>([]);
  const [prevExpandIndex, setPrevExpandIndex] = useState(-1);
  useEffect(() => {
    if (props.pwd == null || props.pwd.length == 0) {
      props.dispatch({
        type: 'flow1000/setPwdDialogDisp',
        pwdDialogDisp: true,
      });
    } else {
      fetchSectionList(props.search).then((sections) => {
        refreshSections(sections);
      });
    }
  }, []);

  useEffect(() => {
    if (props.pwd.length > 0) {
      fetchSectionList(props.search).then((sections) => {
        refreshSections(sections);
      });
    }
  }, [props.search, props.pwd]);

  useEffect(() => {
    const floorIndex = Math.floor(props.expandImgIndex / 4);
    if (sectionList[floorIndex] != undefined) {
      sectionList[floorIndex].expand = true;
      if (sectionList[prevExpandIndex] != undefined && prevExpandIndex != floorIndex) {
        sectionList[prevExpandIndex].expand = false;
      }
      setPrevExpandIndex(floorIndex);
      setSectionList(sectionList);
    }
  }, [props.expandImgIndex]);


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
};

export default connect((status: { flow1000: Flow1000ModelState }) => ({
  height: status.flow1000.height,
  width: status.flow1000.width,
  expandImgIndex: status.flow1000.expandImgIndex,
  scrollTop: status.flow1000.scrollTop,
  pwd: status.flow1000.pwd,
  search: status.flow1000.search,
}))(GridContainer);
