import Hello from '../components/Hello';
import * as actions from '../actions';
import { StoreState } from '../store';
import {connect } from 'react-redux';
import {Dispatch} from 'react';

 function mapStateToProps (state:StoreState){
    //  console.log(state);
    return {
        enthusiasmLevel: state.enthusiasm.enthusiasmLevel, 
        name:state.enthusiasm.languageName
    }
}

 function mapDispatchToProps(dispatch:Dispatch<actions.EnthusiasmAction>){
    return {
        onIncrement: () => dispatch(actions.incrementEnthusiasm()),
        onDecrement: () => dispatch(actions.decrementEnthusiasm())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Hello);