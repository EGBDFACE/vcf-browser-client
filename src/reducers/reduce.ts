import { EnthusiasmAction,UploadStatus, decrementEnthusiasm, FileUpload } from '../actions/action';
// import {StoreState} from '../types/storeInterface';
import { StoreState, enthusiasm, fileUpload } from '../store/store';
import { funcUpload } from './funcUpload';
import { combineReducers } from 'redux';
import { IgnorePlugin } from 'webpack';
// import store from '../store/store';

// const initialState:StoreState = {
//     enthusiasmLevel: 1,
//     languageName: 'TypeScript',
//     uploaded: false,
//     uploading: false
// };

// const Reducer = (state :StoreState,action:any) => {
//     console.log('get state');
//     return {
//         languageName: enthusiasm(state,action).languageName,
//         enthusiasmLevel: enthusiasm(state,action).enthusiasmLevel,
//         uploaded: uploadStatus(state,action).uploaded,
//         uploading: uploadStatus(state,action).uploading,
//         selectedFileName: uploadStatus(state,action).selectedFileName
//     }
// } 
// const Reducer = combineReducers({
//     enthusiasm,
//     fileUpload
// })
const Reducer = (state:StoreState,action:any) => {
    // console.log(state);
    return{
        enthusiasm: enthusiasm(state.enthusiasm,action),
        fileUpload: fileUpload(state.fileUpload,action)
    }
}
function enthusiasm (state:enthusiasm,action:EnthusiasmAction){
    // console.log(state);
    // console.log(store.getState());
    switch(action.type){
        case 'INCREMENT_ENTHUSIASM':
            console.log('run increment');
            console.log(state.enthusiasmLevel);
            return {
                ...state,
                enthusiasmLevel:state.enthusiasmLevel+1
            };
        case 'DECREMENT_ENTHUSIASM':
            console.log('run decrement');
            return {
                ...state,
                enthusiasmLevel:state.enthusiasmLevel-1
            };
        default: return state;
    }
}
function fileUpload(state:fileUpload,action:UploadStatus){
    // console.log(state)
    switch(action.type){
        case 'UPLOAD_STATUS_CHANGE':
            return {
                ...state,
                fileStatus: 'FILE_NOT_SELECTED'
                // uploading: !state.uploading
            };
        case 'FILE_SELECTED':
            // console.log('file selected');
            // console.log(action.name);
            if(action.file){
                return {
                    ...state,
                    inputFile: action.file,
                    selectedFileName: action.file.name,
                    fileStatus: 'PREPARE_TO_UPLOAD',
                    fileStatusStage: 'Start Upload'
                 //    uploading: !state.uploading 
                 }
            }else{
                return {
                    ...state
                }
            }
        case 'FILE_UPLOAD':
            console.log(action.file);
            return {
                ...state,
                fileStatus: 'UPLOADING',
                fileFromServer: funcUpload(action.file)
            }
        case 'FILE_UPLOAD_PROGRESS':
            return {
                ...state,
                fileStatusStage: action.fileStatusStage,
                fileStatusPercent: action.fileStatusPercent
            }
        case 'FILE_TABLE_DISPLAY':
            console.log(state.chunkFile);
            console.log(action.chunkList);
            return{
                ...state,
                chunkFile: action.chunkList
            }
        default: return state;
    }
}
// const Reducer = combineReducers({
//     languageName:enthusiasm,
//     enthusiasmLevel:enthusiasm,
//     uploaded:uploadStatus,
//     uploading:uploadStatus
// });

// export function Reducer(state:StoreState,action:EnthusiasmAction){
//     return {
//         enthusiasm: enthusiasm(state,action),
//         uploadStatus: uploadStatus(state,action)
//     }
// }
export default Reducer;