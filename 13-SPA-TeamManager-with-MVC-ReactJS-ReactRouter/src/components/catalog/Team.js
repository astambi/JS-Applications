import React, {Component} from 'react';
import './Team.css';
import {Link} from 'react-router';

export default class Team extends Component {
    render() {
        return (
            <div className="team-box">
                <span className="spanner">Team name</span>
                <span >{this.props.teamName}</span>
                <span className="spanner">Description</span>
                <span>{this.props.description || 'No description'}</span>
                <span className="spanner">Actions</span>
                <Link to={"/edit/" + this.props.teamId}
                      className="btn btn-default">Edit
                </Link>
            </div>
        )
    }
}