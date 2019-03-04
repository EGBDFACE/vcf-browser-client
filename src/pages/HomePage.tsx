import * as React from 'react';
import {Link} from 'react-router-dom';
// import FileUploader from '../components/FileUploader';
import Upload from '../components/Upload';
// import Upload from '../containers/Upload';
import '../index.scss';
// import TabDisplay from '../components/TabDisplay';
// import TabDisplay from '../containers/TabDisplay';
// import TableFrame from '../components/TableFrame';
import TableFrame from '../containers/TableFrame';

export default class Home extends React.Component<any,any>{
    render(){
        return (
            <div className='header'>
                <h1>Vcf Browser</h1>
                <div><Link to="/hello">goto page hello</Link></div>
                <div><Link to="/two">goto page two</Link></div>
                <Upload/>
                <TableFrame />
            </div>
        );
    }
}