import React from 'react';
import {ReactNode, useEffect} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {Flow1000ModelState} from '../models/flow1000';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'dva';
import { Dispatch } from 'redux';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

interface Flow1000Props {
    height:number;
    width:number;
    children?: ReactNode;
    dispatch: Dispatch<any>;
}

export default connect(
    ({flow1000}:{flow1000:Flow1000ModelState}) => {
        console.log("flow1000 layout connecting")
        return {height:flow1000.height, width:flow1000.width}
    }
) ((props: Flow1000Props) => {
    const classes = useStyles();
    useEffect(()=>{
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        console.log("useEffect")
        props.dispatch({
            type:'flow1000/setWindowSize',
            height: height,
            width: width
        });
    },[]);
    return (
    <div style={{display: "flex", height: "100%", flexDirection: "column"}}>
        <div className={classes.root} style={{flex:"0 0 64px"}}>
            <AppBar position="static">
                <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Welcome to user Flow1000
                </Typography>
                <Button color="inherit">About</Button>
                </Toolbar>
            </AppBar>
        </div>
        <div style={{flex:"1 1 auto", height:"100%"}}>
            {props.children}
        </div>
    </div>
    );
});

