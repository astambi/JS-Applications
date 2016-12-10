import React, {Component} from 'react';
import EditForm from '../create/CreateForm'; // using the create form
import {loadDetails, edit} from '../../models/Team';
// import Observer from '../../models/Observer';

export default class EditPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teamName: '',
            description: '',
            inputDisabled: true
        };
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onEditSuccess = this.onEditSuccess.bind(this);
        this.onLoadSuccess = this.onLoadSuccess.bind(this);
    }

    componentDidMount() {
        loadDetails(this.props.params.teamId, this.onLoadSuccess);
    }

    onLoadSuccess(response) {
        // console.log(response);
        // TODO display team data for edit

        this.state = {
            teamName: response.teamName,
            description: response.description,
            inputDisabled: false
        };
    }

    onChangeHandler(event) {
        // alert('Form changed.');
        event.preventDefault();

        let newState = {};
        newState[event.target.name] = event.target.value; // teamName, description
        // if (event.target.name === 'teamName' &&
        //     event.target.value.trim().length === 0)
            // newState.inputDisabled = true;
        // else
        //     newState.inputDisabled = false;
        this.setState(newState);
    }

    onSubmitHandler(event) {
        // alert('Form submitted.');
        // console.log(this.state);
        event.preventDefault();

        if (!this.state.teamName.trim())
            alert('Please provide a team name.');
        else {
            edit(this.props.params.teamId,
                this.state.teamName,
                this.state.description,
                this.onEditSuccess);
        }
    }

    onEditSuccess(editResponse) {
        // alert('Team edited.');
        this.context.router.push("/catalog");
    }

    render() {
        return (
            <div>
                <h1>Edit Team</h1>
                <EditForm
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
EditPage.contextTypes = {
    router: React.PropTypes.object
};