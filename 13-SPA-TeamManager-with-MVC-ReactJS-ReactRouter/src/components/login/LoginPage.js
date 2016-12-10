import React, {Component} from 'react';
import LoginForm from './LoginForm';
import {login} from '../../models/User';
import Observer from '../../models/Observer';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            inputDisabled: false
        };
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onLoginSuccess = this.onLoginSuccess.bind(this);
    }

    onChangeHandler(event) {
        // alert('Form changed.');
        event.preventDefault();
        let newState = {};
        newState[event.target.name] = event.target.value; // username, pass, repeat pass
        this.setState(newState);
    }

    onSubmitHandler(event) {
        // alert('Form submitted.');
        // console.log(this.state);
        event.preventDefault(); // suppress refresh after submit
        this.setState({
            inputDisabled: true
        });
        login(this.state.username, this.state.password, this.onLoginSuccess);
    }

    onLoginSuccess(loginResponse) {
        this.setState({
            inputDisabled: false
        });

        if (loginResponse) { // success
            // alert('Login successful.');
            Observer.onSessionUpdate();
            this.context.router.push("/");
        }
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                <LoginForm
                    username={this.state.username}
                    password={this.state.password}
                    inputDisabled={this.state.inputDisabled}
                    onChange={this.onChangeHandler}
                    onSubmit={this.onSubmitHandler}/>
            </div>
        );
    }
}

// Redirect with Router
LoginPage.contextTypes = {
    router: React.PropTypes.object
};