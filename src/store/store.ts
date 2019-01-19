import {createStore} from 'redux';
import {StoreState} from '../types/storeInterface';
import {enthusiasm} from '../reducers/reduceHello';

const store = createStore<StoreState,any,any,any>(enthusiasm,{
    enthusiasmLevel: 1,
    languageName: 'TypeScript'
});
export default store;