import React, {useEffect} from 'react';
import { useParams, useHistory } from "react-router-dom";

// Service
import AuthService from '../../services/auth.service';


function Redirecting(props) {
    const { authType, ID } = useParams(); 
    const history = useHistory();
  useEffect(() => {
    if (authType == 'google'){
      AuthService.logInWithGoogle(ID).then(result => {
        if (result.isSuccess){
            history.push('/dashboard/');
        } else {
            history.push('/logIn');
        }
      }, (error) => {
        if (error) {
            history.push('/logIn');
        }
      });;
    } else if (authType == 'facebook'){
      AuthService.logInWithFacebook(ID).then(result => {
        if (result.isSuccess){
            history.push('/dashboard/');
        } else {
            history.push('/logIn');
        }
      }, (error) => {
        if (error) {
            history.push('/logIn');
        }
      });;
    }
})

  return (
    <main>
      Redirecting...
    </main>
  );
}

export default Redirecting;
