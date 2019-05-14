import {createStore} from 'redux';
// import {StoreState} from '../types/storeInterface';
// import {enthusiasm} from '../reducers/reduce';
import Reducer from '../reducers';

// export interface StoreState{
//     languageName:string;
//     enthusiasmLevel: number;
//     uploaded: boolean;
//     uploading: boolean;
//     selectedFileName: string;
//     fileFromServer: object;
// }
export interface enthusiasm{
    languageName: string,
    enthusiasmLevel: number
}
export interface fileUpload{
    fileStatus: string,
    selectedFileName: any,
    inputFile: any,
    // fileFromServer: string[],
    fileStatusPercent: number,
    fileStatusStage: string,
    chunkFile: string[][],
    totalFile: string[][]
    // chunkFile: object [],
    // totalFile: object []
}
export interface tableFrameVCF{
    currentPageNumber: number,
    totalPageNumber: number,
    singlePageDisplayNumber:  number
}
export interface fileReceive{
    fileMd5: string,
    // chunkMd5: string,
    data: any[]
}
export interface userInfo{
    name: string,
    id: string,
    fileList: {
        fileName: string,
        fileMd5: string
    }[]
}
export interface StoreState{
    enthusiasm:enthusiasm,
    fileUpload:fileUpload,
    tableFrameVCF: tableFrameVCF,
    fileReceive: fileReceive,
    userInfo: userInfo
}
// const store = createStore<StoreState,any,any,any>(Reducer,{
//     enthusiasmLevel: 1,
//     languageName: 'TypeScript',
//     uploaded: false,
//     uploading: false
// });

export const initialState:StoreState = {
    enthusiasm: {
        languageName: 'TypeScript',
        enthusiasmLevel: 1
    },
    fileUpload: {
        // uploaded: false,
        // uploading: false,
        fileStatus: 'FILE_NOT_SELECTED',
        // fileStatus: 'UPLOADING',
        selectedFileName: 'Choose a file',
        inputFile: null,
        // fileFromServer: null,
        fileStatusPercent: 0,
        fileStatusStage: 'Start Upload',
        // chunkFile: [],
        totalFile: [],
        chunkFile: []
    },
    tableFrameVCF: {
        currentPageNumber: 1,
        totalPageNumber: 0,
        singlePageDisplayNumber: 10
    },
    fileReceive: {
        fileMd5: '',
        // chunkMd5: '',
        data: []
    },
    userInfo: {
        name: '',
        id: '',
        fileList: []
    }
    // enthusiasmLevel: 1,
    // languageName: 'TypeScript',
    // uploaded: false,
    // uploading: false,
    // selectedFileName: 'Choose a file',
    // fileFromServer: null
};
let store = createStore(Reducer,initialState);
// const store = createStore(enthusiasm);
export default store;