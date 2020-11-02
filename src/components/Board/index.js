import React, {useState, useEffect} from 'react';
import { useHistory, useParams } from "react-router-dom";
import './Board.css';
// Material UI Core
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, rgbToHex } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

// Material Icons
import AddIcon from '@material-ui/icons/Add';
import BorderColorIcon from '@material-ui/icons/BorderColor';

// Components


// Service
import authHeader from '../../services/auth-header.js';
import AuthService from '../../services/auth.service';
import constant from '../../Utils';

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    addBox: {
        backgroundColor: '#dddddd',
        cursor: 'pointer'
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
        maxWidth: '1500px',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
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
    updateIcon: {
        marginLeft: '10px',
        verticalAlign: 'middle',
        cursor: 'pointer'
    }
}));


function Board(props) {
  const history = useHistory();
  if (!AuthService.getCurrentUser()){
      history.push('/logIn');
  }
  const { id } = useParams();
  const classes = useStyles();
  const [board, setBoard] = useState({columns: []});
  //setBoard({d: 'sda'})
  useEffect(() => {
    props.setIsLoading(true);
    const requestOptions = {
      method: 'GET',
      headers: authHeader(),
    };
    fetch(constant.api + constant.allBoardPath + constant.boardPath + "?" + constant.queryParams({
        boardID: id
    }), requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
            console.log(result);
            if (result.isSuccess){
                setBoard(result.board);
                console.log(board);
            }
            props.setIsLoading(false);
        },
        (error) => {
            props.setIsLoading(false);
        }
    )
  }, [])

  const bgcolor = ["primary.main", "secondary.main", "error.main"];
  const color = ["primary.contrastText", "secondary.contrastText", "error.contrastText"];
  return (
    <main>
      <Container className={classes.cardGrid} maxWidth="md">
        <Typography gutterBottom variant="h4" component="h2" className="title-blue" style={{fontWeight: '500'}}>
          {board.name} 
          <BorderColorIcon className={classes.updateIcon} />
        </Typography>            
        <Grid container spacing={4}>
        {board.columns.map((col, index) => {
                return (
                    <Grid item xs={12} sm={4} md={4}>
                        <Box bgcolor={bgcolor[index % board.numOfCol]} color={color[index % board.numOfCol]} p={0} align="center">
                            <Typography variant="h6">{col.columnName}</Typography>
                        </Box>
                        <Box p={0} align="center" className={classes.addBox}>
                            <AddIcon/>
                        </Box>
                        {col.cards.map((card, index2) => {
                            return (
                                <Box p={3} align="left" bgcolor={bgcolor[index % board.numOfCol]} color={color[index % board.numOfCol]} 
                                    border={3}
                                    borderColor="#888888"
                                    marginTop={2}>
                                    <Typography>{card.content}</Typography>
                                </Box>
                            )
                        })}
                    </Grid>
                )
            })}
        </Grid>
      </Container>
    </main>
  );
}

export default Board;
