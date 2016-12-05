import React, {Component} from 'react';

export default function HomeView(props) {
    return (
        <div className="home-view">
            <h1>Welcome</h1>
            {
                props.username
                    ? <div>Welcome to my React Book Library, {props.username}!</div>
                    : <div>Welcome to my React Book Library</div>
            }
        </div>
    )
}