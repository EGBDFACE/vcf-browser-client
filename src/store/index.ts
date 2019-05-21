import {createStore} from 'redux';
import Reducer from '../reducers';

export interface fileUpload{
    fileLoadPercent: number,
    fileUploadPercent: number,
    totalFile: string[][]
}
export interface fileReceive{
    fileMd5: string,
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
    fileUpload:fileUpload,
    fileReceive: fileReceive,
    userInfo: userInfo
}

export const initialState:StoreState = {
    fileUpload: {
        fileLoadPercent: 0,
        fileUploadPercent: 0,
        totalFile: []
    },
    fileReceive: {
        fileMd5: '',
        data: []
    },
    userInfo: {
        name: '',
        id: '',
        fileList: []
    }
};
let store = createStore(Reducer,initialState);
export default store;