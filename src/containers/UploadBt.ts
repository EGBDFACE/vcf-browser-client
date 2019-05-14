import UploadBt from '../components/UploadBt';
import * as actions from '../actions';
import { StoreState } from '../store';
import { connect } from 'react-redux';
import { Dispatch } from 'react';

function mapStateToProps(state:StoreState){
    return{
        fileStatus: state.fileUpload.fileStatus,
        fileStatusStage: state.fileUpload.fileStatusStage,
        inputFile: state.fileUpload.inputFile
    }
}

function mapDispatchToProps(dispatch:Dispatch<actions.UploadStatus>){
    return{
        fileUpload: (file:object) => dispatch(actions.FileUpload(file))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(UploadBt);