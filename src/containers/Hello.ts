import Hello from '../components/Hello';
import * as actions from '../actions/actionHello';
import {StoreState} from '../types/storeInterface';
import {connect } from 'react-redux';
import {Dispatch} from 'react';

 function mapStateToProps ({enthusiasmLevel,languageName}:StoreState){
    return {
        enthusiasmLevel,
        name:languageName
    }
}

 function mapDispatchToProps(dispatch:Dispatch<actions.EnthusiasmAction>){
    return {
        onIncrement: () => dispatch(actions.incrementEnthusiasm()),
        onDecrement: () => dispatch(actions.decrementEnthusiasm())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Hello);