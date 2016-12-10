import React, {Component} from 'react';
import CreateForm from './CreateForm';
import {create} from '../../models/Team';
// import Observer from '../../models/Observer';

export default class CreatePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teamName: '',
            description: '',
            inputDisabled: true
        };
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onCreateSuccess = this.onCreateSuccess.bind(this);
    }

    onChangeHandler(event) {
        // alert('Form changed.');
        event.preventDefault();

        let newState = {};
        newState[event.target.name] = event.target.value; // teamName, description
        if (event.target.name === 'teamName' &&
            event.target.value.trim().length === 0)
            newState.inputDisabled = true;
        else
            newState.inputDisabled = false;
        this.setState(newState);
    }

    onSubmitHandler(event) {
        // alert('Form submitted.');
        // console.log(this.state);
        event.preventDefault();

        if (!this.state.teamName.trim())
            alert('Please provide a team name.');
        else
            create(this.state.teamName.trim(),
                this.state.description.trim(),
                this.onCreateSuccess);
    }

    onCreateSuccess(createResponse) {
        // alert('Team created.');
        this.context.router.push("/catalog");
    }

    render() {
        return (
            <div>
                <h1>Create Team</h1>
                <CreateForm
                    teamName={this.state.teamName}
                    description={this.state.description}
                    inputDisabled={this.state.inputDisabled}
                    onChange={this.onChangeHandler}
                    onSubmit={this.onSubmitHandler}
                />
            </div>
        );
    }
}

// Redirect with Router
CreatePage.contextTypes = {
    router: React.PropTypes.object
};