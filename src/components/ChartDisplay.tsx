import * as React from 'react';
// declare function drawDemo():void;
// import drawDemo from '../d3-SvgToWebgl/demo/chords.js'
// const drawDemo = require('../d3-SvgToWebgl/demo/chords.js');
import drawVepResultDiagram from '../assets/vep/drawVep.js';

interface Props{
    data: string,
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
        console.log('component update');
        if((data.length != 0)&&(fileState != 'PREPARE_TO_UPLOAD')){
            // drawDemo();
            // console.log(data);
            // console.log(document.getElementsByTagName('canvas')[0]);
            // console.log(JSON.parse(data));
            drawVepResultDiagram(data);
        }
        // drawDemo();
    }
    render(){
        const { data,fileState } = this.props;
        // console.log(data);
        // console.log(data.length);
        // console.log(fileState);
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