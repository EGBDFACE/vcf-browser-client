import * as React from 'react';
import Hello from './containers/Hello';
import Home from './pages/HomePage';
import Two from './pages/TwoPage';
import {Route,BrowserRouter as Router} from 'react-router-dom';
export default (
    <Router>
        <div>
            <Route exact path="/" component={Home}/>
            <Route path="/hello" component={Hello}/>
            <Route path="/two" component={Two}/>
        </div>
    </Router>
);
