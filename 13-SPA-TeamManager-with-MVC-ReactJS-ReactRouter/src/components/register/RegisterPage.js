import React, {Component} from 'react';
import RegisterForm from './RegisterForm';
import {register} from '../../models/User';
import Observer from '../../models/Observer';

export default class RegisterPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            repeatPassword: '',
            inputDisabled: false
        };
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onRegisterSuccess = this.onRegisterSuccess.bind(this);
    }

    onChangeHandler(event) {
        event.preventDefault();
        // alert('Form changed.');
        let newState = {};
        newState[event.target.name] = event.target.value; // username, pass, repeat pass
        this.setState(newState);
    }

    onSubmitHandler(event) {
        // alert('Form submitted.');
        // console.log(this.state);
        event.preventDefault(); // suppress refresh after submit

        if (this.state.password === this.state.repeatPassword) {
            this.setState({
                inputDisabled: true
            });
            register(this.state.username, this.state.password, this.onRegisterSuccess);
        }
        else {
            alert('Passwords do not match.');
        }
    }

    onRegisterSuccess(registerResponse) {
        // alert('Registration successful.');

        this.setState({
            inputDisabled: false
        });
        Observer.onSessionUpdate();

        // Redirect with Router
        this.context.router.push("/");
    }

    render() {
        if (!sessionStorage.getItem('username')) {
            return (
                <div>
                    <h1>Register</h1>
                    <RegisterForm
                        username={this.state.username}
                        password={this.state.password}
                        repeatPassword={this.state.repeatPassword}
                        inputDisabled={this.state.inputDisabled}
                        onChange={this.onChangeHandler}
                        onSubmit={this.onSubmitHandler}
                    />
                </div>
            );
        } else {
            this.context.router.push("/");
        }
    }
}

// Redirect with Router
RegisterPage.contextTypes = {
    router: React.PropTypes.object
};