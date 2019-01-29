import * as React from 'react';
import Loadable from 'react-loadable';

const Hello = Loadable({
    loader: ()=> import('../containers/Hello'),
    loading: () => <div>loading...</div>
});
const Two = Loadable({
    loader: () => import('../pages/TwoPage'),
    loading: () => <div>loading...</div>
})
// import Hello from '../containers/Hello';
import Home from '../pages/HomePage';
// import Two from '../pages/TwoPage';
import {Route,BrowserRouter as Router} from 'react-router-dom';
// const Home = React.lazy(() => import('./pages/HomePage'));
// const Two = React.lazy(()=> import('./pages/TwoPage'));
export default (
    <Router>
        <div>
            <Route exact path="/" component={Home}/>
            <Route path="/hello" component={Hello}/>
            <Route path="/two" component={Two}/>
        </div>
    </Router>
);