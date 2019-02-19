import {createStore} from 'redux';
// import {StoreState} from '../types/storeInterface';
// import {enthusiasm} from '../reducers/reduce';
import Reducer from '../reducers/reduce';

export interface StoreState{
    languageName:string;
    enthusiasmLevel: number;
    uploaded: boolean;
    uploading: boolean;
    selectedFileName: string;
}
// const store = createStore<StoreState,any,any,any>(Reducer,{
//     enthusiasmLevel: 1,
//     languageName: 'TypeScript',
//     uploaded: false,
//     uploading: false
// });

const initialState:StoreState = {
    enthusiasmLevel: 1,
    languageName: 'TypeScript',
    uploaded: false,
    uploading: false,
    selectedFileName: 'Choose a file'
};

let store = createStore(Reducer,initialState);
// const store = createStore(enthusiasm);
export default store;