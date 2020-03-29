import React, { useState, ChangeEvent, useEffect } from 'react';
import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import TextField, { TextFieldProps, } from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'dva';
import {SimClientModelState, Device} from '../models/simClient';
import { RouteChildrenProps } from 'react-router';
import { Dispatch } from 'redux';
import { router } from "umi";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        // width: 400,
      },
    },
    button: {
        width: "100%",
    },
    textField: {
      width: '100%',
    },

    table: {},
    tableHeader: {
        fontWeight:600
    },
    timeStampWidth: {
        fontWeight:600,
      width: 200,
    },
    titleWidth: {
        fontWeight:600,
      width: 200,
    }
  }),
);

// interface RegisterStat {
//   appKey:string
// }

interface ReigsterProps  {
  currentDevice: Device;
  dispatch: Dispatch<any>;
}

interface Msg {
    timeStamp:string;
    content:string;
    id:number;
    title:string;
}

function CustTextField(props: TextFieldProps) {
  const classes = useStyles();
  return <TextField {...props} className={classes.textField} />
}

export default connect(
  ({simClient}:{simClient:SimClientModelState}) => (
     {currentDevice:simClient.currentDevice}
  )
)(function Register (props:ReigsterProps) {
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
        router.push("/md-page/");
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
                const msgContent = JSON.parse(JSON.parse(msg.msg).msgContent.replace('mip_cmd_msg:', '')).content;
                const msgTitle = JSON.parse(msg.msg).title;

                // msgList.push({timeStamp:transDateToDateString(new Date()), msg: msg.msg});
                const newMsgLisg = localMsgList.concat({
                  id:localMsgList.length, 
                  timeStamp:transDateToDateString(new Date()), 
                  content: msgContent, 
                  title: msgTitle});
                localMsgList = newMsgLisg;
                setMsgList(newMsgLisg);
            }
        }
        wsConnection.onclose = (event) => {
            // this.$emit("unregister-ret");
            router.push("/md-page/");
        }

        return () => {
            wsConnection?.close();
        }
    },[]);


  const classes = useStyles();
  return (<div style={{display:"flex", height:"100%"}}>
    <form style={{flex: "1 1 auto",  width:350, backgroundColor: 'aliceblue', padding: 8}}  noValidate={true} autoComplete="off">
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <CustTextField 
            id="esn" 
            label="设备号" 
            defaultValue={props.currentDevice.esn}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <CustTextField 
            id="appKey" 
            label="应用" 
            defaultValue={props.currentDevice.appKey}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <CustTextField 
            id="userId" 
            label="用户名" 
            defaultValue={props.currentDevice.userId}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <CustTextField 
            id="outerNetwork" 
            label="模式" 
            defaultValue={props.currentDevice.outerNetwork}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <CustTextField 
            id="pushToken" 
            label="TOKEN" 
            defaultValue={props.currentDevice.pushToken}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <Button className={classes.button} onClick={handleTerminalList} variant="outlined" color="primary">
              注销
          </Button>
        </Grid>

      </Grid>
    </form>
    <TableContainer component={Paper} style={{flex: "4 1 auto", overflowY: 'hidden', paddingLeft: 8, paddingRight: 8}}>
    <Table className={classes.table} aria-label="simple table">
      <TableHead >
        <TableRow >
          <TableCell align="left" className={classes.timeStampWidth}>时间戳</TableCell>
          <TableCell align="left" className={classes.titleWidth}>消息标题</TableCell>
          <TableCell align="left" className={classes.tableHeader}>消息内容</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {msgList.map(msg => (
          <TableRow key={msg.id}>
            <TableCell align="left">{msg.timeStamp}</TableCell>
            <TableCell align="left">{msg.title}</TableCell>
            <TableCell align="left">{msg.content}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
    </div>
  );
})
