import * as React from 'react';
// declare function drawDemo():void;
// import drawDemo from '../d3-SvgToWebgl/demo/chords.js'
// const drawDemo = require('../d3-SvgToWebgl/demo/chords.js');
import drawVepResultDiagram from '../assets/vep/drawVep.js';
import * as resData from '../assets/vep/vepData';

const d3Queue = require('d3-queue');

import line from '../assets/test/line.js';

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
    //     line();
    // }   
    componentDidUpdate(){
        const { data,fileState } = this.props; 
        console.log('component update');
        if((data.length != 0)&&(fileState != 'PREPARE_TO_UPLOAD')){
            console.log(data);
            resData.getDetailData(data);
            resData.getLayoutData().then(()=>{
                console.log(resData.variant_data);
                console.log(resData.metalr_rankscore_data);
                console.log(resData.metasvm_rankscore_data);
                drawVepResultDiagram();
            })
            // console.log(data);
            // d3Queue.queue()
            //     .defer(vepData.get_all_variant_chrom,JSON.parse(data))
            //     .defer(vepData.get_geno_data)
            //     .defer(vepData.get_variant_data,JSON.parse(data))
            //     .defer(vepData.get_meta_data,JSON.parse(data))
            //     .await(function(error:any){
            //         if(error) throw error;
            //         d3Queue.queue()
            //             .defer(vepData.get_layout_data)
            //             .defer(vepData.get_highlight_data,JSON.parse(data))
            //             .await(function(error:any){
            //                 if(error) throw error;
            //                 drawVepResultDiagram();
            //             })
            //     })
        }
    }
    render(){
        const { data,fileState } = this.props;
        // console.log(data);
        // console.log(data.length);
        // console.log(fileState);
        // if((data.length != 0)&&(fileState != 'PREPARE_TO_UPLOAD')){
            return(
                <div className='chartDisplay'>
                    <canvas width='800' height='800'></canvas>
                </div>
            )
        // }else{
        //     return null
        // }
    }
}