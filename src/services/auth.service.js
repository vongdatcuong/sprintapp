import constant from '../Utils';

class AuthService {
    logIn(username, password) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: username,
                password: password
            })
        };
        return fetch(constant.api + constant.userPath + constant.logInPath, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.isSuccess){
                    localStorage.setItem("user", JSON.stringify(result.user));
                    return {
                        isSuccess: true,
                        user: result.user
                    };
                } else {
                    return {
                        isSuccess: false,
                        message: result.message
                    }
                }
                
            })
    }

    logOut(){
        localStorage.removeItem("user");
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));;
    }
  }
  
  export default new AuthService();