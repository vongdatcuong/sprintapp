//const api = 'https://shrouded-bastion-84248.herokuapp.com';
const api = 'http://localhost:8080';

// Board
const boardPath = '/board';
const allBoardPath = '/boards';
const myBoardPath = '/myBoard';
const addBoard = '/addBoard';

// User
const userPath = '/user';
const logInPath = '/logIn';
const signUpPath = '/signUp';

function queryParams(params) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

export default {
    api,
    // Board
    boardPath,
    allBoardPath,
    myBoardPath,
    addBoard,
    // User
    userPath,
    logInPath,
    signUpPath,
    // 
    queryParams
}