import React, {Component} from 'react';
import Team from './Team';
import {loadTeams} from '../../models/Team';

export default class CatalogPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: []
        };
        this.onLoadSuccess = this.onLoadSuccess.bind(this);
    }

    componentDidMount() {
        loadTeams(this.onLoadSuccess);
    }

    onLoadSuccess(response) {
        this.setState({
            teams: response
        });
    }

    render() {
        return (
            <div>
                <h1>Catalog</h1>
                {this.state.teams.map((team, i) => {
                    return <Team key={i}
                                 teamId={team._id}
                                 teamName={team.teamName}
                                 description={team.description}/>
                })}
            </div>
        );
    }
}