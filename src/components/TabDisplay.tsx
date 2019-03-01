import * as React from 'react';
import '../index.scss';
import { Grid } from 'react-virtualized';
import { MeasuredCellParent } from 'react-virtualized/dist/es/CellMeasurer';
import store from '../store/store';

interface Props{
    chunkFile: string[][];
    totalFile: string[][];
}
interface States{

}
interface cellRendererArg{
    columnIndex:number;
    isScrolling: boolean;
    isVisible: boolean;
    key: string;
    parent: MeasuredCellParent;
    rowIndex: number;
    style: React.CSSProperties;
}
// const list = [
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95125 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95121 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95123 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95126 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95127 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95128 ],
//     ['Brian Vaughn', 'Software Engineer', 'San Jose', 'CA', 95129 ]
//   ];
// const chunkFile = store.getState().fileUpload.chunkFile;
// console.log(chunkFile);
export default class TabDisplay extends React.Component<Props,States>{
    // static ChunkList : string[][];
    constructor(props:Props){
        super(props);
        // TabDisplay.ChunkList = this.props.chunkFile;
        this.cellRenderer = this.cellRenderer.bind(this);
    }
    cellRenderer({columnIndex,isScrolling,isVisible,key,rowIndex,parent,style}:cellRendererArg){
        // console.log(this);
        // console.log(TabDisplay)
        // const chunkFile = TabDisplay.ChunkList;
        // const chunkFile = this.props.chunkFile;
        const totalFile = this.props.totalFile;
        // console.log(chunkFile);
        // const user = chunkFile[rowIndex][columnIndex];
        // const content = isScrolling ? '...' : <User user= {user}/> ;
        return(
            <div
                key={key}
                style={style}    
            >
            {totalFile[rowIndex][columnIndex]}
            {/* {list[rowIndex][columnIndex]} */}
            </div>
        )
    }
    render(){
        // console.log(this)
        // console.log(this.props.totalFile);
        // const chunkFile = this.props.chunkFile;
        const totalFile = this.props.totalFile;
        // console.log(chunkFile);
        return(
            <Grid
              cellRenderer={this.cellRenderer}
              columnCount={totalFile[0]?totalFile[0].length:0}
            //   columnCount={list[0].length}
              columnWidth={100}
              height={300}
              rowCount={totalFile?totalFile.length:0}
            //   rowCount={list.length}
              rowHeight={30}
              width={500}
              />
        )
    }
}

