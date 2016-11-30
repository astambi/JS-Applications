// Added some validation & extra notifications
// Added contentType JSON in Kinvey REST requests

function startApp() {
    const kinveyAppKey = "kid_rJYKcT_Gx";
    const kinveyAppSecret = "155a0eb1f98a4c02a5e3d4fe081a1049";
    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyUserUrl = `${kinveyBaseUrl}user/${kinveyAppKey}`;
    const kinveyDataUrl = `${kinveyBaseUrl}appdata/${kinveyAppKey}/books`;
    const kinveyAppAuthHeaders = {
        Authorization: "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret)
    };

    sessionStorage.clear(); // Clear user auth data
    showHideMenuLinks();
    showHomeView();
    bindNavMenuLinks();
    bindFormSubmitButtons();

    function bindNavMenuLinks() {
        // Bind the navigation menu links
        $("#linkHome").click(showHomeView);
        $("#linkLogin").click(showLoginView);
        $("#linkRegister").click(showRegisterView);
        $("#linkListBooks").click(listBooks);
        $("#linkCreateBook").click(showCreateBookView);
        $("#linkLogout").click(logoutUser);
    }

    function bindFormSubmitButtons() {
        // Bind the form submit buttons
        $("#buttonLoginUser").click(loginUser);
        $("#buttonRegisterUser").click(registerUser);
        $("#buttonCreateBook").click(createBook);
        $("#buttonEditBook").click(editBook);
    }

    // Bind the info / error boxes: hide on click
    $("#infoBox, #errorBox").click(function () {
        $(this).fadeOut();
    });

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function () {
            $("#loadingBox").show()
        },
        ajaxStop: function () {
            $("#loadingBox").hide()
        }
    });

    function showHideMenuLinks() {
        $('#menu').find('a').hide(); // hide all links in nav bar
        $("#linkHome").show();

        if (sessionStorage.getItem('authToken')) {  // logged-in user
            $("#linkListBooks").show();
            $("#linkCreateBook").show();
            $("#linkLogout").show();
        } else {
            $("#linkLogin").show();
            $("#linkRegister").show();
        }
    }

    function showView(viewName) {
        $('main > section').hide(); // Hide all views and show the selected view only
        $('#' + viewName).show();
    }

    function showHomeView() {
        showView('viewHome');
    }

    function showLoginView() {
        $('#formLogin').trigger('reset');
        showView('viewLogin');
    }

    function showRegisterView() {
        $('#formRegister').trigger('reset');
        showView('viewRegister');
    }

    function showCreateBookView() {
        $('#formCreateBook').trigger('reset');
        showView('viewCreateBook');
    }

    function registerUser() {
        let formRegister = $('#formRegister');
        let username = formRegister.find('input[name=username]').val().trim();
        let password = formRegister.find('input[name=passwd]').val().trim();

        if (username != '' && password != '') { // validation for empty user credentials
            let userData = {
                username: username,
                password: password
            };
            $.ajax({
                method: "POST",
                url: kinveyUserUrl,
                headers: kinveyAppAuthHeaders,
                contentType: 'application/json',
                data: JSON.stringify(userData),
                success: registerSuccess,
                error: handleAjaxError
            });
        } else {
            showInfo('Please provide username and password.');
        }
        function registerSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listBooks();
            showInfo('User registration successful.');
        }
    }

    function saveAuthInSession(userInfo) {
        // console.dir(userInfo);
        let userAuth = userInfo._kmd.authtoken;
        let userId = userInfo._id;
        let username = userInfo.username;
        sessionStorage.setItem('authToken', userAuth);
        sessionStorage.setItem('userId', userId);
        $('#loggedInUser').text("Welcome, " + username + "!");
    }

    function loginUser() {
        let formLogin = $('#formLogin');
        let username = formLogin.find('input[name=username]').val();
        let password = formLogin.find('input[name=passwd]').val();

        if (username != '' && password != '') { // validation for empty user credentials
            let userData = {
                username: username,
                password: password
            };
            $.ajax({
                method: "POST",
                url: `${kinveyUserUrl}/login`,
                headers: kinveyAppAuthHeaders,
                contentType: 'application/json',
                data: JSON.stringify(userData),
                success: loginSuccess,
                error: handleAjaxError
            });
        } else {
            showInfo('Please provide username and password.');
        }
        function loginSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listBooks();
            showInfo('Login successful.');
        }
    }

    function logoutUser() {
        sessionStorage.clear();
        $('#loggedInUser').text("");
        showHideMenuLinks();
        showView('viewHome');
        showInfo('Logout successful.');
    }

    function listBooks() {
        $('#books').empty();
        showView('viewBooks');

        $.ajax({
            method: "GET",
            url: kinveyDataUrl,
            headers: getKinveyUserAuthHeaders(),
            success: loadBooksSuccess,
            error: handleAjaxError
        });
        function loadBooksSuccess(books) {
            showInfo('Books loaded.');
            if (books.length == 0) {
                $('#books').text('No books in the library.');
            } else {
                let booksTable = $('<table>').append($('<tr>')
                    .append(
                        $('<th>').text('Title'),
                        $('<th>').text('Author'),
                        $('<th>').text('Description'),
                        $('<th>').text('Actions')));
                for (let book of books)
                    appendBookRow(book, booksTable);
                $('#books').append(booksTable);
            }
        }

        function appendBookRow(book, booksTable) {
            let actionLinks = [];
            if (book._acl.creator == sessionStorage['userId']) { // book owner
                let deleteLink = $('<a>').attr('href', '#').text('[Delete]')
                    .click(() => deleteBook(book));
                let editLink = $('<a>').attr('href', '#').text('[Edit]')
                    .click(() => loadBookForEdit(book));
                actionLinks = [deleteLink, ' ', editLink];
            }
            booksTable.append($('<tr>')
                .append(
                    $('<td>').text(book.title),
                    $('<td>').text(book.author),
                    $('<td>').text(book.description),
                    $('<td>').append(actionLinks)));
        }
    }

    function getKinveyUserAuthHeaders() {
        return {
            Authorization: "Kinvey " + sessionStorage.getItem('authToken')
        };
    }

    function createBook() {
        let formCreateBook = $('#formCreateBook');
        let title = formCreateBook.find('input[name=title]').val().trim();
        let author = formCreateBook.find('input[name=author]').val().trim();
        let description = formCreateBook.find('textarea[name=descr]').val().trim();

        if (author && title && description) { // validation for empty book props
            let bookData = {
                title: title,
                author: author,
                description: description
            };
            $.ajax({
                method: "POST",
                url: kinveyDataUrl,
                headers: getKinveyUserAuthHeaders(),
                contentType: 'application/json',
                data: JSON.stringify(bookData),
                success: createBookSuccess,
                error: handleAjaxError
            });
        } else {
            showInfo('Please provide all book details.');
        }
        function createBookSuccess(response) {
            listBooks();
            showInfo('Book created.');
        }
    }

    function loadBookForEdit(book) {
        $.ajax({
            method: "GET",
            url: `${kinveyDataUrl}/${book._id}`,
            headers: getKinveyUserAuthHeaders(),
            success: loadBookForEditSuccess,
            error: handleAjaxError
        });
        function loadBookForEditSuccess(book) {
            // console.dir(book);
            let formEditBook = $('#formEditBook');
            formEditBook.find('input[name=id]').val(book._id);
            formEditBook.find('input[name=title]').val(book.title);
            formEditBook.find('input[name=author]').val(book.author);
            formEditBook.find('textarea[name=descr]').val(book.description);
            showView('viewEditBook');
        }
    }

    function editBook() {
        let formEditBook = $('#formEditBook');
        let title = formEditBook.find('input[name=title]').val().trim();
        let author = formEditBook.find('input[name=author]').val().trim();
        let description = formEditBook.find('textarea[name=descr]').val().trim();
        let id = formEditBook.find('input[name=id]').val();

        if (author != '' && title != '' && description != '') { // validation for empty book props
            let bookData = {
                title: title,
                author: author,
                description: description
            };
            $.ajax({
                method: "PUT",
                url: `${kinveyDataUrl}/${id}`,
                headers: getKinveyUserAuthHeaders(),
                contentType: 'application/json',
                data: JSON.stringify(bookData),
                success: editBookSuccess,
                error: handleAjaxError
            });
        } else {
            showInfo('Please provide all book details.');
        }
        function editBookSuccess(response) {
            listBooks();
            showInfo('Book edited.');
        }
    }

    function deleteBook(book) {
        $.ajax({
            method: "DELETE",
            url: `${kinveyDataUrl}/${book._id}`,
            headers: getKinveyUserAuthHeaders(),
            success: deleteBookSuccess,
            error: handleAjaxError
        });
        function deleteBookSuccess(response) {
            listBooks();
            showInfo('Book deleted.');
        }
    }

    function handleAjaxError(response) {
        // console.dir(response);
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }

    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function () {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    function showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg);
        $('#errorBox').show();
    }
}