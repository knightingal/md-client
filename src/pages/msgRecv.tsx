import React, { useState, ChangeEvent, useEffect } from 'react';
// import { createStyles, makeStyles, withStyles, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { connect } from 'react-redux';
import {SimClientModelState, Device} from '../models/simClient';
import { Dispatch } from 'redux';
// import { router } from "umi";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";
/*
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: 400,
      },
    },
    button: {
        width: 192,
    },

    table: {},
    tableHeader: {
        fontWeight:600
    },
    timeStampWidth: {
        fontWeight:600,
      width: 200,
    }
  }),
);
*/

// interface RegisterStat {
//   appKey:string
// }

interface ReigsterProps  {
  currentDevice: Device;
  dispatch: Dispatch<any>;
}

interface Msg {
    timeStamp:string;
    msg:string;
    id:number;
}

export default connect(
  ({simClient}:{simClient:SimClientModelState}) => (
     {currentDevice:simClient.currentDevice}
  )
)(function Register (props:ReigsterProps) {
  const navigate = useNavigate();
  const handleRegist = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("handle regist");
    console.log(device);
  };
  const handleTerminalList = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("handle terminal list");
    const response = fetch("/message/unregister", {
        method:"POST", headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({pushtoken: device.pushToken})
    });
    response.then(body=> body.json()).then(jsonBody => {
        console.log(jsonBody);
        // wsConnection?.close();
        // window.location = "/pns/register";
        navigate("/md-page/");
    });


    
  };

  const [device, setDevice] = useState(props.currentDevice);
  const [msgList, setMsgList] = useState(new Array<Msg>());
  let localMsgList = msgList;
  const transDateToDateString = (dateObj:Date) => {
    const year = dateObj.getFullYear();
    let month:string|number = dateObj.getMonth() + 1;
    month = month >= 10 ? `${month}` : `0${month}`;
    let date:string|number = dateObj.getDate();
    date = date >= 10 ? `${date}` : `0${date}`;
    let hour :string|number= dateObj.getHours();
    hour = hour >= 10 ? `${hour}` : `0${hour}`;
    let min:string|number = dateObj.getMinutes();
    min = min >= 10 ? `${min}` : `0${min}`;
    let sec:string|number = dateObj.getSeconds();
    sec = sec >= 10 ? `${sec}` : `0${sec}`;
    return `${year}-${month}-${date} ${hour}:${min}:${sec}`;
 };

  let wsConnection:WebSocket|null = null;
    useEffect(()=>{
        const HAND_SHAKE_CMD = 1;
        const MSG_CMD = 2;
        const url = new URL(document.URL)
        wsConnection = new WebSocket(`ws://${url.hostname}:${url.port}/web-socket/`);
        wsConnection.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.cmd == HAND_SHAKE_CMD) {
                console.log(`pushToken=${device.pushToken}`);
                console.log(`appKey=${device.appKey}`);
                wsConnection?.send(JSON.stringify({"cmd": 1, "pushToken": device.pushToken, "appKey": device.appKey}));
            } else if (msg.cmd == MSG_CMD) {
                console.log(`recv msg:${msg.msg}`);
                // msgList.push({timeStamp:transDateToDateString(new Date()), msg: msg.msg});
                const newMsgLisg = localMsgList.concat({id:localMsgList.length, timeStamp:transDateToDateString(new Date()), msg: msg.msg});
                localMsgList = newMsgLisg;
                setMsgList(newMsgLisg);
            }
        }
        wsConnection.onclose = (event) => {
            // this.$emit("unregister-ret");
            navigate("/md-page/");
        }

        return () => {
            wsConnection?.close();
        }
    },[]);


  // const classes = useStyles();
  return (<>
    <form 
      // className={classes.root} 
      noValidate autoComplete="off">
      <TextField id="esn" label="esn"  defaultValue={props.currentDevice.esn}/><div></div>
      <TextField id="appKey" label="appKey"  defaultValue={props.currentDevice.appKey}/><div></div>
      <TextField id="userId" label="userId"  defaultValue={props.currentDevice.userId}/><div></div>
      <TextField id="outerNetwork" label="outerNetwork"  defaultValue={props.currentDevice.outerNetwork}/><div></div>
      <TextField id="pushToken" label="pushToken"  defaultValue={props.currentDevice.pushToken}/><div></div>
      <Button 
      // className={classes.button} 
      onClick={handleTerminalList} variant="outlined" color="primary">
          注销
      </Button>
    </form>
    <TableContainer component={Paper}>
    <Table 
    // className={classes.table} 
    aria-label="simple table">
      <TableHead >
        <TableRow >
          <TableCell align="left" 
          // className={classes.timeStampWidth}
          >timeStamp</TableCell>
          <TableCell align="left" 
          // className={classes.tableHeader}
          >msg</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {msgList.map(msg => (
          <TableRow key={msg.id}>
            <TableCell align="left">{msg.timeStamp}</TableCell>
            <TableCell align="left">{msg.msg}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
    </>
  );
})
