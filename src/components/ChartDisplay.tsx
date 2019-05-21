import * as React from 'react';
import draw from '../utils/chartDisplay/draw';

interface Props{
    data: any[],
    fileState: string
}
interface States{}

export default class ChartDisplay extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
    }

    componentDidUpdate(){
        const { data,fileState } = this.props; 
        // if((data.length != 0)&&(fileState != 'PREPARE_TO_UPLOAD')){
        if((data.length != 0)&&(fileState == 'FILE_NOT_SELECTED')){
            console.log(data);
            draw(data);
        }
    }
    render(){
        const { data,fileState } = this.props;
        // console.log(data);
        // console.log(data.length);
        // console.log(fileState);
        // if((data.length != 0)&&(fileState != 'PREPARE_TO_UPLOAD')){
        if((data.length != 0)&&(fileState == 'FILE_NOT_SELECTED')){
            return(
                <div className='chartDisplay'>
                    <canvas width='800' height='800'></canvas>
                </div>
            )
        }else{
            return null
        }
    }
}