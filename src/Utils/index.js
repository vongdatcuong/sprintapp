const api = 'https://shrouded-bastion-84248.herokuapp.com';
//const api = 'http://localhost:8080';

// Board
const boardPath = '/board';
const allBoardPath = '/boards';
const myBoardPath = '/myBoard';
const addBoard = '/add';
const deleteBoard = '/delete'
const updateBoardName = '/updateName'

// Card
const cardPath = '/cards';
const deleteCard = '/delete';
const addCard = '/add';
const updateCard = '/update';

// User
const userPath = '/user';
const logInPath = '/logIn';
const signUpPath = '/signUp';
const updateProfilePath = '/updateProfile';
const authGooglePath = '/auth/google'
const logInWithGoogle = '/logInWithGoogle';
const authFbPath = '/auth/facebook'
const logInWithFacebook = '/logInWithFacebook';

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
    deleteBoard,
    updateBoardName,
    //Card
    cardPath,
    deleteCard,
    addCard,
    updateCard,
    // User
    userPath,
    logInPath,
    signUpPath,
    updateProfilePath,
    authGooglePath,
    logInWithGoogle,
    authFbPath,
    logInWithFacebook,
    // 
    queryParams
}