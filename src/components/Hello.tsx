import * as React from 'react';

export interface Props {
    name: string;
    enthusiasmLevel?:number;
    onIncrement?: ()=> void;
    onDecrement?: ()=> void;
    nameadd: string;
}
interface States{}
function getExclamationMarks(numChars:number){
    return Array(numChars+1).join('!');
}
class Hello extends React.Component<Props,object>{
    constructor(props:Props){
        super(props);
    }
    shouldComponentUpdate(nextProps:Props,nextState:States):boolean{
        // for(let i = 0;)
        console.log(this.props);
        console.log('shouldComponentUpdate');
        return true;
    }
    componentWillReceiveProps(){
        console.log('componentWillReceiveProps');
        console.log(this.props);
    }
    render(){
        console.log(this.props);
        const {name, enthusiasmLevel =1, onIncrement,onDecrement} = this.props;
        // console.log(this.props)
        if(enthusiasmLevel <= 0){
            throw new Error('error from enthusiasm<0');
        }
        return (
            <div>
                <div>Hello,{name+getExclamationMarks(enthusiasmLevel)}</div>
                <div>
                    <button onClick = {onDecrement}>-</button>
                    <button onClick = {onIncrement}>+</button>
                </div>
                <div>{this.props.nameadd}</div>
            </div>
        )
    }
}
export default Hello;
