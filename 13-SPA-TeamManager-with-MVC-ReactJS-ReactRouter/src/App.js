import React, {Component} from 'react';
import {Link} from 'react-router';

import Header from './components/common/Header';
import Observer from './models/Observer';
import {logout} from './models/User';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            username: null
        };
        this.onSessionUpdate = this.onSessionUpdate.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    componentDidMount() {
        Observer.onSessionUpdate = this.onSessionUpdate;
        this.checkUserCredentials();
    }

    onSessionUpdate() {
        // alert('Session updated.');
        this.checkUserCredentials();
    }

    onLogout() {
        this.checkUserCredentials();
    }

    checkUserCredentials() {
        let username = sessionStorage.getItem('username');
        if (username) {
            this.setState({
                isLoggedIn: true,
                username: username
            });
        } else {
            this.setState({
                isLoggedIn: false,
                username: null
            })
        }
    }

    render() {
        if (this.state.isLoggedIn)
            return (
                <div className="container">
                    <Header isLoggedIn={this.state.isLoggedIn}
                            username={this.state.username}>
                        <Link to="/" className="btn btn-default">Home</Link>
                        <Link to="/catalog" className="btn btn-default">Catalog</Link>
                        <Link to="/create" className="btn btn-default">Create Team</Link>
                        <Link to="/about" className="btn btn-default">About</Link>
                        <Link to="/logout" className="btn btn-default"
                              onClick={() => logout(this.onLogout)}>Logout</Link>
                    </Header>
                    {this.props.children}
                </div>
            );
        else
            return (
                <div className="container">
                    <Header isLoggedIn={this.state.isLoggedIn}
                            username={this.state.username}>
                        <Link to="/" className="btn btn-default">Home</Link>
                        <Link to="/login" className="btn btn-default">Login</Link>
                        <Link to="/register" className="btn btn-default">Register</Link>
                    </Header>
                    {this.props.children}
                </div>
            );
    }
}

export default App;