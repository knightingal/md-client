import { ReactNode, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, } from 'react-redux';
import { Outlet } from "react-router-dom";
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { AlbumConfig, initConfig, search, setWindowSize, useAppSelector } from '../store';


const Flow1000 = () => {

  const title = useAppSelector((state) => state.flow1000Title.title);
  const sectionIndex = useAppSelector((state) => state.flow1000Title.sectionIndex);
  const displaySyncBtn = useAppSelector((state) => state.flow1000Title.displaySyncBtn);
  const dispatch = useDispatch()

  const postDownloadSection = () => {
    fetch(`/local1000/downloadSection?id=${sectionIndex}`, {method:"POST"})
      .then((resp: Response) => {
        return resp.json();
      })
      .then((json: any) => {
        // props.dispatch(refreshSectionList())
      });
  }

  // const classes = useStyles();
  useEffect(() => {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;
    console.log("flow1000 useEffect:" + height)
    dispatch(setWindowSize({height: height, width: width}))
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetch("/local1000/albumConfig/list")
      .then((resp: Response) => resp.json())
      .then((json: Array<AlbumConfig>) => {
        const albumConfigs: Array<AlbumConfig> = json;
        dispatch(initConfig({albumConfigs: albumConfigs}))
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSearch = (value: string) => {
    dispatch(search({searchKey: value}))
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
              {title}
            </Typography>
            { 
              displaySyncBtn ? 
              <IconButton onClick={() => postDownloadSection()}
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <DownloadIcon />
              </IconButton> : null
            }
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
};

export default Flow1000;

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

