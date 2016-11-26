function secretKnock() {
    const appKey = 'kid_BJXTsSi-e';
    const username = 'guest';
    const password = 'guest';
    const base64login = btoa(username + ':' + password);
    const serviceUrl = 'https://baas.kinvey.com';
    const dataUrl = `${serviceUrl}/appdata/${appKey}/knock`;
    const loginUrl = `${serviceUrl}/user/${appKey}/login`;

    let authtoken;
    let message = 'Knock Knock.';

    let loginRequest = {
        method: 'POST',
        url: loginUrl,
        headers: {
            Authorization: 'Basic ' + base64login
        },
        data: {
            username: username,
            password: password
        }
    };
    $.ajax(loginRequest)
        .then(showAuthToken)
        .catch(displayError);

    function showAuthToken(data) {
        authtoken = data._kmd.authtoken;
        processQueries();
    }

    function processQueries() {
        if (message) {
            let request = {
                method: 'GET',
                url: `${dataUrl}?query=${message}`,
                headers: {
                    Authorization: 'Kinvey ' + authtoken
                }
            };
            $.ajax(request)
                .then(displayMessage)
                .catch(displayError)
        }
    }

    function displayMessage(data) {
        message = data.message;
        console.log(data.answer);
        if (message)
            console.log(message);
        processQueries();
    }

    function displayError() {
        console.log('Error')
    }
}