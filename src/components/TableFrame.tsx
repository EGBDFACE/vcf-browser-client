import * as React from 'react';
import '../ReactTable.scss';
import TableFrameHeaderCell from './TableFrameHeaderCell';

interface Props{
    totalFile: string[][],
    currentPageNumber: number,
    totalPageNumber: number,
    singlePageDisplayNumber: number,
    Next?: () => void,
    Previous?: () => void,
    InputPage?: (totalPageNumber:number,page:number) => void,
    SinglePage?: (rows:number) => void 
    // InputPage?: () => void
}
interface States{
    // currentPageNumber: number;
    totalPageNumber: number;
    // singlePageDisplayNumber: number;
}

export default class TableFrame extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
        this.renderHeaderCell = this.renderHeaderCell.bind(this);
        this.renderContent = this.renderContent.bind(this);
        // this.state = {
        //     currentPageNumber: 1,
        //     singlePageDisplayNumber: 10,
        //     totalPageNumber: Math.ceil(this.props.totalFile.length/this.props.singlePageDisplayNumber)
        // }
    }
    renderHeaderCell(index:number,value:string){
        return (
            <TableFrameHeaderCell content={value} key={index}/>
        )
    }
    renderContent(index:number,value:string[]){
        let oddEvenDif = [
            {
                backgroundColor:'#f0e5e6',
                background: 'rgba(42,117,146,0.12)',
                color: '#4b0f31'
            },
            {
                backgroundColor: '#f0e5e6',
                color: '#4b0f31'
            }
        ];
        return(
            <div className='tableHeader' style={oddEvenDif[index%2]} key={index}> 
                {value.map((value,index)=>this.renderHeaderCell(index,value))}
            </div>
        )
    }
    // componentWillReceiveProps(nextProps:Props){
    //     this.setState({
    //         totalPageNumber: Math.ceil(nextProps.totalFile.length/nextProps.singlePageDisplayNumber)
    //     });
    // }
    // handleFooterInputChange(e:any){
    //     if((e.target.value <= this.props.totalPageNumber)&&(e.target.value >= 1)){
    //         store.dispatch
    //     }
    // }
    render(){
        const content= ['Row Index','CHROM','POS','ID','REF','ALT','QUAL','FILTER','INFO'];
        const {totalFile,currentPageNumber,singlePageDisplayNumber,totalPageNumber,Next,Previous,InputPage,SinglePage} = this.props;
        // const totalPageNumber = this.state.totalPageNumber;
        const currentArray:string[][] = totalFile.slice((currentPageNumber-1)*singlePageDisplayNumber,currentPageNumber*singlePageDisplayNumber+1);
        if(totalFile.length != 0){
            return(
                <div className='TableDisplay'>
                    <div className='tableArea'>
                    <div className='tableHeader'>
                        {content.map((value,index)=>this.renderHeaderCell(index,value))}
                    </div>
                    {currentArray.map((value,index)=>this.renderContent(index,value))}
                    <div className='tableFooter'>
                        {(currentPageNumber <=1 )?<span className='tableBtDisable'>Previous</span>:<button onClick={Previous}>Previous</button>}
                        {(currentPageNumber >= totalPageNumber)?<span className='tableBtDisable'>Next</span>:<button onClick={Next}>Next</button>}
                        <span>Page<strong> {currentPageNumber} of {totalPageNumber} </strong></span>
                        <span>| Go to page : <input type='number' onChange={(e)=>InputPage(totalPageNumber,+e.target.value)}></input></span>
                        <select onChange={(e)=>SinglePage(+e.target.value)}>
                            <option value='10'>Show 10</option>
                            <option value='20'>Show 20</option>
                            <option value='30'>Show 30</option>
                            <option value='40'>Show 40</option>
                            <option value='50'>Show 50</option>
                        </select>
                    </div>
                 </div>
                </div> 
            )
        }else{
            return null;
        }
    }
}