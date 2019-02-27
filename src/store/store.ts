import {createStore} from 'redux';
// import {StoreState} from '../types/storeInterface';
// import {enthusiasm} from '../reducers/reduce';
import Reducer from '../reducers/reduce';

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
    fileFromServer: object,
    fileStatusPercent: number,
    fileStatusStage: string,
    chunkFile: string[][],
    // totalFile: string[][]
}
export interface StoreState{
    enthusiasm:enthusiasm,
    fileUpload:fileUpload
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
        fileFromServer: null,
        fileStatusPercent: 0,
        fileStatusStage: 'Start Upload',
        chunkFile: []
        // totalFile: null
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