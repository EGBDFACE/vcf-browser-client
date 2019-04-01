import * as React from 'react';
// declare function drawDemo():void;
// import drawDemo from '../d3-SvgToWebgl/demo/chords.js'
// const drawDemo = require('../d3-SvgToWebgl/demo/chords.js');
import drawVepResultDiagram from '../assets/vep/drawVep.js';
import * as vepData from '../assets/vep/vepData';
const d3Queue = require('d3-queue');

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
            d3Queue.queue()
                .defer(vepData.get_all_variant_chrom,JSON.parse(data))
                .defer(vepData.get_geno_data)
                .defer(vepData.get_variant_data,JSON.parse(data))
                .defer(vepData.get_meta_data,JSON.parse(data))
                .await(function(error:any){
                    if(error) throw error;
                    d3Queue.queue()
                        .defer(vepData.get_layout_data)
                        .defer(vepData.get_highlight_data,JSON.parse(data))
                        .await(function(error:any){
                            if(error) throw error;
                            drawVepResultDiagram();
                        })
                })
        }
    }
            // let main_queue = d3Queue.queue();
            // main_queue = main_queue.defer(vepData.get_geno_data);
            // console.log(vepData.geno_data);
            // main_queue = main_queue.defer(vepData.get_all_variant_chrom,JSON.parse(data));
            // console.log(vepData.all_variant_chrom);
            // main_queue = main_queue.defer(vepData.get_layout_data);
            // console.log(vepData.layout_data);
            // main_queue = main_queue.defer(vepData.get_variant_data,JSON.parse(data));
            // main_queue = main_queue.defer(vepData.get_meta_data,JSON.parse(data));
            // main_queue.await(function(error:any){
            //     if(error) throw error;
            //     console.log('await');
            //     console.log(vepData.geno_data);
            //     console.log(vepData.all_variant_chrom);
                // console.log(vepData.geno_data);
                // console.log(vepData.layout_data);
                // console.log(vepData.metalr_rankscore_data);
                // console.log(vepData.metasvm_rankscore_data);
                // let short_queue = d3Queue.queue();
                // short_queue.defer(vepData.get_highlight_data,JSON.parse(data));
                // short_queue.await(function(error:any){
                //     if(error) throw error;
                //     console.log(vepData.highlight_data);
                // })
            // });
            // console.log('finish');
            // const most_vep_data_promise = new Promise(function(resolve,reject){
            //     console.log('get_most_vep_data_promose');
            //     vepData.get_all_variant_chrom(JSON.parse(data));
            //     vepData.get_layout_data();
            //     vepData.get_geno_data();
            //     // vepData.get_highlight_data(JSON.parse(data));
            //     vepData.get_variant_data(JSON.parse(data));
            //     vepData.get_meta_data(JSON.parse(data));
            //     if(!Object.keys(vepData.geno_data).length){
            //         console.log('get_most_vep_data resolve');
            //         resolve();
            //     }
            // });
            // most_vep_data_promise.then(function(){
            //     console.log('get most vep data then()');
            //     const vep_highlight_data_promise = new Promise(function(resolve,reject){
            //         console.log('get vep highlight data promose');
            //         vepData.get_highlight_data();
            //         if(!vepData.highlight_data.length){
            //             console.log('get vep highlight data resolve');
            //             resolve();
            //         }
            //     });
            //     vep_highlight_data_promise.then(function(){
            //         console.log('get vep highlight data then()');
            //         console.log(vepData.all_variant_chrom);
            //         console.log(vepData.geno_data);
            //         console.log(vepData.highlight_data);
            //         console.log(vepData.layout_data);
            //         console.log(vepData.metalr_rankscore_data);
            //         console.log(vepData.metasvm_rankscore_data);
            //         // if((data.length != 0)&&(fileState != 'PREPARE_TO_UPLOAD')){
            //         //     drawVepResultDiagram();
            //         // }
            //     })
            // })
        // }
        // if((data.length != 0)&&(fileState != 'PREPARE_TO_UPLOAD')){
        //     // drawDemo();
        //     // console.log(data);
        //     // console.log(document.getElementsByTagName('canvas')[0]);
        //     // console.log(JSON.parse(data));
        //     drawVepResultDiagram(data);
        // }
        // drawDemo();
    // }
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