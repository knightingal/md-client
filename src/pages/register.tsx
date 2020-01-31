import React, { useState, ChangeEvent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField, { TextFieldProps, } from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { connect } from 'dva';
import {SimClientModelState, Device} from '../models/simClient';
import { Dispatch } from 'redux';
import { router } from "umi";
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
        width: '100%',
    },
    textField: {
      width: '100%',
    },
  }),
);

// interface RegisterStat {
//   appKey:string
// }

interface ReigsterProps  {
  currentDevice: Device;
  dispatch: Dispatch<any>;
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
    router.push("/md-page/terminal-list")
  };

  const [device, setDevice] = useState(props.currentDevice);

  const changeText = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    (device as any)[event.target.id] = event.target.value;
    setDevice(device);
  }


  const classes = useStyles();
  return (
    <form style={{margin:8}} noValidate={true} autoComplete="off">
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={3} />
        <Grid item={true} xs={3}>
          <CustTextField id="esn" label="esn" onChange={changeText} defaultValue={props.currentDevice.esn}/>
        </Grid>
        <Grid item={true} xs={3}>
          <CustTextField id="appKey" label="appKey" onChange={changeText} defaultValue={props.currentDevice.appKey}/>
        </Grid>
        <Grid item={true} xs={3} />

        <Grid item={true} xs={3} />
        <Grid item={true} xs={3}>
          <CustTextField id="userId" label="userId" onChange={changeText} defaultValue={props.currentDevice.userId}/>
        </Grid>
        <Grid item={true} xs={3}>
          <CustTextField id="outerNetwork" label="outerNetwork" onChange={changeText} defaultValue={props.currentDevice.outerNetwork}/>
        </Grid>
        <Grid item={true} xs={3} />

        <Grid item={true} xs={3} />
        <Grid item={true} xs={6}>
          <CustTextField id="pushToken" label="pushToken" onChange={changeText} defaultValue={props.currentDevice.pushToken}/>
        </Grid>
        <Grid item={true} xs={3} />

        <Grid item={true} xs={3} />
        <Grid item={true} xs={3}>
          <Button className={classes.button} onClick={handleRegist} variant="outlined">注册</Button>
        </Grid>
        <Grid item={true} xs={3}>
          <Button className={classes.button} onClick={handleTerminalList} variant="outlined" color="primary">
            终端列表
          </Button>
        </Grid>
        <Grid item={true} xs={3} />
      </Grid>
    </form>
  );
})

