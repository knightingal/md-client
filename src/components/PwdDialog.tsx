import React, { ChangeEvent } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Flow1000ModelState, PwdDialogDispAction, PwdAction } from '../models/flow1000';


interface PwdDialogProp {
  pwdDialogDisp: boolean;
  dispatch: Dispatch<PwdDialogDispAction | PwdAction>;
}

export default connect(({ flow1000 }: { flow1000: Flow1000ModelState }) => ({
  pwdDialogDisp: flow1000.pwdDialogDisp,
}))((prop: PwdDialogProp) => {
  let pwd:string = "";
  const handleClose = () => {
    prop.dispatch({
      type: "flow1000/setPwdDialogDisp",
      pwdDialogDisp: false,
    });
  };

  const enterPwd = () => {
    prop.dispatch({
      type: "flow1000/setPwd",
      pwd: pwd
    });
  };

  const onTextFieldChanged = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    pwd = event.target.value;
  }

  return (
    <div>
      <Dialog open={prop.pwdDialogDisp} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To decrypt this website, please enter your Password here. 
          </DialogContentText>
          <TextField
            autoFocus={true}
            margin="dense"
            id="password"
            label="Password"
            type="password"
            onChange={onTextFieldChanged}
            fullWidth={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={enterPwd} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});
