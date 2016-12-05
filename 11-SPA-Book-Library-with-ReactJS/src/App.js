import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css';

// import React Components
import NavigationBar from './Components/NavigationBar';
import Footer from './Components/Footer';

// import React Views
import HomeView from './Views/HomeView';
import LoginView from './Views/LoginView';
import RegisterView from './Views/RegisterView';
import BooksView from './Views/BooksView';
import CreateBookView from './Views/CreateBookView';
import EditBookView from './Views/EditBookView';
import DeleteBookView from './Views/DeleteBookView';

// import jQuery & KinveyRequester
import $ from 'jquery';
import KinveyRequester from './KinveyRequester';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            userId: null
        };
    }

    componentDidMount() {
        // Attach global AJAX "loading" event handlers
        $(document).on({
            ajaxStart: function () {
                $("#loadingBox").show()
            },
            ajaxStop: function () {
                $("#loadingBox").hide()
            }
        });

        // Attach a global AJAX error handler
        $(document).ajaxError(
            this.handleAjaxError.bind(this));

        // Load state
        this.setState({
            username: sessionStorage.getItem("username"),
            userId: sessionStorage.getItem("userId")
        });

        // Load HomeView
        this.showHomeView();

        // Bind InfoBox/ ErrorBox clicks
        $('#errorBox').click(function () {
            $(this).hide();
        });
        $('#infoBox').click(function () {
            $(this).hide();
        });
    }

    handleAjaxError(event, response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        this.showError(errorMsg);
    }

    showInfo(message) {
        $('#infoBox').text(message).show();
        setTimeout(function () {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    showError(errorMsg) {
        $('#errorBox').text("Error: " + errorMsg).show();
    }

    render() {
        // this == App
        return (
            <div className="App">
                <header>
                    <NavigationBar
                        username={this.state.username}
                        homeClicked={this.showHomeView.bind(this)}
                        loginClicked={this.showLoginView.bind(this)}
                        registerClicked={this.showRegisterView.bind(this)}
                        booksClicked={this.showBooksView.bind(this)}
                        createBookClicked={this.showCreateBookView.bind(this)}
                        logoutClicked={this.logout.bind(this)}
                    />
                    <div id="loadingBox">Loading...</div>
                    <div id="infoBox">Info msg</div>
                    <div id="errorBox">Error msg</div>
                </header>
                <div id="main">Main</div>
                <Footer/>
            </div>
        );
    }

    showView(reactViewComponent) {
        ReactDOM.render(
            reactViewComponent,
            document.getElementById('main')
        );
        $('#errorBox').hide();
    }

    showHomeView() {
        this.showView(<HomeView
            username={this.state.username}/>);
    }

    showLoginView() {
        this.showView(<LoginView
            onsubmit={this.login.bind(this)}/>); // this == App
    }

    showRegisterView() {
        this.showView(<RegisterView
            onsubmit={this.register.bind(this)}/>); // this == App
    }

    login(username, password) {
        KinveyRequester.loginUser(username, password)
            .then(loginSuccess.bind(this)); // this == App
        // no catch => Global Ajax Error (handleAjaxError)

        function loginSuccess(userInfo) {   // this == App
            this.saveAuthInSession(userInfo);
            this.showBooksView();
            this.showInfo('Login successful.');
        }
    }

    register(username, password) {
        KinveyRequester.registerUser(username, password)
            .then(registerSuccess.bind(this)); // this == App

        function registerSuccess(userInfo) {   // this == App
            this.saveAuthInSession(userInfo);
            this.showBooksView();
            this.showInfo('Registration successful.');
        }
    }

    logout() {
        KinveyRequester.logoutUser()
            .then(logoutSuccess.bind(this));

        function logoutSuccess() {
            sessionStorage.clear();

            // This will update the entire app UI (e.g. the navigation bar)
            this.setState({
                username: null,
                userId: null
            });

            this.showHomeView();
            this.showInfo('Logout successful.');
        }
    }

    saveAuthInSession(userInfo) {
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('username', userInfo.username);

        // This will update the entire app UI (e.g. the navigation bar)
        this.setState({
            username: userInfo.username,
            userId: userInfo._id
        });
    }

    showBooksView() {
        KinveyRequester.loadBooks()
            .then(loadBooksSuccess.bind(this));

        function loadBooksSuccess(books) {
            this.showView(
                <BooksView
                    books={books}
                    onedit={this.loadBookForEdit.bind(this)}
                    ondelete={this.loadBookForDelete.bind(this)}
                />);
            this.showInfo('Books loaded.');
        }
    }

    loadBookForEdit(bookId) {
        KinveyRequester.findBookById(bookId)
            .then(findBookToEditSuccess.bind(this));

        function findBookToEditSuccess(bookInfo) {
            this.showView(
                <EditBookView
                    bookId={bookInfo._id}
                    title={bookInfo.title}
                    author={bookInfo.author}
                    description={bookInfo.description}
                    onsubmit={this.editBook.bind(this)}
                />);
        }
    }

    editBook(bookId, title, author, description) {
        KinveyRequester.editBook(bookId, title, author, description)
            .then(editBookSuccess.bind(this));

        function editBookSuccess(bookInfo) {
            this.showBooksView();
            this.showInfo('Book edited.');
        }
    }

    loadBookForDelete(bookId) {
        KinveyRequester.findBookById(bookId)
            .then(findBookToDeleteSuccess.bind(this));

        function findBookToDeleteSuccess(bookInfo) {
            this.showView(
                <DeleteBookView
                    bookId={bookInfo._id}
                    title={bookInfo.title}
                    author={bookInfo.author}
                    description={bookInfo.description}
                    onsubmit={this.deleteBook.bind(this)}
                />);
        }
    }

    deleteBook(bookId) {
        KinveyRequester.deleteBook(bookId)
            .then(deleteBookSuccess.bind(this));

        function deleteBookSuccess(response) {
            this.showBooksView();
            this.showInfo('Book deleted.');
        }
    }

    showCreateBookView() {
        this.showView(<CreateBookView
            onsubmit={this.createBook.bind(this)}/>);
    }

    createBook(title, author, description) {
        KinveyRequester.createBook(title, author, description)
            .then(createBookSuccess.bind(this));

        function createBookSuccess(bookInfo) {
            this.showBooksView();
            this.showInfo('Book created.');
        }
    }
}