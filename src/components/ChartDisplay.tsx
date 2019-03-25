import * as React from 'react';
// declare function drawDemo():void;
import drawDemo from '../d3-SvgToWebgl/demo/chords.js'
// const drawDemo = require('../d3-SvgToWebgl/demo/chords.js');

interface Props{
    data: string[],
    fileState: string
}
interface States{}

export default class ChartDisplay extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
    }
    // componentDidMount(){
    componentDidUpdate(){
        const { data,fileState } = this.props; 
        // console.log('component mount');
        if((data.length != 0)&&(fileState != 'PREPARE_TO_UPLOAD')){
            drawDemo();
        }
        // drawDemo();
    }
    render(){
        const { data,fileState } = this.props;
        console.log(data);
        console.log(data.length);
        console.log(fileState);
        if((data.length != 0)&&(fileState != 'PREPARE_TO_UPLOAD')){
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