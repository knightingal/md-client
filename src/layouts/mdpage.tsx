import React from 'react';
import { createStyles, makeStyles, Theme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
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

const MdpageLayout: React.FC = props => {
    // const classes = useStyles();
  return (
    <div>
        <div 
        // className={classes.root}
        >
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
            Welcome to user Sim-Client
          </Typography>
          <Button color="inherit">About</Button>
        </Toolbar>
      </AppBar>
    </div>
      {/* {props.children} */}
    </div>
  );
};

export default MdpageLayout;
