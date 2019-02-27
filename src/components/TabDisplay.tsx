import * as React from 'react';
import '../index.scss';
import { Grid } from 'react-virtualized';

interface Props{
    chunkFile: string[][];
    totalFile: string[][];
}
interface States{

}
interface cellRendererArg{
    columnIndex:number;
    rowIndex: number;
    key: number;
    style: object;
}
export default class TabDisplay extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
    }
    render(){
        return(
            <div></div>
        )
    }
}

function cellRenderer({columnIndex,key,rowIndex,style}:cellRendererArg){
    return(
        <div
            key={key}
            style={style}    
        >
        {}
        </div>
    )
}