import React, { useState, ChangeEvent } from 'react';
import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'dva';
import {SimClientModelState, Device} from '../models/simClient';
import { RouteChildrenProps } from 'react-router';
import { Dispatch } from 'redux';
import { router } from "umi";
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

export default connect(
  ({simClient}:{simClient:SimClientModelState}) => (
     {currentDevice:simClient.currentDevice}
  )
)(function Register (props:ReigsterProps) {
  const handleRegist = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("handle regist");
    console.log(device);
        device.appId = device.appKey;
        const response = fetch("/message/register", {
            method:"POST", headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(device)
        });
        response.then(body=> body.json()).then(jsonBody => {
            if (jsonBody.successful) {
                const pushToken = jsonBody.resultmessage;
                device.pushToken = pushToken;
            }
            props.dispatch({
                type:'simClient/selectDevice',
                device: device
            });
            router.push("/md-page/msg-recv/")
        });
  };
  const handleTerminalList = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log("handle terminal list");
    router.push("/md-page/terminal-list")
  };

  const [device, setDevice] = useState(props.currentDevice);

  const changeText = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    (device as any)[event.target.id] = event.target.value;
    setDevice(device);
  }


  const classes = useStyles();
  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField id="esn" label="esn" onChange={changeText} defaultValue={props.currentDevice.esn}/><div></div>
      <TextField id="appKey" label="appKey" onChange={changeText} defaultValue={props.currentDevice.appKey}/><div></div>
      <TextField id="userId" label="userId" onChange={changeText} defaultValue={props.currentDevice.userId}/><div></div>
      <TextField id="outerNetwork" label="outerNetwork" onChange={changeText} defaultValue={props.currentDevice.outerNetwork}/><div></div>
      <TextField id="pushToken" label="pushToken" onChange={changeText} defaultValue={props.currentDevice.pushToken}/><div></div>
      <Button className={classes.button} onClick={handleRegist} variant="outlined">注册</Button>
      <Button className={classes.button} onClick={handleTerminalList} variant="outlined" color="primary">
          终端列表
      </Button>
    </form>
  );
})
