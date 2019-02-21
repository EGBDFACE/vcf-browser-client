import UploadBt from '../components/UploadBt';
import * as actions from '../actions/action';
import { StoreState } from '../store/store';
import { connect } from 'react-redux';
import { Dispatch } from 'react';

function mapStateToProps(state:StoreState){
    return{
        fileStatus: state.fileUpload.fileStatus,
        inputFile: state.fileUpload.inputFile
    }
}

function mapDispatchToProps(dispatch:Dispatch<actions.UploadStatus>){
    return{
        fileUpload: (file:object) => dispatch(actions.FileUpload(file))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(UploadBt);