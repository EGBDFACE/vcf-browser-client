import * as React from 'react';
import '../css/ReactTable.scss';

interface Props{
    totalFile: string[][]
}
interface States{
    currentPageNumber: number;
    totalPageNumber: number;
    singlePageDisplayNumber: number;
    inputPageNumber: string;
}

export default class TableFrame extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
        this.renderHeaderCell = this.renderHeaderCell.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.state = {
            currentPageNumber: 1,
            singlePageDisplayNumber: 10,
            totalPageNumber: Math.ceil(this.props.totalFile.length/10),
            inputPageNumber: ''
        }
    }
    componentWillReceiveProps(nextProps: Props){
        if(nextProps.totalFile.length != this.props.totalFile.length){
            this.setState({
                currentPageNumber: 1,
                singlePageDisplayNumber: 10,
                totalPageNumber: Math.ceil(nextProps.totalFile.length/10),
                inputPageNumber: ''
            });
        }
    }
    renderHeaderCell(index:number,value:string){
        return (
            <div className='tableHeaderCell' key={index}>
                <span>{value}</span>
            </div>
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
    Next(){
        this.setState({
            currentPageNumber: this.state.currentPageNumber+1 < 1 ? 1 : this.state.currentPageNumber + 1,
            inputPageNumber: ''
        });
    }
    Previous(){
        this.setState({
            currentPageNumber: this.state.currentPageNumber-1 < 1 ? 1 : this.state.currentPageNumber - 1 ,
            inputPageNumber: ''
        });
    }
    InputPage(value: number){
        if((value <= this.state.totalPageNumber) && ( value >= 0)){
            this.setState({
                inputPageNumber: value ===0 ? '' : value.toString(),
                currentPageNumber: value === 0 ? this.state.currentPageNumber : value
            });
        }else{

        }
    }
    SinglePage(value: number){
        let newPageNumber = Math.ceil(((this.state.currentPageNumber - 1) * this.state.singlePageDisplayNumber ) / value) ;
        this.setState({
            singlePageDisplayNumber: value,
            totalPageNumber: Math.ceil(this.props.totalFile.length / value),
            currentPageNumber: newPageNumber < 1 ? 1 : newPageNumber,
            inputPageNumber: ''
        });
    }
    render(){
        const content= ['Row Index','CHROM','POS','ID','REF','ALT','QUAL','FILTER','INFO'];
        const totalFile = this.props.totalFile;
        const { currentPageNumber, singlePageDisplayNumber, totalPageNumber, inputPageNumber } = this.state;
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
                        {( currentPageNumber <=1 ) ? <span className='tableBtDisable'>Previous</span> : <button onClick={() => this.Previous()}>Previous</button>}
                        {( currentPageNumber >= totalPageNumber ) ? <span className='tableBtDisable'>Next</span> : <button onClick={() => this.Next()}>Next</button>}
                        <span>Page<strong> {currentPageNumber} of {totalPageNumber} </strong></span>
                        <span>| Go to page : <input type='number' value={inputPageNumber} onChange={(e) => this.InputPage( +e.target.value )}></input></span>
                        <select onChange={(e) => this.SinglePage( +e.target.value )}>
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