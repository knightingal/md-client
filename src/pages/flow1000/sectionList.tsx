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
        // height: 340,
        // marginTop: 0,
        // marginBottom: 0,
    },
  }),
);
function RecipeReviewCard(props: {title:string, imgSrc:string}) {
    const classes = useStyles();
  
    return (
      <Card className={classes.card}>
        <CardHeader
          title={props.title}
          subheader="sub"
        />
        <CardMedia
          className={classes.media}
          image={props.imgSrc}
        />
        <CardActions disableSpacing>
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

    constructor(value:number) {
        this.imgSrc = "http://127.0.0.1/tarsylia_resources/120.jpg";
        this.title = `title${value}`;
    }
}
class SectionBean extends SectionInfo  implements HeightType{
    height:number;

    constructor(value:number) {
        super(value);
        this.height = 352;
    }
}

const genSectionList:()=>Array<SectionBean> = () => {
    return [
      1,2,3,4,5,6,7,8,9,10,
      1,2,3,4,5,6,7,8,9,10,
      1,2,3,4,5,6,7,8,9,10,
      1,2,3,4,5,6,7,8,9,10,
      1,2,3,4,5,6,7,8,9,10,
    ].map((value:number) => {return new SectionBean(value)});
}

interface SectionListProps {}

interface SectionListStatus {}

const GridLine = (props:SectionInfo) => {

    const classes = useStyles();
    return <Grid container spacing={1} className={classes.gridItem} >
        <Grid item xs={3}>
            <RecipeReviewCard title={props.title + "-1"} imgSrc={props.imgSrc}/>
        </Grid>
        <Grid item xs={3}>
            <RecipeReviewCard title={props.title + "-2"} imgSrc={props.imgSrc}/>
        </Grid>
        <Grid item xs={3}>
            <RecipeReviewCard title={props.title + "-3"} imgSrc={props.imgSrc}/>
        </Grid>
        <Grid item xs={3}>
            <RecipeReviewCard title={props.title + "-4"} imgSrc={props.imgSrc}/>
        </Grid>
    </Grid>
}

class SectionItem extends React.Component<{item:SectionBean, parentComp: GridContainer}> {
    constructor(props:{item:SectionBean, parentComp: GridContainer}) {
      super(props);
    }
    render() {
        return <GridLine title={this.props.item.title} imgSrc={this.props.item.imgSrc}/>
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

class GridContainer extends React.Component<{height:number}, {}> {
    constructor(props:{height:number}) {
      super(props);
    }
    render() {
        const sectionList: Array<SectionBean> = genSectionList();
        return <div style={{ height: `${this.props.height-64}px`}}>
            <LazyLoader dataList={sectionList} scrollTop={0} parentComp={this} height={this.props.height-64}/>
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