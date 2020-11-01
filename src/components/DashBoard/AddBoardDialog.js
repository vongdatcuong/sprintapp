import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';

// Service
import authHeader from '../../services/auth-header.js';
import AuthService from '../../services/auth.service';
import constant from '../../Utils';

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: '1.5em',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    content: {
        minWidth: '350px'
    },
    action: {
        justifyContent: 'center'
    },
    button: {
        margin: theme.spacing(1),
    },
}))

export default function AddBoardDialog(props) {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [errorMsg, setErrMsg] = useState('');

  const handleAddBoard = () => {
    const user = AuthService.getCurrentUser();
    if (!name || !user){
        return;
    }
    props.setIsLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: Object.assign({
            'Content-Type': 'application/json'   
        }, authHeader()),
        body: JSON.stringify({ 
            userID: user.userID,
            name: name
        })
    };
    return fetch(constant.api + constant.allBoardPath + constant.addBoard, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.isSuccess){
                props.addBoard(result.board);
                props.setOpen(false);
            } else {
                setErrMsg(result.message);
            }
            props.setIsLoading(false);
    }, (error) => {
        if (error) {
          props.setIsLoading(false);
        }
      })
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleNameChange = (evt) => {
    setName(evt.target.value);
  }

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle className={classes.title} component='h1' id="form-dialog-title">Create Board</DialogTitle>
        <DialogContent className={classes.content}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Board Name"
            type="text"
            fullWidth
            error={name === ""}
            helperText={name === "" ? 'Enter board name' : ' '}
            onChange={(evt) => handleNameChange(evt)}
          />
          <FormHelperText className={classes.formMessage} error={true}>
              {errorMsg}
          </FormHelperText>
        </DialogContent>
        <DialogActions className={classes.action}>
          <Button onClick={handleAddBoard} variant="contained" color="primary" className={classes.button}>
            Create
          </Button>
          <Button onClick={handleClose} variant="contained" color="secondary" className={classes.button}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
