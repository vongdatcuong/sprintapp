import React, {useState, useEffect} from 'react';
import { useHistory, useParams } from "react-router-dom";
import './Board.css';
// Material UI Core
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, rgbToHex } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';

// Material Icons
import AddIcon from '@material-ui/icons/Add';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import SaveIcon from '@material-ui/icons/Save';

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
    },
    saveIcon: {
        backgroundColor: '#4BB543',
        marginLeft: '15px',
        fontSize: '0.35em'
    },
    formMessageSuccess: {
        color: '#4BB543'
    },
    formMessageFail: {
        color: '#ff1500'
    },
}));


function Board(props) {
  const history = useHistory();
  if (!AuthService.getCurrentUser()){
      history.push('/logIn');
  } 
  const { id } = useParams(); 
  const classes = useStyles();
  const [board, setBoard] = useState({columns: []});
  const [newBoardName, setNewBoardName] = useState(board.name);
  const [isSuccess, setIsSuccess] = useState(true);
  const [errorMsg, setErrMsg] = useState('');
  const [isEditingBName, setIsEditingBName] = useState(false);
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
                setNewBoardName(result.board.name);
            }
            props.setIsLoading(false);
        },
        (error) => {
            props.setIsLoading(false);
        }
    )
  }, [])

  const handleNewBoardNameChange = (evt) => {
    setNewBoardName(evt.target.value);
  }

  const handleUpdateBoardName = () => {
    const user = AuthService.getCurrentUser();
    if (!newBoardName || !user || !board){
        return;
    }
    props.setIsLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: Object.assign({
            'Content-Type': 'application/json'   
        }, authHeader()),
        body: JSON.stringify({ 
            boardID: board.boardID,
            name: newBoardName
        })
    };
    return fetch(constant.api + constant.allBoardPath + constant.updateBoardName, requestOptions)
        .then(response => response.json())
        .then(result => {
            setIsSuccess(result.isSuccess);
            setErrMsg(result.message);
            if (result.isSuccess){
                setErrMsg("");
                toggleEnableEditing();
                // Update board
                const newBoard = Object.assign({}, board);
                newBoard.name = newBoardName;
                setBoard(newBoard);
            }
            props.setIsLoading(false);
    }, (error) => {
        if (error) {
          props.setIsLoading(false);
        }
      })
  }

  const toggleEnableEditing = (evt) => {
      setIsEditingBName(!isEditingBName);
  }

  const bgcolor = ["primary.main", "secondary.main", "error.main"];
  const color = ["primary.contrastText", "secondary.contrastText", "error.contrastText"];
  const boardNameUI = [];
  if (isEditingBName){
      boardNameUI.push(<React.Fragment>
          <TextField
                name="name"
                required
                id="name"
                autoFocus
                value={newBoardName}
                error={newBoardName === ""}
                onChange={(evt) => handleNewBoardNameChange(evt)}
              />
            <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.saveIcon}
                startIcon={<SaveIcon />}
                onClick={(evt) => handleUpdateBoardName(evt)}
                >
                Save
            </Button>
          <FormHelperText className={(isSuccess)? classes.formMessageSuccess : classes.formMessageFail} error={!isSuccess}>
              {errorMsg}
          </FormHelperText>
      </React.Fragment>);
    }   else {
        boardNameUI.push(board.name);
        boardNameUI.push(<BorderColorIcon className={classes.updateIcon} onClick={toggleEnableEditing}/>)
    }
  return (
    <main>
      <Container className={classes.cardGrid} maxWidth="md">
        <Typography gutterBottom variant="h4" component="h2" className="title-blue" style={{fontWeight: '500'}}>
            {boardNameUI}
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
