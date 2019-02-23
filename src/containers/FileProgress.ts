import FileProgress from '../components/FileProgress';
import { StoreState } from '../store/store';
import { connect } from 'react-redux';

function mapStateToProps(state:StoreState){
    return{
        fileStatus: state.fileUpload.fileStatus,
        fileStatusPercent: state.fileUpload.fileStatusPercent
    }
}

export default connect(mapStateToProps)(FileProgress);