import React from 'react';
import {ReactNode, useEffect} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import Grid from '@material-ui/core/Grid';
import {lazyLoader, LazyProps, HeightType } from '../../components/LazyLoader';
import {ImgComponent } from '../../components/ImgComponent';

import { connect } from 'dva';
import { Dispatch } from 'redux';
import {Flow1000ModelState} from '../../models/flow1000';
interface Flow1000Props {
    height:number;
    width:number;
    children?: ReactNode;
    dispatch: Dispatch<any>;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
    },
    media: {
      height: '200px',
    },
    gridItem: {
        // height: 360,
        // marginTop: 0,
        // marginBottom: 0,
        margin:0
    },
  }),
);
function RecipeReviewCard(props: {title:string, imgSrc:string, mount: boolean}) {
    const classes = useStyles();
  
    return (
      <Card className={classes.card}>
        <CardHeader
          title={props.title}
          subheader="sub"
        />
        <ImgComponent src={props.imgSrc} password="yjmK14040842$000" mount={props.mount}/>
        {/* <CardMedia
          className={classes.media}
          component="img"
          image={props.imgSrc}
        /> */}
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
    imgSrc:string;

    title:string;

    constructor(value : PicIndex) {
        // this.imgSrc = "http://127.0.0.1:3000/tarsylia_resources/120.jpg";
        this.imgSrc=`/static/encrypted/${value.name}/${value.cover}.bin`; 
        this.title = value.name.substring(14);
    }
}

class SectionBean   implements HeightType{
    height:number;

    section0:SectionInfo;
    section1:SectionInfo|null;
    section2:SectionInfo|null;
    section3:SectionInfo|null;


    constructor(value0: PicIndex, value1: PicIndex | null, value2: PicIndex | null, value3: PicIndex | null) {
        this.height = 360;
        this.section0 = new SectionInfo(value0);
        this.section1 = value1 != null ? new SectionInfo(value1) : null;
        this.section2 = value2 != null ? new SectionInfo(value2) : null;
        this.section3 = value3 != null ? new SectionInfo(value3) : null;
        
    }
}


interface SectionListProps {}

interface SectionListStatus {}

const GridLine = (props:{sectionBean:SectionBean; mount: boolean}) => {

    const classes = useStyles();

    const section1 = props.sectionBean.section1 != null ? (<Grid item={true} xs={3}>
        <RecipeReviewCard mount={props.mount} title={props.sectionBean.section1.title} imgSrc={props.sectionBean.section1.imgSrc}/>
    </Grid>): null;
    const section2 = props.sectionBean.section2 != null ? (<Grid item={true} xs={3}>
        <RecipeReviewCard mount={props.mount} title={props.sectionBean.section2.title} imgSrc={props.sectionBean.section2.imgSrc}/>
    </Grid>): null;
    const section3 = props.sectionBean.section3 != null ? (<Grid item={true} xs={3}>
        <RecipeReviewCard mount={props.mount} title={props.sectionBean.section3.title} imgSrc={props.sectionBean.section3.imgSrc}/>
    </Grid>): null;
    return <div style={{height:"360px"}}>
      <Grid container={true} spacing={1} className={classes.gridItem} >
          <Grid item={true} xs={3}>
              <RecipeReviewCard mount={props.mount} title={props.sectionBean.section0.title} imgSrc={props.sectionBean.section0.imgSrc}/>
          </Grid> 
          {section1}
          {section2}
          {section3}
      </Grid>

    </div>
}

const GridLine2 = (props:{sectionBean:SectionBean}) => {

    const classes = useStyles();

    const section1 = props.sectionBean.section1 != null ? (<Grid item={true} xs={3}>
      <h2>{props.sectionBean.section1.title}</h2>
        {/* <RecipeReviewCard title={props.sectionBean.section1.title} imgSrc={props.sectionBean.section1.imgSrc}/> */}
    </Grid>): null;
    const section2 = props.sectionBean.section2 != null ? (<Grid item={true} xs={3}>
      <h2>{props.sectionBean.section2.title}</h2>
        {/* <RecipeReviewCard title={props.sectionBean.section2.title} imgSrc={props.sectionBean.section2.imgSrc}/> */}
    </Grid>): null;
    const section3 = props.sectionBean.section3 != null ? (<Grid item={true} xs={3}>
      <h2>{props.sectionBean.section3.title}</h2>
        {/* <RecipeReviewCard title={props.sectionBean.section3.title} imgSrc={props.sectionBean.section3.imgSrc}/> */}
    </Grid>): null;
    return <div style={{height:"360px"}}>
      <Grid container={true} spacing={1} className={classes.gridItem} >
          <Grid item={true} xs={3}>
            <h2>{props.sectionBean.section0.title}</h2>
              {/* <RecipeReviewCard title={props.sectionBean.section0.title} imgSrc={props.sectionBean.section0.imgSrc}/> */}
          </Grid> 
          {section1}
          {section2}
          {section3}
      </Grid>

    </div>
}

class SectionItem extends React.Component<{item:SectionBean, parentComp: GridContainer, mount: boolean}> {
    constructor(props:{item:SectionBean, parentComp: GridContainer, mount: boolean}) {
      super(props);
    }
    render() {
        return <GridLine sectionBean={this.props.item} mount={this.props.mount}/>
    }
}
const LazyLoader: React.ComponentClass<
    LazyProps<
        SectionBean, 
        SectionListProps, 
        SectionListStatus, 
        GridContainer
    >
> 
= lazyLoader(SectionItem, "SectionList");

interface PicIndex {
  name: string;
  cover: string;
}

class GridContainer extends React.Component<{height:number}, {sectionList:Array<SectionBean>}> {
    constructor(props:{height:number}) {
      super(props);
      this.state = {sectionList:[]}
    }

    
    fecthSectionList() {
      const battleShipPage = true;
      const fetchUrl = battleShipPage ? "/local1000/picIndexAjax?album=BattleShips" : "/local1000/picIndexAjax";

      console.log("fetchUrl is " + fetchUrl);
      fetch(fetchUrl)
      .then((resp: Response) => {
          return resp.json();
      })
      .then((json: Array<PicIndex>) => {
          let subRest: Array<PicIndex>;
          if (battleShipPage) {
            subRest = json.concat(json, json, json, json, json, json, json, json);
          } else {
            subRest = json;
          }
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

          const splitRest = sub0.map((value: PicIndex, index: number) => {
            return [value, 
              index < sub1.length ? sub1[index] : null,
              index < sub2.length ? sub2[index] : null,
              index < sub3.length ? sub3[index] : null,
            ]
          });

          const sectionList = splitRest.map((value: (PicIndex | null)[]) => {
            return new SectionBean(value[0] as PicIndex, value[1], value[2], value[3]);
          })

          this.setState({
              sectionList: sectionList
          });
      });
  }
  componentDidMount() {
    this.fecthSectionList();        
  }

    render() {
        // const sectionList: Array<SectionBean> = genSectionList();
        return <div style={{ height: `${this.props.height - 64}px`}}>
            <LazyLoader dataList={this.state.sectionList} scrollTop={0} parentComp={this} height={this.props.height - 64}/>
        </div>
    }
}
export default connect(
    ({flow1000}:{flow1000:Flow1000ModelState}) => {
        console.log("sectionList connecting")
        return {height:flow1000.height, width:flow1000.width}
    }
)
(function(props:Flow1000Props) {
    return <GridContainer height={props.height}/>
})
