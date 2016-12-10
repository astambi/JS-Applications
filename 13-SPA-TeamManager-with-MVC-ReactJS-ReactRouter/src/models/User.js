import * as KinveyRequester from './KinveyRequester';

function saveAuthInSession(userInfo) {
    sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
    sessionStorage.setItem('userId', userInfo._id);
    sessionStorage.setItem('username', userInfo.username);
}

function login(username, password, callback) {
    let userData = {
        username: username,
        password: password
    };
    return KinveyRequester
        .post('user', 'login', 'basic', userData)
        .then(loginSuccess)
        .catch(callback(false));

    function loginSuccess(userInfo) {
        saveAuthInSession(userInfo);
        callback(true);
    }
}

function register(username, password, callback) {
    let userData = {
        username: username,
        password: password
    };
    return KinveyRequester
        .post('user', '', 'basic', userData)
        .then(registerSuccess);   // .catch();

    function registerSuccess(userInfo) {
        saveAuthInSession(userInfo);
        callback(true);
    }
}

function logout(callback) {
    return KinveyRequester
        .post('user', '_logout', 'kinvey', null)
        .then(logoutSuccess)
        .catch(callback(false));

    function logoutSuccess() {
        sessionStorage.clear();
        callback(true);
    }
}

export {register, login, logout}
