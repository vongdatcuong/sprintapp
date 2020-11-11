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
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CreateIcon from '@material-ui/icons/Create';

// Components
import ConfirmDialog from '../../dialogs/ConfirmDialog';

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
        position: 'relative'
    },
    deleteCardIcon: {
        position: 'absolute',
        top: '5%',
        right: '5px',
        cursor: 'pointer'
    },
    updateCardIcon: {
        position: 'absolute',
        top: '5%',
        right: '30px',
        cursor: 'pointer'
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
    addCard: {
        padding: '10px'
    },
    addCardTextField: {
        minHeight: '50px'
    },
    saveCardIcon: {
        backgroundColor: '#4BB543',
        fontSize: '0.8em'
    },
    cardContent: {
        wordWrap: 'break-word'
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
  // Board
  const [newBoardName, setNewBoardName] = useState(board.name);
  const [isSuccess, setIsSuccess] = useState(true);
  const [errorMsg, setErrMsg] = useState('');
  const [isEditingBName, setIsEditingBName] = useState(false);

  // Card
  const [openDel, setOpenDel] = useState(false);
  const [delCard, setDelCard] = useState(null);

  // Add Card
  const [colAddCards, setColAddCards] = useState({});

  // Update Cảd
  const [colUpdateCards, setColUpdateCards] = useState({});

  const [dragging, setDragging] = useState(-1);

  const [bgcolor, setBgcolor] = useState(["primary.main", "secondary.main", "error.main"]);
  const [color, setColor] = useState(["primary.contrastText", "secondary.contrastText", "error.contrastText"]);

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
            if (result.isSuccess){
                setBoard(result.board);
                setNewBoardName(result.board.name);
                // Add & Update Card
                const colObjs = {};
                const colObjs2 = {};
                result.board.columns.forEach((col, index) => {
                    colObjs[col.columnID] = [];
                    colObjs2[col.columnID] = {};
                })
                setColAddCards(colObjs);
                setColUpdateCards(colObjs2);
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

  const handleDeleteCard = (deleteCard) => {
    const user = AuthService.getCurrentUser();
    if (!deleteCard || !user){
        return;
    }
    props.setIsLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: Object.assign({
            'Content-Type': 'application/json'   
        }, authHeader()),
        body: JSON.stringify({ 
            cardID: deleteCard.cardID
        })
    };
    return fetch(constant.api + constant.cardPath + constant.deleteCard, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.isSuccess){
                const newBoard = Object.assign({}, board);
                newBoard.columns = newBoard.columns.map((col, index) => {
                    if (col.columnID === deleteCard.columnID){
                        col.numOfCard--;
                        col.cards = col.cards.filter((card, index2) => card.cardID != deleteCard.cardID);
                    }
                    return col;
                })
                setBoard(newBoard);
            }
            props.setIsLoading(false);
    }, (error) => {
        if (error) {
          props.setIsLoading(false);
        }
      })
  }

  const openDeleteDialog = (card) => {
    setDelCard(card);
    setOpenDel(true);
  }

  const handleColAddCard = (colID) => {
    const colObjs = Object.assign({}, colAddCards);
    colObjs[colID].push("");
    setColAddCards(colObjs);
  }

  const handleAddNewCard = (colID, index) => {
      const content = colAddCards[colID][index];
      if (content){
        const user = AuthService.getCurrentUser();
        if (!user){
            return;
        }
        props.setIsLoading(true);
        const requestOptions = {
            method: 'POST',
            headers: Object.assign({
                'Content-Type': 'application/json'   
            }, authHeader()),
            body: JSON.stringify({ 
                columnID: colID,
                content: content
            })
        };
        return fetch(constant.api + constant.cardPath + constant.addBoard, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.isSuccess){
                    // Update cards in board
                    const newBoard = Object.assign(board);
                    newBoard.columns.forEach((col) => {
                        if (col.columnID == colID){
                            col.cards.push(result.card);
                        }
                    })
                    setBoard(newBoard);
                    const colObjs = Object.assign({}, colAddCards);
                    colObjs[colID].splice(index, 1);
                    setColAddCards(colObjs);
                }
                props.setIsLoading(false);
        }, (error) => {
            if (error) {
              props.setIsLoading(false);
            }
        })
      } else {
        const colObjs = Object.assign({}, colAddCards);
        colObjs[colID].splice(index, 1);
        setColAddCards(colObjs);
      }
  }

  const handleAddNewCardChange = (evt, colID, index) => {
        const colObjs = Object.assign({}, colAddCards);
        colObjs[colID][index] = evt.target.value;
        setColAddCards(colObjs);
  }

  // Update Card
  const handleColUpdateCard = (colID, cardID, oldContent) => {
    const colObjs = Object.assign({}, colUpdateCards);
    colObjs[colID][cardID] = oldContent;
    setColUpdateCards(colObjs);
  }

  const handleUpdateCardChange = (evt, colID, cardID) => {
    const colObjs = Object.assign({}, colUpdateCards);
    colObjs[colID][cardID] = evt.target.value;
    setColUpdateCards(colObjs);
    }

  const handleUpdateCard = (colID, cardID) => {
    const content = colUpdateCards[colID][cardID];
    if (content){
        const user = AuthService.getCurrentUser();
        if (!user){
            return;
        }
        props.setIsLoading(true);
        const requestOptions = {
            method: 'POST',
            headers: Object.assign({
                'Content-Type': 'application/json'   
            }, authHeader()),
            body: JSON.stringify({ 
                cardID: cardID,
                content: content
            })
        };
        return fetch(constant.api + constant.cardPath + constant.updateCard, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.isSuccess){
                    // Update cards in board
                    const newBoard = Object.assign(board);
                    newBoard.columns.forEach((col) => {
                        if (col.columnID == colID){
                            col.cards.forEach((card) => {
                                if (card.cardID == cardID){
                                    card.content = content;
                                    return;
                                }
                            })
                            return;
                        }
                    })
                    setBoard(newBoard);
                    const colObjs = Object.assign({}, colUpdateCards);
                    colObjs[colID][cardID] = ""
                    setColUpdateCards(colObjs);
                }
                props.setIsLoading(false);
        }, (error) => {
            if (error) {
              props.setIsLoading(false);
            }
        })
    } else {
      const colObjs = Object.assign({}, colUpdateCards);
      colObjs[colID][cardID] = "";
      setColUpdateCards(colObjs);
    }

 }


    const handleDragging = (evt, index) => {
       setDragging(index);
    }
    const handleDragOver = (evt) => {
        evt.preventDefault();
     }
    const handleDropped = (evt, index) => {
        if (dragging == -1 || index == -1){
            return;
        }
        const newBoard = Object.assign(board);
        swapTwoElements(newBoard.columns, dragging, index);
        //const colAddObjs = Object.assign({}, colAddCards);
        //swapTwoElements(colAddObjs, dragging, dropped);
        //const colUpdateObjs = Object.assign({}, colUpdateCards);
        //swapTwoElements(colUpdateObjs, dragging, dropped);
        const newBgcolor = bgcolor.slice();
        swapTwoElements(newBgcolor, dragging, index);
        const newColor = color.slice();
        swapTwoElements(newColor, dragging, index);
        setDragging(-1);        
        setBoard(newBoard);
        //setColAddCards(colAddObjs);
        //setColAddCards(colUpdateObjs);
        setBgcolor(newBgcolor);
        setColor(newColor);
     }

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
      <ConfirmDialog open={openDel} setOpen={setOpenDel} action={() => handleDeleteCard(delCard)}><h3 style={{'text-align': 'center'}}>Confirm to delete card</h3> <b>{(delCard)? delCard.content : ''}</b></ConfirmDialog>
        <Typography gutterBottom variant="h4" component="h2" className="title-blue" style={{fontWeight: '500'}}>
            {boardNameUI}
        </Typography>            
        <Grid container spacing={4}>
        {board.columns.map((col, index) => {
                return (
                    <Grid item xs={12} sm={4} md={4} draggable="true" 
                        onDragStart={(evt) => handleDragging(evt, index)}
                        onDragOver={(evt) => handleDragOver(evt)} 
                        onDrop={(evt) => handleDropped(evt, index)}
                    >
                        <Box bgcolor={bgcolor[index % board.numOfCol]} color={color[index % board.numOfCol]} p={0} align="center">
                            <Typography variant="h6">{col.columnName}</Typography>
                        </Box>
                        <Box p={0} align="center" className={classes.addBox} onClick={() => handleColAddCard(col.columnID)}>
                            <AddIcon/>
                        </Box>
                        {
                            (colAddCards[col.columnID])?
                            colAddCards[col.columnID].map((newCard, index2) => {
                                return (
                                    <Box p={3} align="left" className={classes.addBox}
                                        border={5}
                                        borderColor={bgcolor[index % board.numOfCol]}
                                        marginTop={2}
                                        className={classes.addCard}>
                                        <TextField
                                            multiline="true"
                                            rowsMax="10"
                                            name="content"
                                            required
                                            fullWidth
                                            id="content"
                                            autoFocus
                                            InputProps={{ disableUnderline: true }}
                                            className={classes.addCardTextField}
                                            value={colAddCards[col.columnID][index2]}
                                            onChange={(evt) => handleAddNewCardChange(evt, col.columnID, index2)}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            className={classes.saveCardIcon}
                                            onClick={(evt) => handleAddNewCard(col.columnID, index2)}
                                            >
                                                ADD
                                        </Button>
                                    </Box>
                                )
                            })
                            :
                            ''
                        }
                        {col.cards.map((card, index2) => {
                            return (colUpdateCards[col.columnID] &&colUpdateCards[col.columnID][card.cardID])? 
                            (
                                <Box p={3} align="left" className={classes.addBox}
                                    border={5}
                                    borderColor={bgcolor[index % board.numOfCol]}
                                    marginTop={2}
                                    className={classes.addCard}>
                                    <TextField
                                        multiline="true"
                                        rowsMax="10"
                                        name="content"
                                        required
                                        fullWidth
                                        id="content"
                                        
                                        InputProps={{ disableUnderline: true }}
                                        className={classes.addCardTextField}
                                        value={colUpdateCards[col.columnID][card.cardID]}
                                        onChange={(evt) => handleUpdateCardChange(evt, col.columnID, card.cardID)}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        className={classes.saveCardIcon}
                                        onClick={(evt) => handleUpdateCard(col.columnID, card.cardID)}
                                        >
                                            DONE
                                    </Button>
                                </Box>
                            ) :
                            (
                                <Box p={3} align="left" bgcolor={bgcolor[index % board.numOfCol]} color={color[index % board.numOfCol]} 
                                    border={3}
                                    borderColor="#888888"
                                    marginTop={2}
                                    className={classes.card}
                                    >
                                    <Typography variant="body1" className={classes.cardContent}>{card.content}</Typography>
                                    <CreateIcon className={classes.updateCardIcon} onClick={(evt) => handleColUpdateCard(col.columnID, card.cardID, card.content)}/>
                                    <DeleteOutlineIcon className={classes.deleteCardIcon} onClick={(evt) => openDeleteDialog(card)}/>
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

function swapTwoElements(arr, idx1, idx2){
    const temp = arr[idx2];
    arr[idx2] = arr[idx1];
    arr[idx1] = temp;
}
export default Board;
