import * as React from 'react';
import {Link} from 'react-router-dom';
// import FileUploader from '../components/FileUploader';
import Upload from '../components/Upload';

export default class Home extends React.Component<any,any>{
    render(){
        return (
            <div>
                <div>HOME</div>
                <div><Link to="/hello">goto page hello</Link></div>
                <div><Link to="/two">goto page two</Link></div>
                <Upload/>
            </div>
        );
    }
}