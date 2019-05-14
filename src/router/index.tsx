import * as React from 'react';
import Loadable from 'react-loadable';
import store from '../store';
import '@/index.scss';
import Home from '../containers/HomePage';
// import {Route,BrowserRouter as Router} from 'react-router-dom';
// import { Route, HashRouter as Router } from 'react-router-dom';
import { Route, Router } from 'react-router-dom';
import history from './history';

const SignIn = Loadable({
    loader: () => import('../pages/SignIn'),
    loading: () =>  <div className='loadingPage'><div className='sk-rotating-plane'></div></div>
});
const SignUp = Loadable({
    loader: () => import('../pages/SignUp'),
    loading: () => <div className='loadingPage'><div className='sk-rotating-plane'></div></div>
});

export default (
    <Router history={history}>
        <div>
            <Route exact path="/" component={Home}/>
            <Route path='/signIn' component={SignIn}/>
            <Route path='/signUp' component={SignUp}/>
        </div>
    </Router>
);