import {ReactNode, useEffect} from 'react';
import {Flow1000ModelState} from '../models/flow1000';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Outlet } from "react-router-dom";

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
        console.log("flow1000 useEffect:" + height)
        props.dispatch({
            type:'flow1000/setWindowSize',
            height: height,
            width: width
        });
    // eslint-disable-next-line
    },[]);
    return (
    <div style={{display: "flex", height: "100%", flexDirection: "column"}}>
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton 
                        edge="start" 
                        color="inherit" 
                        aria-label="menu" 
                        sx={{mr:2}}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{flexGlow:1}}
                    >
                        Welcome to user Flow1000
                    </Typography>
                    <Button color="inherit">About</Button>
                </Toolbar>
            </AppBar>
        </Box>

        <div style={{flex:"1 1 auto", height:"100%"}}>
            <Outlet />
        </div>
    </div>
    );
});

