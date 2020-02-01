import React, { ChangeEvent } from 'react';
import { ReactNode, useEffect } from 'react';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Flow1000ModelState } from '../models/flow1000';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { TextField, InputAdornment } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
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
  title: string;
  children?: ReactNode;
  dispatch: Dispatch<any>;
}

const CssTextField = withStyles({
  root: {
    '& .MuiInputBase-root':{
      color: 'white'
    },
    '& .MuiInput-underline:before':{
      borderBottomColor: 'white'
    },
    '& .MuiInput-underline:hover:before':{
      borderBottomColor: 'white'
    },
    '& .MuiInput-underline':{
      borderBottomColor: 'white'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
  },
})(TextField);

export default connect(({ flow1000 }: { flow1000: Flow1000ModelState }) => ({
  title: flow1000.title,
}))((props: Flow1000Props) => {
  const classes = useStyles();
  useEffect(() => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    props.dispatch({
      type: 'flow1000/setWindowSize',
      height: height,
      width: width,
    });
  }, []);

  const changeText = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    // (device as any)[event.target.id] = event.target.value;
    // setDevice(device);
    const search = event.target.value;
    props.dispatch({
      type: 'flow1000/search',
      search: search,
    });

  }

  const inputProps = {
    startAdornment: (
      <InputAdornment position="start">
        <Search />
      </InputAdornment>
    ),
  }

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <div className={classes.root} style={{ flex: '0 0 64px' }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {props.title}
            </Typography>
            <CssTextField 
              onChange={changeText} 
              InputProps={inputProps}
            />
            <Button color="inherit">About</Button>
          </Toolbar>
        </AppBar>
      </div>
      <div style={{ flex: '1 1 auto', height: '100%' }}>{props.children}</div>
    </div>
  );
});
