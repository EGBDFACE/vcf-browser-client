import * as actions from '../actions/action';
import { StoreState } from '../store/store';
import { connect } from 'react-redux';
import { Dispatch } from 'react';
import ChartDisplay from '../components/ChartDisplay';

function mapStateToProps(state:StoreState){
    console.log(state);
    return{
        data: state.fileReceive.data,
        fileState: state.fileUpload.fileStatus
    }
}
export default connect(mapStateToProps)(ChartDisplay);