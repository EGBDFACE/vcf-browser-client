import * as React from 'react';
import '../ReactTable.scss';
import TableFrameHeaderCell from './TableFrameHeaderCell';

interface Props{

}
interface States{
    content: string[];
}

export default class TableFrame extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
        this.renderHeaderCell = this.renderHeaderCell.bind(this);
        this.state = {
            content: ['Row Index','CHROM','POS','ID','REF','ALT','QUAL','FILTER','INFO']
        }
    }
    renderHeaderCell(index:number,value:string){
        console.log(value);
        return (
            <TableFrameHeaderCell content={value} key={index}/>
        )
    }
    render(){
        // const content = this.state.content[0];
        return(
            <div className='tableArea'>
                <div className='tableHeader'>
                    {this.state.content.map((value,index)=>this.renderHeaderCell(index,value))}
                </div>
                <div className='tableFooter'>
                    <button>Previous</button>
                    <button>Next</button>
                    <span>Page<strong> 1 of 100 </strong></span>
                    <span>| Go to page : <input value='100' type='number'></input></span>
                    <select>
                        <option value='10'>Show 10</option>
                        <option value='20'>Show 20</option>
                        <option value='30'>Show 30</option>
                        <option value='40'>Show 40</option>
                        <option value='50'>Show 50</option>
                    </select>
                </div>
            </div>
        )
    }
}