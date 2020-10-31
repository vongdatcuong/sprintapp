import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import './DashBoard.css';
import API from '../../Utils';
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
import FileCopyIcon from '@material-ui/icons/FileCopy';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ScheduleIcon from '@material-ui/icons/Schedule';

// Components
// Service
import authHeader from '../../services/auth-header.js';
import AuthService from '../../services/auth.service';

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
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12)'
    }
  },
  cardContent: {
    flexGrow: 1,
    margon: '3px'
  },
  action: {
    justifyContent: 'center',
  },
  actionBtn: {
    width: '100%'
  },
  actionIcons: {
    fontSize: '15px',
    marginRight: '5px'
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

const monthStrs = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', "Aug", 'Sep', 'Oct', 'Nov', 'Dec'];

function DashBoard() {
  const history = useHistory();
  if (!AuthService.getCurrentUser()){
      history.push('/logIn');
  }

  const classes = useStyles();
  const [boards, setBoards] = useState([]);
  useEffect(() => {
    console.log(authHeader());
    fetch(API.api + API.allBoardPath, {
      headers: authHeader()
    })
      .then(res => res.json())
      .then(
        (result) => {
          result.forEach((board, index) => {
            board.createdDate = new Date(board.createdDate);
          })
          setBoards(result);
        },
        (error) => {
          
        }
    )
  })

  return (
    <main>
      <Container className={classes.cardGrid} maxWidth="md">
        <Typography gutterBottom variant="h4" component="h2" className="title-blue" style={{fontWeight: '500'}}>
          My Boards
        </Typography>            
        <Grid container spacing={4}>
          <Grid item xs={8} sm={4} md={3}>
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
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {board.name}
                  </Typography>
                  <div className={classes.info}>
                    <div className="info-time">
                        <span><ScheduleIcon className={classes.actionIcons}/>
                          {board.createdDate.getDate()}  &nbsp;
                          {monthStrs[board.createdDate.getMonth()]}
                        </span>
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
                  <Button size="small" color="primary" className={classes.actionBtn}>
                    <FileCopyIcon className={classes.actionIcons}/>
                    CLONE
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
