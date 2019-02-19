import { EnthusiasmAction,UploadStatus } from '../actions/action';
// import {StoreState} from '../types/storeInterface';
import { StoreState } from '../store/store';
// import { combineReducers } from 'redux';
// import store from '../store/store';

// const initialState:StoreState = {
//     enthusiasmLevel: 1,
//     languageName: 'TypeScript',
//     uploaded: false,
//     uploading: false
// };

function enthusiasm (state:StoreState,action:EnthusiasmAction){
    // console.log(state);
    // console.log(store.getState());
    switch(action.type){
        case 'INCREMENT_ENTHUSIASM':
            return {
                ...state,
                enthusiasmLevel:state.enthusiasmLevel+1
            };
        case 'DECREMENT_ENTHUSIASM':
            return {
                ...state,
                enthusiasmLevel:state.enthusiasmLevel-1
            };
        default: return state;
    }
}
function uploadStatus(state:StoreState,action:UploadStatus){
    // console.log(state)
    switch(action.type){
        case 'UPLOAD_STATUS_CHANGE':
            return {
                ...state,
                uploading: !state.uploading
            };
        case 'FILE_SELECTED':
            // console.log('file selected');
            // console.log(action.name);
            return {
               ...state,
               selectedFileName: action.name 
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
const Reducer = (state :StoreState,action:any) => {
    return {
        languageName: enthusiasm(state,action).languageName,
        enthusiasmLevel: enthusiasm(state,action).enthusiasmLevel,
        uploaded: uploadStatus(state,action).uploaded,
        uploading: uploadStatus(state,action).uploading,
        selectedFileName: uploadStatus(state,action).selectedFileName
    }
} 
// export function Reducer(state:StoreState,action:EnthusiasmAction){
//     return {
//         enthusiasm: enthusiasm(state,action),
//         uploadStatus: uploadStatus(state,action)
//     }
// }
export default Reducer;