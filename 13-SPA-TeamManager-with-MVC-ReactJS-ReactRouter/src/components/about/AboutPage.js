import React, {Component} from 'react';
// import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default class AboutPage extends Component {
    render() {
        return (
            <div>
                <h1>About</h1>
                <div>Create a JS application for managing teams.
                    Use ReactJS for rendering, React Router for routing and Kinvey as a backend provider.
                    Structure your work so that it is easy to manage.
                </div>
                <ol>
                    <li>App Structure
                        <ul>
                            <li>Home Page – show relevant info, depending on the status of the user</li>
                            <li>Catalog – a list of all registered teams</li>
                            <li>About – dummy page that would hold information about the app</li>
                            <li>Register User</li>
                            <li>Create Team</li>
                            <li>Edit Team</li>
                            <li>View Team Details – a detailed page that shows all members of the team and management controls</li>
                            <li>Create a header that is shared across all pages and place links to the relevant sections in it.</li>
                        </ul>
                    </li>
                    <li>CRUD Operations</li>
                    <span>The app must support user registration, login and logout.
                        Store the user credential in session storage.
                        Once logged in, the user is free to browse all registered teams and join or create a new team.
                        At any point, the user is able to leave the team he is a member of.</span>
                    <li>Entity Structure</li>
                    <span>A team has a name and description that are displayed while browsing.
                        A user has a username.
                        You may create databases and entries as you see fit.</span>
                </ol>
            </div>
        );
    }
}