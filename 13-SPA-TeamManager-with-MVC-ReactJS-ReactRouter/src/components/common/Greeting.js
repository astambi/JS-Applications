import React, {Component} from 'react';

export default class Greeting extends Component {
    render() {
        if (!this.props.isLoggedIn)
            return null;
        return <span>Welcome, {this.props.username}!</span>
    }
}