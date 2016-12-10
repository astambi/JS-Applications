import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';

let Catalog = React.createClass({
    render: function () {
        return <div>
            <h1>Catalog</h1>
            <div>{this.props.params.category}</div>
            <div>{this.props.params.productId}</div>
        </div>
    }
});

let About = React.createClass({
    render: function () {
        return <div>About</div>
    }
});

let Home = React.createClass({
    render: function () {
        return <div>Home Page</div>
    }
});

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="catalog" component={Catalog}>
                <Route path=":category/:productId" component={Catalog}/>
            </Route>
            <Route path="about" component={About}/>
        </Route>
    </Router>,
    document.getElementById('root')
);
