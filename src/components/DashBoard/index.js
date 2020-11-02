import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import './DashBoard.css';
// Material UI Core
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, rgbToHex } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

// Material Icons
import LinkIcon from '@material-ui/icons/Link';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ScheduleIcon from '@material-ui/icons/Schedule';

// Components
import AddBoardDialog from './AddBoardDialog.js';
import ConfirmDialog from '../../dialogs/ConfirmDialog';

// Service
import authHeader from '../../services/auth-header.js';
import AuthService from '../../services/auth.service';
import constant from '../../Utils';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  addIcon: {
    width: '25%',
    height: '25%',
    color: '#8e24aa',
    margin: '0'
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    maxWidth: '1400px'
  },
  addCard: {
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    border: '2px dashed #ccc',
    boxShadow: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:hover': {
      border: '2px dashed #8e24aa',
    }
  },
  card: {
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12)'
    }
  },
  cardContent: {
    flexGrow: 1,
    margin: '3px'
  },
  action: {
    justifyContent: 'center',
  },
  actionBtn: {
    width: '100%'
  },
  actionIcons: {
    fontSize: '15px',
    marginRight: '5px',
    verticalAlign: 'top'
  },
  info: {
    color: '#888888',
    fontSize: '13px',
    position: 'relative',
    '& div.info-time': {
      position: 'absolute',
      left: '7px'
    },
    '& div.info-numOfCard': {
      position: 'absolute',
      right: '7px'
    }
  }
}));

const monthStrs = ['January', 'February', 'March', 'April', 'May', 'June', 'July', "August", 'September', 'October', 'November', 'December'];

function DashBoard(props) {
  const history = useHistory();
  if (!AuthService.getCurrentUser()){
      history.push('/logIn');
  }

  const classes = useStyles();
  const user = AuthService.getCurrentUser();
  const [boards, setBoards] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [delBoard, setDelBoard] = useState(null);

  useEffect(() => {
    props.setIsLoading(true);
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    fetch(constant.api + constant.allBoardPath + constant.myBoardPath, requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          result.forEach((board, index) => {
            board.createdDate = new Date(board.createdDate);
          })
          setBoards(result);
          props.setIsLoading(false);
        },
        (error) => {
          props.setIsLoading(false);
        }
    )
  }, [])

  const addBoard = (board) => {
    board.createdDate = new Date(board.createdDate);
    const newBoards = boards.slice();
    newBoards.push(board);
    setBoards(newBoards);
  }

  const handleDeleteBoard = (boardID) => {
    const user = AuthService.getCurrentUser();
    if (!boardID || !user){
        return;
    }
    props.setIsLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: Object.assign({
            'Content-Type': 'application/json'   
        }, authHeader()),
        body: JSON.stringify({ 
            boardID: boardID
        })
    };
    return fetch(constant.api + constant.allBoardPath + constant.deleteBoard, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.isSuccess){
                const newBoards2 = boards.filter((board, idx) => board.boardID !== boardID);
                setBoards(newBoards2);
            }
            props.setIsLoading(false);
    }, (error) => {
        if (error) {
          props.setIsLoading(false);
        }
      })
  }

  const openDeleteDialog = (board) => {
    setDelBoard(board);
    setOpenDel(true);
  }

  const toBoard = (boardID) => {
    history.push(constant.boardPath + '/' + boardID);
  }

  return (
    <main>
      <Container className={classes.cardGrid} maxWidth="md">
        <AddBoardDialog open={openAdd} setOpen={setOpenAdd} addBoard={addBoard} setIsLoading={props.setIsLoading}/>
        <ConfirmDialog open={openDel} setOpen={setOpenDel} action={() => handleDeleteBoard(delBoard.boardID)}>Confirm to delete board <b>{(delBoard)? delBoard.name : ''}</b></ConfirmDialog>
        <Typography gutterBottom variant="h4" component="h2" className="title-blue" style={{fontWeight: '500'}}>
          My Boards
        </Typography>            
        <Grid container spacing={4}>
          <Grid item xs={8} sm={4} md={3} onClick={() => setOpenAdd(true)}>
              <Card className={classes.addCard}>
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h6" component="h2">
                    <AddCircleIcon className={classes.addIcon}/>
                  </Typography>
                  <Typography gutterBottom variant="h6" component="h2" className="title-blue">
                    Add
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          {boards.map((board) => (
            <Grid item key={board.boardID} xs={8} sm={4} md={3}>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent} onClick={() => toBoard(board.boardID)}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {board.name}
                  </Typography>
                  <div className={classes.info}>
                    <div className="info-time">
                        <span><ScheduleIcon className={classes.actionIcons}/>
                        </span>
                        {board.createdDate.getDate()}  &nbsp;
                          {monthStrs[board.createdDate.getMonth()]}
                    </div>
                    <div className="info-numOfCard">
                      <span>{board.numOfCard} Cards</span> 
                    </div>
                  </div>
                </CardContent>
                <CardActions className={classes.action}>
                  <Button size="small" color="primary" className={classes.actionBtn}>
                    <LinkIcon className={classes.actionIcons}/>
                    URL
                  </Button>
                  <Button size="small" color="primary" className={classes.actionBtn} onClick={(evt) => openDeleteDialog(board)}>
                    <DeleteIcon className={classes.actionIcons}/>
                    DELETE
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
}

export default DashBoard;
