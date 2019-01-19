import * as React from 'react';
import {Link} from 'react-router-dom';

export default class Home extends React.Component<any,any>{
    render(){
        return (
            <div>
                <div>HOME</div>
                <div><Link to="/hello">goto page hello</Link></div>
                <div><Link to="/two">goto page two</Link></div>
            </div>
        );
    }
}