import BaseRenderer from '../../d3-SvgToWebgl/Renderer/BaseRenderer';
import Circos from '../../d3-SvgToWebgl/Core/Circos/src/circos.js';
const d3 = Object.assign({},require('d3-queue'),require('d3-request'),require('d3-array'));
import defaultConfigs from '../../d3-SvgToWebgl/Config';
import { scaleQuantize } from 'd3';

import * as vepData from './vepData.js';

export default function drawVepResultDiagram(){
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    new VEPCircularRender(document.getElementsByTagName('canvas')[0],{
        // bgColor: 0xF4F4F4
        // bgColor: 0xdfc8ca
        bgColor: 0xf1e5e6
    }).drawVEP();
}
 
class VEPCircularRender extends BaseRenderer{
    constructor(elem,options){
        super(elem,options);
    }
    drawVEP(){
        const width = this.renderer.view.width/this.renderer.resolution;
        const height = this.renderer.view.height/this.renderer.resolution;

        const circos = Circos({
            container: this.renderer.view,
            renderer: this.renderer,
            width: width,
            height: height
        });
        
        const gieStainColor = defaultConfigs.circular.gieStainColor;
        
        var circular = circos.layout(vepData.layout_data,{
            innerRadius: 400,
            outerRadius: 420,
            labels: {
                display: true,
                radialOffset: 26
            },
            opacity: 1,
            ticks: {
                display: true,
                labelDenominator: 1000000,
                labelSuffex: 'M',
                labelSpacing: 10,
                labelDisplay0: false
            },
            tooltipContent: function(d){
                return [{
                    title: 'Chrom',
                    value: d.label
                }]
            }
        });


            circular = circular.highlight('Gene',vepData.highlight_data,{
                innerRadius: 360,
                outerRadius: 380,
                opacity: 0.6,
                color: '#4b0f31',
                tooltipContent: function(d){
                    // console.log(d);
                    return[{
                        title: 'Chrom',
                        value: d.block_id 
                    },{
                        title: 'start',
                        value: d.preserve_start
                    },{
                        title: 'end',
                        value: d.preserve_end
                    }]
                }
            });

            circular = circular.line('variant',vepData.variant_data,{
                innerRadius: 0.77 / 0.95,
                outerRadius: 0.9 / 0.95,
                maxSpace: 1000000,
                min: 0.0001,
                max: 0.1,
                color: '#000',
                tooltipContent: function(d){
                    console.log(d);
                    if(d.start != d.end){
                        return{
                            title: 'snv'
                        }
                    }else{
                        return{
                            title: 'structural variant'
                        }
                    }
                }
            })
        
            
            circular = circular.scatter('MetaLR_rankscore',vepData.metalr_rankscore_data,{
                innerRadius: 0.49 / 0.95,
                outerRadius: 0.75 / 0.95,
                
                color: function(d){
                    // console.log(d);
                    if(d.value > 0.9634){ return '#f44336';}
                    else { return '#3f51b5';}
                },
                strokeColor: function(d){
                    // console.log(d);
                    if(d.value > 0.9634){ return '#f44336';}
                    else { return '#3f51b5';}
                },
                strokeWidth: 0.5,
                fillOpacity: 1,
                shape: 'circle',
                size: 1.2 * Math.PI,
                min: 0,
                max: 1,
                axes: [{
                    position: 0,
                    thickness: 0.5,
                    color: '#DC4035',
                    opacity: 0.3
                },{
                    position: 0.5,
                    thickness: 0.5,
                    color: '#DC4035',
                    opacity: 0.5
                },{
                    position: 1,
                    thickness: 0.5,
                    color: '#DC4035',
                    opacity: 0.8
                }],
                backgrounds: [{
                    start: 0,
                    end: 0.01,
                    color: '#DC4035',
                    opacity: 0.06
                }],
                tooltipContent: function(d){
                    // console.log(d);
                    return[{
                        title: 'Chrom',
                        value: d.block_id
                    },{
                        title: 'MetaLR_rankscore',
                        value: d.value
                    }]
                }
            });

            circular = circular.heatmap('MetaSVM_rankscore',vepData.metasvm_rankscore_data,{
                innerRadius: 0.1 / 0.95,
                outerRadius: 0.45 / 0.95,
                logScale: false,
                color: function(d,min,max){
                    return scaleQuantize().domain([min,max]).range(['#0000FF','#4169E1','#7B68EE','#6495ED','#1E90FF','#00BFFF','#87CEFA','#87CEEB','#ADD8E6','#B0E0E6','#FFA07A','#FA8072','#E9967A','#CD5C5C','#DC143C','#FF0000'])(d.value)
                } || 'YlOrRd',
                tooltipContent: function(d){
                    return[{
                        title: 'Chrom',
                        value: d.block_id
                    },{
                        title: 'MetaSVM_rankscore',
                        value: d.value
                    }]
                }
            });
    
            circular.render();
    
    }
}
        
        