import Home from '../pages/HomePage';
import * as actions from '../actions';
import { StoreState, fileReceive } from '../store';
import { connect } from 'react-redux';
import { Dispatch } from 'react';

function mapStateToProps (state: StoreState){
    return{
        name: state.userInfo.name,
        fileList: state.userInfo.fileList
    }
}

function mapDispatchToProps (dispatch: Dispatch<actions.AllAction>){
    return{
        signOut: () => dispatch(actions.userSignOut()),
        userGetFile: (obj:fileReceive) => dispatch(actions.VEPFileReceive(obj))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);