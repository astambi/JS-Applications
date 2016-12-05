import React, {Component} from 'react';
import './NavigationBar.css';

export default class NavigationBar extends Component {
    render() {
        // this == NavBar
        let username = this.props.username;

        if (username == null)   // user not logged in
            return (
                <div className="navigation-bar">
                    <a href="#" onClick={this.props.homeClicked.bind(this)}>Home</a>
                    <a href="#" onClick={this.props.loginClicked.bind(this)}>Login</a>
                    <a href="#" onClick={this.props.registerClicked.bind(this)}>Register</a>
                </div>
            );
        else    // user logged in
            return (
                <div className="navigation-bar">
                    <a href="#" onClick={this.props.homeClicked.bind(this)}>Home</a>
                    <a href="#" onClick={this.props.booksClicked.bind(this)}>Books</a>
                    <a href="#" onClick={this.props.createBookClicked.bind(this)}>Create Book</a>
                    <a href="#" onClick={this.props.logoutClicked.bind(this)}>Logout</a>
                    <span className="loggedInUser">
                        Welcome, {username}!
                    </span>
                </div>
            )
    }
}