import * as React from 'react';
import '../index.scss';
import { Grid } from 'react-virtualized';
import { MeasuredCellParent } from 'react-virtualized/dist/es/CellMeasurer';
import store from '../store/store';
import { Column,Table } from 'react-virtualized';
// import 'react-virtualized/style.css';
// import '../../node_modules/react-virtualize/source/style.css';
import '../ReactVirtualized.scss';

interface Props{
    // chunkFile: string[][];
    // totalFile: string[][];
    totalFile: object[];
    chunkFile: object[];
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
// const chunkFile = store.getState().fileUpload.chunkFile;
// console.log(chunkFile);
export default class TabDisplay extends React.Component<Props,States>{
    // static ChunkList : string[][];
    constructor(props:Props){
        super(props);
        // TabDisplay.ChunkList = this.props.chunkFile;
        // this.cellRenderer = this.cellRenderer.bind(this);
    }
    // cellRenderer({columnIndex,isScrolling,isVisible,key,rowIndex,parent,style}:cellRendererArg){
    //     // console.log(this);
    //     // console.log(TabDisplay)
    //     // const chunkFile = TabDisplay.ChunkList;
    //     // const chunkFile = this.props.chunkFile;
    //     const totalFile = this.props.totalFile;
    //     // console.log(chunkFile);
    //     // const user = chunkFile[rowIndex][columnIndex];
    //     // const content = isScrolling ? '...' : <User user= {user}/> ;
    //     return(
    //         <div
    //             key={key}
    //             style={style}    
    //         >
    //         {totalFile[rowIndex][columnIndex]}
    //         {/* {list[rowIndex][columnIndex]} */}
    //         </div>
    //     )
    // }
    // render(){
    //     // console.log(this)
    //     // console.log(this.props.totalFile);
    //     // const chunkFile = this.props.chunkFile;
    //     const totalFile = this.props.totalFile;
    //     // console.log(chunkFile);
    //     return(
    //         <Grid
    //           cellRenderer={this.cellRenderer}
    //           columnCount={totalFile[0]?totalFile[0].length:0}
    //         //   columnCount={list[0].length}
    //           columnWidth={100}
    //           height={300}
    //           rowCount={totalFile?totalFile.length:0}
    //         //   rowCount={list.length}
    //           rowHeight={30}
    //           width={500}
    //           />
    //     )
    // }
    render(){
        const list = this.props.totalFile;
        console.log(list);
        return(
           <Table
            width={500}
            height={300}
            headerHeight={40}
            rowHeight={90}
            rowCount={list.length}
            rowGetter={({ index }) => list[index]}
            >
                {/* <Column
                label='Name'
                dataKey='name'
                width={100}
                /> 
                <Column
                width={200}
                label='Description'
                dataKey='description'
                /> */}
              <Column
                label='CHROM'
                dataKey='CHROM'
                width={150}
                />
              <Column
                label='POS'
                dataKey='POS'
                width={150}
                />
              <Column
                label='ID'
                dataKey='ID'
                width={50}
                />
              <Column
                label='REF'
                dataKey='REF'
                width={50}
                />
              <Column
                label='ALT'
                dataKey='ALT'
                width={50}
                />
              <Column
                label='QUAL'
                dataKey='QUAL'
                width={150}
                />
              <Column
                label='FILTER'
                dataKey='FILTER'
                width={150}
                />
              <Column
                label='INFO'
                dataKey='INFO'
                width={250}
                />
            </Table> 
        )
    }
}

