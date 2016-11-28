// Added some validation & extra notifications
// Added contentType JSON in Kinvey REST requests

function startApp() {
    sessionStorage.clear(); // Clear user auth data
    showHideMenuLinks();
    showView('viewHome');

    // Bind the navigation menu links
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListBooks").click(listBooks);
    $("#linkCreateBook").click(showCreateBookView);
    $("#linkLogout").click(logoutUser);

    // Bind the form submit buttons
    $("#buttonLoginUser").click(loginUser);
    $("#buttonRegisterUser").click(registerUser);
    $("#buttonCreateBook").click(createBook);
    $("#buttonEditBook").click(editBook);

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

    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_rJYKcT_Gx";
    const kinveyAppSecret = "155a0eb1f98a4c02a5e3d4fe081a1049";
    const kinveyAppAuthHeaders = {
        Authorization: "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret),
        contentType: 'application/json'
    };

    function showHideMenuLinks() {
        $('#menu').find('a').hide(); // hide all links in nav bar
        $("#linkHome").show();

        if (sessionStorage.getItem('authToken')) {  // Logged-in user
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
        let formRegisterInput = $('#formRegister');
        let username = formRegisterInput.find('input[name=username]').val().trim();
        let password = formRegisterInput.find('input[name=passwd]').val().trim();

        if (username != '' && password != '') {
            let userData = {
                username: username,
                password: password
            };
            $.ajax({
                method: "POST",
                url: kinveyBaseUrl + "user/" + kinveyAppKey,
                headers: kinveyAppAuthHeaders,
                contentType: 'application/json',
                data: JSON.stringify(userData),
                success: registerSuccess,
                error: handleAjaxError
            });
        } else {
            showInfo('Please enter username and password.');
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
        let formRegisterInput = $('#formLogin');
        let username = formRegisterInput.find('input[name=username]').val();
        let password = formRegisterInput.find('input[name=passwd]').val();

        if (username != '' && password != '') {
            let userData = {
                username: username,
                password: password
            };
            $.ajax({
                method: "POST",
                url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
                headers: kinveyAppAuthHeaders,
                contentType: 'application/json',
                data: JSON.stringify(userData),
                success: loginSuccess,
                error: handleAjaxError
            });
        } else {
            showInfo('Please enter username and password.');
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
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books",
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
                    .append('<th>Title</th><th>Author</th>',
                        '<th>Description</th><th>Actions</th>'));
                for (let book of books)
                    appendBookRow(book, booksTable);
                $('#books').append(booksTable);
            }
        }

        function appendBookRow(book, booksTable) {
            let links = [];
            if (book._acl.creator == sessionStorage['userId']) { // NB book owner
                let deleteLink = $('<a href="#">[Delete]</a>')
                    .click(function () {
                        deleteBook(book)
                    });
                let editLink = $('<a href="#">[Edit]</a>')
                    .click(function () {
                        loadBookForEdit(book)
                    });
                links = [deleteLink, ' ', editLink];
            }
            booksTable.append($('<tr>')
                .append(
                    $('<td>').text(book.title),
                    $('<td>').text(book.author),
                    $('<td>').text(book.description),
                    $('<td>').append(links)
                ));
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

        if (author != '' && title != '') {
            let bookData = {
                title: title,
                author: author,
                description: description
            };
            $.ajax({
                method: "POST",
                url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books",
                headers: getKinveyUserAuthHeaders(),
                contentType: 'application/json',
                data: JSON.stringify(bookData),
                success: createBookSuccess,
                error: handleAjaxError
            });
        } else {
            showInfo('Please enter author and title.');
        }
        function createBookSuccess(response) {
            listBooks();
            showInfo('Book created.');
        }
    }

    function loadBookForEdit(book) {
        $.ajax({
            method: "GET",
            url: kinveyBookUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + book._id,
            headers: getKinveyUserAuthHeaders(),
            success: loadBookForEditSuccess,
            error: handleAjaxError
        });
        function loadBookForEditSuccess(book) {
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

        if (author != '' && title != '') {
            let bookData = {
                title: title,
                author: author,
                description: description
            };
            $.ajax({
                method: "PUT",
                url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + id,
                headers: getKinveyUserAuthHeaders(),
                contentType: 'application/json',
                data: JSON.stringify(bookData),
                success: editBookSuccess,
                error: handleAjaxError
            });
        } else {
            showInfo('Please enter author and title.');
        }
        function editBookSuccess(response) {
            listBooks();
            showInfo('Book edited.');
        }
    }

    function deleteBook(book) {
        $.ajax({
            method: "DELETE",
            url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/books/" + book._id,
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