import Home from '../pages/HomePage';
import * as actions from '../actions';
import { StoreState, fileReceive } from '../store';
import { connect } from 'react-redux';
import { Dispatch } from 'react';

function mapStateToProps (state: StoreState){
    return{
        UserName: state.userInfo.name,
        UserFileList: state.userInfo.fileList,
        totalFileTable: state.fileUpload.totalFile,
        // fileProgressPercent: state.fileUpload.fileStatusPercent,
        fileUploadProgressPercent: state.fileUpload.fileUploadPercent,
        fileLoadProgressPercent: state.fileUpload.fileLoadPercent,
        fileResultFromServer: state.fileReceive.data
    }
}

function mapDispatchToProps (dispatch: Dispatch<any>){
    return{
        signOut: () => dispatch(actions.userSignOut()),
        userGetFile: (obj:fileReceive) => dispatch(actions.VEPFileReceive(obj))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);