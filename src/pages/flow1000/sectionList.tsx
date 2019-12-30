import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import {lazyLoader, LazyProps, HeightType } from '../../components/LazyLoader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    gridItem: {
        height: 340,
        marginTop: 0,
        marginBottom: 0,
    },
  }),
);
function RecipeReviewCard() {
    const classes = useStyles();
  
    return (
      <Card className={classes.card}>
        <CardHeader
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016"
        />
        <CardMedia
          className={classes.media}
          image="http://127.0.0.1/tarsylia_resources/120.jpg"
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

class SectionBean implements HeightType{
    height:number;

    constructor() {
        this.height = 340;
    }
}

const genSectionList:()=>Array<SectionBean> = () => {
    return [1,2,3,4,5,6,7].map(() => {return new SectionBean()});
}

interface SectionListProps {}

interface SectionListStatus {}

const GridLine = () => {

    const classes = useStyles();
    return <Grid container spacing={1} className={classes.gridItem} >
        <Grid item xs={3}>
            <RecipeReviewCard />
        </Grid>
        <Grid item xs={3}>
            <RecipeReviewCard />
        </Grid>
        <Grid item xs={3}>
            <RecipeReviewCard />
        </Grid>
        <Grid item xs={3}>
            <RecipeReviewCard />
        </Grid>
    </Grid>
}

class SectionItem extends React.Component<{item:SectionBean, parentComp: GridContainer}> {
    render() {
        return <GridLine />
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

class GridContainer extends React.Component<{}, {}> {
    render() {
        const sectionList: Array<SectionBean> = genSectionList();
        return <div style={{height:"900px"}}>
            <LazyLoader dataList={sectionList} scrollTop={0} parentComp={this} />

        </div>
    }
}

export default function() {
    return <GridContainer />
    // const classes = useStyles();
    // return <> 
    // <Grid container spacing={1} className={classes.gridItem}>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    // </Grid>
    // <Grid container spacing={1} className={classes.gridItem}>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    // </Grid>
    // <Grid container spacing={1} className={classes.gridItem}>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    // </Grid>
    // <Grid container spacing={1} className={classes.gridItem}>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    //     <Grid item xs={3}>
    //         <RecipeReviewCard />
    //     </Grid>
    // </Grid>
    // </>;
}