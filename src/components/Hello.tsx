import * as React from 'react';

export interface Props {
    name: string;
    enthusiasmLevel?:number;
    onIncrement?: ()=> void;
    onDecrement?: ()=> void;
}
function getExclamationMarks(numChars:number){
    return Array(numChars+1).join('!');
}
class Hello extends React.Component<Props,object>{
    constructor(props:Props){
        super(props);
    }
    render(){
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
            </div>
        )
    }
}
export default Hello;
