import $ from 'jquery';

let KinveyRequester = (function () {
    const kinveyAppKey = 'kid_rJYKcT_Gx';
    const kinveyAppSecret = '155a0eb1f98a4c02a5e3d4fe081a1049';
    const kinveyBaseUrl = 'https://baas.kinvey.com';
    const kinveyAppAuthHeaders = {
        Authorization: 'Basic ' + btoa(kinveyAppKey + ':' + kinveyAppSecret)
    };

    function loginUser(username, password) {
        let userData = {
            username: username,
            password: password
        };
        return $.ajax({
            method: 'POST',
            url: kinveyBaseUrl + '/user/' + kinveyAppKey + '/login',
            headers: kinveyAppAuthHeaders,
            contentType: 'application/json',
            data: JSON.stringify(userData)
        });
    }

    function registerUser(username, password) {
        let userData = {
            username: username,
            password: password
        };
        return $.ajax({
            method: 'POST',
            url: kinveyBaseUrl + '/user/' + kinveyAppKey,
            headers: kinveyAppAuthHeaders,
            contentType: 'application/json',
            data: JSON.stringify(userData)
        });
    }

    function logoutUser() {
        let kinveyUserAuthHeaders = {
            Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')
        };
        return $.ajax({
            method: 'POST',
            url: kinveyBaseUrl + '/user/' + kinveyAppKey + '/_logout',
            headers: kinveyUserAuthHeaders,
            contentType: 'application/json'
        });
    }

    function loadBooks() {
        let kinveyUserAuthHeaders = {
            Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')
        };
        return $.ajax({
            method: 'GET',
            url: kinveyBaseUrl + '/appdata/' + kinveyAppKey + '/books',
            headers: kinveyUserAuthHeaders,
            contentType: 'application/json'
        });
    }

    function createBook(title, author, description) {
        let kinveyUserAuthHeaders = {
            Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')
        };
        let bookData = {
            title: title,
            author: author,
            description: description
        };
        return $.ajax({
            method: 'POST',
            url: kinveyBaseUrl + '/appdata/' + kinveyAppKey + '/books',
            headers: kinveyUserAuthHeaders,
            contentType: 'application/json',
            data: JSON.stringify(bookData)
        });
    }

    function findBookById(bookId) {
        let kinveyUserAuthHeaders = {
            Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')
        };
        return $.ajax({
            method: 'GET',
            url: kinveyBaseUrl + '/appdata/' + kinveyAppKey + '/books/' + bookId,
            headers: kinveyUserAuthHeaders,
            contentType: 'application/json'
        });
    }

    function editBook(bookId, title, author, description) {
        let kinveyUserAuthHeaders = {
            Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')
        };
        let bookData = {
            title: title,
            author: author,
            description: description
        };
        return $.ajax({
            method: 'PUT',
            url: kinveyBaseUrl + '/appdata/' + kinveyAppKey + '/books/' + bookId,
            headers: kinveyUserAuthHeaders,
            contentType: 'application/json',
            data: JSON.stringify(bookData)
        });
    }

    function deleteBook(bookId) {
        let kinveyUserAuthHeaders = {
            Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')
        };
        return $.ajax({
            method: 'DELETE',
            url: kinveyBaseUrl + '/appdata/' + kinveyAppKey + '/books/' + bookId,
            headers: kinveyUserAuthHeaders,
            contentType: 'application/json'
        });
    }

    return {
        loginUser,
        registerUser,
        logoutUser,
        loadBooks,
        createBook,
        findBookById,
        editBook,
        deleteBook
    }
})();

export default KinveyRequester;