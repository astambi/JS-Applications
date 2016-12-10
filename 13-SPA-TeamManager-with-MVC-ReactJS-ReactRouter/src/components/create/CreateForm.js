import React, {Component} from 'react';

export default class CreateForm extends Component {
    render() {
        return (
            <form onSubmit={this.props.onSubmit}>
                <div className="form-group">
                    <label>Team name</label>
                    <textarea className="form-control"
                              name="teamName"
                              value={this.props.teamName}
                              onChange={this.props.onChange}>
                    </textarea>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control"
                              name="description"
                              value={this.props.description}
                              onChange={this.props.onChange}>
                    </textarea>
                </div>
                <div>
                    <input className="btn btn-default"
                           type="submit"
                           value="Create Team"
                           disabled={this.props.inputDisabled}
                    />
                </div>
            </form>
        );
    }
}