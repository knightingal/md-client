import React from 'react';
import {ReactNode, useEffect} from 'react';
// import { createStyles, makeStyles, Theme } from '@mui/material/styles';
import {Flow1000ModelState} from '../models/flow1000';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
/*
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
*/

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
    // const classes = useStyles();
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
        <div 
        // className={classes.root} 
        style={{flex:"0 0 64px"}}>
            <AppBar position="static">
                <Toolbar>
                <IconButton edge="start" 
                // className={classes.menuButton} 
                color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" 
                // className={classes.title}
                >
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

