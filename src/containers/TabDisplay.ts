import TabDisplay from '../components/TabDisplay';
import * as React from '../actions';
import { StoreState } from '../store';
import { connect } from 'react-redux';
import { Dispatch } from 'react';

function mapStateToProps(state:StoreState){
    return{
        chunkFile: state.fileUpload.chunkFile,
        totalFile: state.fileUpload.totalFile
    }
}
export default connect(mapStateToProps)(TabDisplay);