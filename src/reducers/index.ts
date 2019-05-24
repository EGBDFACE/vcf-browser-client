import { VEPFileReceive, userInfoAction, FileProgress, FileUpload, FileTable } from '../actions';
import { StoreState, fileUpload, fileReceive, userInfo } from '../store';
import fileSplit from '../utils/fileHandle';
import { combineReducers } from 'redux';
import { IgnorePlugin } from 'webpack';
import { Table } from 'react-virtualized';

const Reducer = (state:StoreState,action:any) => {
    return{
        fileUpload: fileUpload(state.fileUpload,action),
        fileReceive: fileReceiveFunc(state.fileReceive,action),
        userInfo: setUserInfo(state.userInfo,action)
    }
}

function setUserInfo(state:userInfo,action:userInfoAction){
    switch(action.type){
        case 'USER_SIGN_IN':
            return{
                ...state,
                name: action.name,
                fileList: action.fileList
            };
        case 'USER_SIGN_OUT':
            return{
                ...state,
                name: '',
                fileList: []
            };
        case 'USER_FILELIST_UPDATE':
            return{
                ...state,
                fileList: state.fileList.concat([{fileMd5:action.fileMd5,fileName:action.fileName}])
            }
        default: return state;
    }
}
function fileUpload(state:fileUpload,action: FileUpload){
    switch(action.type){
        case 'FILE_LOAD_PROGRESS':
            return {
                ...state,
                fileLoadPercent: action.percent
            }
        case 'FILE_UPLOAD_PROGRESS':
            return {
                ...state,
                // fileStatusStage: action.fileStatusStage,
                fileUploadPercent: action.percent
            }
        case 'FILE_TABLE_DISPLAY':
            return{
                ...state,
                totalFile: state.totalFile.concat(action.chunkList)
            }
        default: return state;
    }
}
function fileReceiveFunc(state:fileReceive,action:VEPFileReceive){
    switch(action.type){
        case 'VEP_RESULT_NOTPOSTED_CHANGE':
            if(action.chunkResult.data.length != 0){
                if(action.fileMd5 === state.fileMd5){
                    return{
                        ...state,
                        // data: state.data.concat(action.data)
                        chunksResultData: state.chunksResultData.concat([action.chunkResult]),
                        chunksResultDataTotal: state.chunksResultDataTotal.concat(action.chunkResult.data)
                    }
                }else{
                    return{
                        fileMd5: action.fileMd5,
                        // data: action.data
                        chunksResultData: [action.chunkResult],
                        chunksResultDataTotal: action.chunkResult.data
                    }
                }
            }
            
        case 'VEP_FILE_INPUT_CHANGE':
            return{
                ...state,
                // data: []
                chunksResultData: [],
                chunksResultDataTotal: []
            }
        case 'VEP_RESULT_CHANGE_FROM_PULLCHUNKLIST':
            return{
                ...state,
                fileMd5: action.fileMd5,
                chunksResultDataTotal: action.chunksResult
            }
        default: return state
    }
}
export default Reducer;