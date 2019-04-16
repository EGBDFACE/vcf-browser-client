import { EnthusiasmAction,UploadStatus, TableDisplay, VEPFileReceive } from '../actions/action';
// import {StoreState} from '../types/storeInterface';
import { StoreState, enthusiasm, fileUpload,tableFrameVCF, fileReceive } from '../store/store';
// import { funcUpload } from './funcUpload';
import fileSplit from './fileHandle';
import { combineReducers } from 'redux';
import { IgnorePlugin } from 'webpack';
import { Table } from 'react-virtualized';

const Reducer = (state:StoreState,action:any) => {
    return{
        enthusiasm: enthusiasm(state.enthusiasm,action),
        fileUpload: fileUpload(state.fileUpload,action),
        tableFrameVCF: tableDisplayVCF(state.tableFrameVCF,action),
        fileReceive: fileReceiveFunc(state.fileReceive,action)
    }
}
function enthusiasm (state:enthusiasm,action:EnthusiasmAction){
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
    switch(action.type){
        case 'UPLOAD_STATUS_CHANGE':
            return {
                ...state,
                fileStatus: 'FILE_NOT_SELECTED'
            };
        case 'FILE_SELECTED':
            if(action.file){
                return {
                    ...state,
                    inputFile: action.file,
                    selectedFileName: action.file.name,
                    fileStatus: 'PREPARE_TO_UPLOAD',
                    fileStatusStage: 'Start Upload',
                    chunkFile:[],
                    totalFile:[]
                 }
            }else{
                return {
                    ...state
                }
            }
        case 'FILE_UPLOAD':
            // funcUpload(action.file);
            fileSplit(action.file);
            return {
                ...state,
                fileStatus: 'UPLOADING',
                // fileFromServer: funcUpload(action.file)
            }
        case 'FILE_UPLOAD_PROGRESS':
            return {
                ...state,
                fileStatusStage: action.fileStatusStage,
                fileStatusPercent: action.fileStatusPercent
            }
        case 'FILE_TABLE_DISPLAY':
            return{
                ...state,
                totalFile: state.totalFile.concat(action.chunkList),
                chunkFile: action.chunkList
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
        default : return state;
    }
}
function fileReceiveFunc(state:fileReceive,action:VEPFileReceive){
    switch(action.type){
        case 'VEP_RESULT_NOTPOSTED_CHANGE':
            // console.log('vep_result_notposted_change');
            if(action.fileMd5 === state.fileMd5){
                return{
                    ...state,
                    // data: state.data.concat(action.data)
                    data: JSON.stringify(JSON.parse(state.data).concat(JSON.parse(action.data)))
                }
            }else{
                return{
                    fileMd5: action.fileMd5,
                    data: action.data
                }
            }
        default: return state
    }
}
export default Reducer;