import React, {Component} from 'react';
import './App.css';
import {Link} from 'react-router';

let Header = React.createClass({
    render: function () {
        return (
            <div>
                <h1>Header</h1>
                <Link to="/catalog" activeClassName="activeNav">Catalog</Link>
                <Link to="/about" activeClassName="activeNav">About</Link>
            </div>
        )
    }
});

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header/>
                {this.props.children}
            </div>
        );
    }
}

export default App;
