import { ReactNode, useEffect } from 'react';
import { Flow1000ModelState } from '../models/flow1000';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { connect, } from 'react-redux';
import { Dispatch } from 'redux';
import { Outlet } from "react-router-dom";
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

interface Flow1000Props {
  height: number;
  width: number;
  children?: ReactNode;
  dispatch: Dispatch<any>;
}

export default connect(
  ({ flow1000 }: { flow1000: Flow1000ModelState }) => {
    console.log("flow1000 layout connecting")
    return { height: flow1000.height, width: flow1000.width }
  }
)((props: Flow1000Props) => {
  // const classes = useStyles();
  useEffect(() => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    console.log("flow1000 useEffect:" + height)
    props.dispatch({
      type: 'flow1000/setWindowSize',
      height: height,
      width: width
    });
    // eslint-disable-next-line
  }, []);

  const onSearch = (value: string) => {
    props.dispatch({
      type: "flow1000/search",
      searchKey: value
    })

  }
  return (
    <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Welcome to user Flow1000
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                onChange={(e) => { onSearch((e.nativeEvent as any).target.value) }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Toolbar>
        </AppBar>
      </Box>

      <div style={{ flex: "1 1 auto", height: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

