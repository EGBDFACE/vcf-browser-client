import { EnthusiasmAction,UploadStatus, TableDisplay } from '../actions/action';
// import {StoreState} from '../types/storeInterface';
import { StoreState, enthusiasm, fileUpload,tableFrameVCF } from '../store/store';
import { funcUpload } from './funcUpload';
import { combineReducers } from 'redux';
import { IgnorePlugin } from 'webpack';
import { Table } from 'react-virtualized';
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
        fileUpload: fileUpload(state.fileUpload,action),
        tableFrameVCF: tableDisplayVCF(state.tableFrameVCF,action)
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
                    fileStatusStage: 'Start Upload',
                    chunkFile:[],
                    totalFile:[]
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
            // console.log(state.chunkFile);
            // console.log(action.chunkList);
            return{
                ...state,
                totalFile: state.totalFile.concat(action.chunkList),
                chunkFile: action.chunkList,
                // totalFile: state.totalFile.concat(action.chunkTabList),
                // chunkFile: action.chunkTabList
            }
        default: return state;
    }
}
function tableDisplayVCF(state:tableFrameVCF,action:TableDisplay){
    switch(action.type){
        case 'VCF_TABLE_FRAME_PREVIOUS':
          return{
              ...state,
              currentPageNumber: state.currentPageNumber - 1
          }
        case 'VCF_TABLE_FRAME_NEXT':
          return{
              ...state,
              currentPageNumber: state.currentPageNumber + 1
          }
        case 'VCF_TABLE_FRAME_INPUT_PAGE':
          if((action.inputPageNumber >=1 )&&(action.inputPageNumber <= action.totalPageNumber)){
              return{
                  ...state,
                  currentPageNumber: action.inputPageNumber
              }
          }else{
              return {...state}
          }
        case 'VCF_TABLE_FRAME_SINGLE_PAGE':
          return{
              ...state,
              currentPageNumber: Math.floor((state.currentPageNumber-1)*state.singlePageDisplayNumber/action.singlePageNumber+1),
              singlePageDisplayNumber: action.singlePageNumber
          }
        // case 'VCF_TABLE_FRAME_TOTAL_PAGE':
        //   console.log(state.singlePageDisplayNumber);
        //   return{
        //       ...state,
        //       totalPageNumber: Math.ceil((state.totalPageNumber+action.totalPageNumber)/state.singlePageDisplayNumber)
        //   }
        default : return state;
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