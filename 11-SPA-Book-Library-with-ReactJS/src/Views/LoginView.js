import React, {Component} from 'react';

export default class LoginView extends Component {
    render() {
        // onClick vs onSubmit:
        // onClick => no form validation, no reloading
        // onSubmit => form validation with reloading
        // NB! reloading to be avoided in a SPA!
        // => onSubmit + event.preventDefault to avoid reloading OR
        //    onClick + back-end validation + notifications

        return (
            <form className="login-form" onSubmit={this.submitForm.bind(this)}>
                <h1>Login</h1>
                <label>
                    <div>Username:</div>
                    <input type="text" name="username" required
                           ref={e => this.usernameField = e}/>
                </label>
                <label>
                    <div>Password:</div>
                    <input type="password" name="password" required
                           ref={e => this.passwordField = e}/>
                </label>
                <div>
                    <input type="submit" value="Login"/>
                </div>
            </form>
        );
    }

    submitForm(event) {
        event.preventDefault(); // prevents reloading

        // binded this from LoginForm
        // onsubmit ==> login
        this.props.onsubmit(
            this.usernameField.value,
            this.passwordField.value);
    }
}