import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { connect } from 'dva';
import {SimClientModelState, Device} from '../models/simClient';
import { Dispatch } from 'redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { router } from "umi";
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        table: {},
        tableHeader: {
            fontWeight:600
        }
    }),
);

interface ReigsterProps  {
  currentDevice: Device;
  dispatch: Dispatch<any>;
}

export default connect(
  ({simClient}:{simClient:SimClientModelState}) => (
     {currentDevice:simClient.currentDevice}
  )
)(function TerminalList (props:ReigsterProps) {
    const [terminalList, setTerminalList ] = useState(new Array<Device>());
    useEffect(()=>{
        const response = fetch("/message/terminalInfo", {
            method:"GET" 
        });
        response.then(body=> body.json()).then((deviceList:Array<Device>) => {
            console.log(deviceList);
            setTerminalList(deviceList)
        });
    },[]);

    const handleSelectDeivce = (device:Device) => {
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
    }

  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
    <Table className={classes.table} aria-label="simple table">
      <TableHead >
        <TableRow >
          <TableCell align="left" className={classes.tableHeader}>appKey</TableCell>
          <TableCell align="left" className={classes.tableHeader}>userId</TableCell>
          <TableCell align="left" className={classes.tableHeader}>esn</TableCell>
          <TableCell align="left" className={classes.tableHeader}>outerNetwork</TableCell>
          <TableCell align='right' className={classes.tableHeader}>操作</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {terminalList.map(device => (
          <TableRow key={device.id}>
            <TableCell align="left">{device.appKey}</TableCell>
            <TableCell align="left">{device.userId}</TableCell>
            <TableCell align="left">{device.esn}</TableCell>
            <TableCell align="left">{device.outerNetwork}</TableCell>
            <TableCell align="right" >
                <a onClick={(e)=>handleSelectDeivce(device)}>选择</a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  );
})
