import * as React from 'react';
import {Link} from 'react-router-dom';
import Upload from '../components/Upload';
import '../index.scss';
import Hello from '../containers/Hello';
import TableFrame from '../containers/TableFrame';
import ChartDisplay from '../containers/ChartDisplay';

export default class Home extends React.Component<any,any>{
    render(){
        return (
            <div className='header'>
                <h1>VCF Browser</h1>
                <div><Link to="/hello">goto page hello</Link></div>
                <div><Link to="/two">goto page two</Link></div>
                <Upload/>
                {/* <Hello nameadd='sra'/> */}
                {/* <TableFrame /> */}
                {/* <ChartDisplay/> */}
            </div>
        );
    }
}