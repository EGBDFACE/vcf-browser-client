import TabDisplay from '../components/TabDisplay';
import * as React from '../actions/action';
import { StoreState } from '../store/store';
import { connect } from 'react-redux';
import { Dispatch } from 'react';

function mapStateToProps(state:StoreState){
    return{
        chunkFile: state.fileUpload.chunkFile
    }
}
export default connect(mapStateToProps)(TabDisplay);