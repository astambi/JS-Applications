function startApp() {
    const kinveyAppKey = "kid_HygQ7pucXg";
    const kinveyAppSecret = "4cc5887670274342a0d876c1a13c06af";
    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyUserUrl = kinveyBaseUrl + 'user/' + kinveyAppKey;
    const kinveyDataUrl = kinveyBaseUrl + 'appdata/' + kinveyAppKey + '/messages';
    const kinveyAppAuthHeaders = {
        Authorization: "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret)
    };

    // Clear SessionStorage
    sessionStorage.clear();

    // Hide Info/ Error/ Loading boxes
    $('#loadingBox').hide();
    $('#infoBox').hide();
    $('#errorBox').hide();

    // show NavBar links & Views for anonymous users
    updateMenuLinks();
    showAppHomeView();

    // Bind navigation links & Views
    // anonymous users
    $('#linkMenuAppHome').click(showAppHomeView);
    $('#linkMenuLogin').click(showLoginView);
    $('#linkMenuRegister').click(showRegisterView);

    // logged-in users
    $('#linkMenuUserHome').click(showUserHomeView);
    $('#linkMenuMyMessages').click(listMyMessages); // func
    $('#linkUserHomeMyMessages').click(listMyMessages); // func

    $('#linkMenuArchiveSent').click(listArchiveSent); // func
    $('#linkUserHomeArchiveSent').click(listArchiveSent); // func

    $('#linkMenuSendMessage').click(loadSendMessageForm); // func
    $('#linkUserHomeSendMessage').click(loadSendMessageForm); // func

    $('#linkMenuLogout').click(logoutUser); // func

    // Bind form submit buttons => func NB. event.preventDefault !
    $('#formLogin').find('input[type=submit]').click(loginUser);
    $('#formRegister').find('input[type=submit]').click(registerUser);
    $('#formSendMessage').find('input[type=submit]').click(sendMessage);

    // Bind Info & Error Boxes & hide on click
    $('#infoBox, #errorBox').click(function () {
        $(this).fadeOut();
    });

    // Attach AJAX Loading event listener
    $(document).on({
        ajaxStart: function () {
            $('#loadingBox').show();
        },
        ajaxStop: function () {
            $('#loadingBox').hide();
        }
    });

    function updateMenuLinks() {
        //Hide all links in NavBar
        $('#menu').find('a').hide();

        // Show selective links to logged-in users
        // sessionStorage.setItem('authToken', '123'); // test for logged-in users
        if (sessionStorage.getItem('authToken')) {
            $('#linkMenuUserHome').show();
            $('#linkMenuMyMessages').show();
            $('#linkMenuArchiveSent').show();
            $('#linkMenuSendMessage').show();
            $('#linkMenuLogout').show();
            $('#spanMenuLoggedInUser').show();
        } else {
            $('#linkMenuAppHome').show();
            $('#linkMenuLogin').show();
            $('#linkMenuRegister').show();
            $('#spanMenuLoggedInUser').hide();
        }
    }

    // Error & Info handling
    function showInfo(message) {
        $('#infoBox').text(message).show();
        setTimeout(function () {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    function showError(message) {
        $('#errorBox').text('Error: ' + message).show();
    }

    function handleAjaxError(error) {
        // console.dir(error);
        let errorMsg = JSON.stringify(error);
        if (error.readyState === 0)
            errorMsg = 'Cannot connect due to network error.';
        if (error.responseJSON && error.responseJSON.description)
            errorMsg = error.responseJSON.description;
        showError(errorMsg);
    }

    // Authentication & session
    function saveAuthInSession(userInfo) {
        // console.dir(userInfo);
        // Save credentials in SessionStorage
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('username', userInfo.username);
        sessionStorage.setItem('userId', userInfo._id); // used for deleting messages
        sessionStorage.setItem('name', userInfo.name); // used for sending messages

        // show Welcome message
        $('#spanMenuLoggedInUser').text('Welcome, ' + userInfo.username + '!').show();
    }

    function clearSession() {
        sessionStorage.clear();

        // clear Welcome message
        $('#spanMenuLoggedInUser').text('').hide();
    }

    function getKinveyUserAuthHeaders() {
        return {
            Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')
        }
    }

    // Views
    function showView(view) {
        $('main').find('section').hide();
        $('#' + view).show();
    }

    function showAppHomeView() {
        showView('viewAppHome');
    }

    function showUserHomeView() {
        showView('viewUserHome');
        $('#viewUserHomeHeading').text('Welcome, ' + sessionStorage.getItem('username') + '!').show();
    }

    function showRegisterView() {
        $('#formRegister').trigger('reset');
        showView('viewRegister');
    }

    function showLoginView() {
        $('#formLogin').trigger('reset');
        showView('viewLogin');
    }

    function showMyMessagesView() {
        showView('viewMyMessages');
    }

    function showArchiveSentView() {
        showView('viewArchiveSent');
    }

    function showSendMessageView() {
        $('#formSendMessage').trigger('reset');
        showView('viewSendMessage');
    }

    // Users
    function registerUser() {
        event.preventDefault();

        // Read Form Data
        let username = $('#registerUsername').val().trim();
        let password = $('#registerPasswd').val().trim();
        let name = $('#registerName').val().trim();

        // Input validation & REST
        if (username && password) { // required username & password
            let userData = {
                username: username,
                password: password,
                name: name
            };
            $.ajax({
                method: 'POST',
                url: kinveyUserUrl,
                headers: kinveyAppAuthHeaders,
                contentType: 'application/json',
                data: JSON.stringify(userData)
            })
                .then(registerSuccess)
                .catch(handleAjaxError);
        } else
            showInfo('Please provide username & password.');

        function registerSuccess(userInfo) {
            showInfo('User registration successful.');
            saveAuthInSession(userInfo);
            updateMenuLinks();
            showUserHomeView();
        }
    }

    function loginUser() {
        event.preventDefault();

        // Read Form Data
        let username = $('#loginUsername').val().trim();
        let password = $('#loginPasswd').val().trim();

        // Input validation & REST
        if (username && password) { // required
            let userData = {
                username: username,
                password: password
            };
            $.ajax({
                method: 'POST',
                url: kinveyUserUrl + '/login',
                headers: kinveyAppAuthHeaders,
                contentType: 'application/json',
                data: JSON.stringify(userData)
            })
                .then(loginSuccess)
                .catch(handleAjaxError);
        } else
            showInfo('Please provide username & password.');

        function loginSuccess(userInfo) {
            showInfo('Login successful.');
            saveAuthInSession(userInfo);
            updateMenuLinks();
            showUserHomeView();
        }
    }

    function logoutUser() {
        $.ajax({
            method: 'POST',
            url: kinveyUserUrl + '/_logout',
            headers: getKinveyUserAuthHeaders(),
            contentType: 'application/json'
        })
            .then(logoutSuccess)
            .catch(handleAjaxError);

        function logoutSuccess() {
            showInfo('Logout successful.');
            clearSession();
            updateMenuLinks();
            showAppHomeView();
        }
    }

    // Messages
    function listMyMessages() {
        $('#myMessages').empty();
        showMyMessagesView();

        $.ajax({
            method: 'GET',
            url: kinveyDataUrl + `?query={"recipient_username":"${sessionStorage.getItem('username')}"}`,
            headers: getKinveyUserAuthHeaders(),
            contentType: 'application/json'
        })
            .then(loadMyMsgsSuccess)
            .catch(handleAjaxError);

        function loadMyMsgsSuccess(messages) {
            // showInfo('Messages loaded.');
            displayMyMsgs(messages);
        }

        function displayMyMsgs(messages) {
            let myMsgContainer = $('#myMessages');

            // Create Table & THead
            let msgTable = $('<table>').append(
                $('<thead>').append(
                    $('<tr>').append(
                        $('<th>').text('From'),
                        $('<th>').text('Message'),
                        $('<th>').text('Date Received')
                    )));

            // Create Table TBody
            let msgTBody = $('<tbody>');
            for (let msg of messages)
                appendMsgRowToTBody(msg, msgTBody);

            msgTable
                .append(msgTBody)
                .appendTo(myMsgContainer);
        }

        function appendMsgRowToTBody(msg, msgTBody) {
            $('<tr>').append(
                $('<td>').text(formatSender(msg.sender_name, msg.sender_username)),
                $('<td>').text(msg.text),
                $('<td>').text(formatDate(msg._kmd.ect))
            ).appendTo(msgTBody);
        }
    }

    function listArchiveSent() {
        $('#sentMessages').empty();
        showArchiveSentView();

        $.ajax({
            method: 'GET',
            url: kinveyDataUrl + `?query={"sender_username":"${sessionStorage.getItem('username')}"}`,
            headers: getKinveyUserAuthHeaders(),
            contentType: 'application/json'
        })
            .then(loadArchiveSentSuccess)
            .catch(handleAjaxError);

        function loadArchiveSentSuccess(messages) {
            // showInfo('Messages loaded.');
            displayArchiveSent(messages);
        }

        function displayArchiveSent(messages) {
            let sentMessagesContainer = $('#sentMessages');

            // Create Table & THead
            let msgTable = $('<table>').append(
                $('<thead>').append(
                    $('<tr>').append(
                        $('<th>').text('To'),
                        $('<th>').text('Message'),
                        $('<th>').text('Date Sent'),
                        $('<th>').text('Actions')
                    )));

            // Create Table TBody
            let msgTBody = $('<tbody>');
            for (let msg of messages)
                appendMsgRowToTBody(msg, msgTBody);

            msgTable
                .append(msgTBody)
                .appendTo(sentMessagesContainer);
        }

        function appendMsgRowToTBody(msg, msgTBody) {
            let actionLinks = [];

            // Create action links for msg owners
            if (msg._acl.creator == sessionStorage.getItem('userId')) {
                let deleteButton = $('<button>').text('Delete')
                    .click(function () {
                        deleteMsg(msg);
                    });
                actionLinks = [deleteButton];
            }

            $('<tr>').append(
                $('<td>').text(msg.recipient_username),
                $('<td>').text(msg.text),
                $('<td>').text(formatDate(msg._kmd.ect)),
                $('<td>').append(actionLinks)
            ).appendTo(msgTBody);
        }
    }

    function deleteMsg(msg) {
        $.ajax({
            method: 'DELETE',
            url: kinveyDataUrl + '/' + msg._id,
            headers: getKinveyUserAuthHeaders(),
            contentType: 'application/json'
        })
            .then(deleteMsgSuccess)
            .catch(handleAjaxError);

        function deleteMsgSuccess() {
            showInfo('Message deleted.');
            listArchiveSent();
        }
    }

    function loadSendMessageForm() {
        // Load users from Kinvey
        $.ajax({
            method: 'GET',
            url: kinveyUserUrl,
            headers: getKinveyUserAuthHeaders(),
            contentType: 'application/json'
        })
            .then(loadUsersSuccess)
            .catch(handleAjaxError);

        function loadUsersSuccess(users) {
            let recipientsContainer = $('#msgRecipientUsername');
            recipientsContainer.empty();

            for (let user of users) {
                let recipient = user.username;
                if (user.name)
                    recipient += ` (${user.name})`;

                $('<option>').text(recipient)
                    .attr('value', user.username)
                    .appendTo(recipientsContainer);
            }
            showSendMessageView();
        }
    }

    function sendMessage() {
        event.preventDefault();

        // Read Form Data
        let msgText = $('#msgText').val().trim();
        let recipientUsername = $('#msgRecipientUsername').val();
        let senderUsername = sessionStorage.getItem('username');
        let senderName = sessionStorage.getItem('name');

        // Input validation & REST
        if (recipientUsername && msgText) { // required
            let msgData = {
                sender_username: senderUsername,
                sender_name: senderName || null,
                recipient_username: recipientUsername,
                text: msgText
            };
            $.ajax({
                method: 'POST',
                url: kinveyDataUrl,
                headers: getKinveyUserAuthHeaders(),
                contentType: 'application/json',
                data: JSON.stringify(msgData)
            })
                .then(createMsgSuccess)
                .catch(handleAjaxError);
        } else
            showInfo('Please choose recipient & enter message text.');

        function createMsgSuccess(msgInfo) {
            showInfo('Message sent.');
            listArchiveSent();
        }
    }

    function formatDate(dateISO8601) {
        let date = new Date(dateISO8601);
        if (Number.isNaN(date.getDate()))
            return '';
        return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
            "." + date.getFullYear() + ' ' + date.getHours() + ':' +
            padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

        function padZeros(num) {
            return ('0' + num).slice(-2);
        }
    }

    function formatSender(name, username) {
        if (!name)
            return username;
        else
            return username + ' (' + name + ')';
    }
}