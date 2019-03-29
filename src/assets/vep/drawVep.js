import BaseRenderer from '../../d3-SvgToWebgl/Renderer/BaseRenderer';
import Circos from '../../d3-SvgToWebgl/Core/Circos/src/circos.js';
const d3 = Object.assign({},require('d3-queue'),require('d3-request'),require('d3-array'));
import defaultConfigs from '../../d3-SvgToWebgl/Config';
import { scaleQuantize } from 'd3';
// import GRCh38_JSON from '../../assets/vep/10GRCh38.json';
// import Gene_GRCh38 from '../../assets/vep/geno_position_GRCh38.txt';

const GRCh38_JSON = require('../../assets/vep/10GRCh38.json');
const Gene_GRCh38 = require('../../assets/vep/geno_position_GRCh38.txt');

export default function drawVepResultDiagram(data){
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    new VEPCircularRender(document.getElementsByTagName('canvas')[0],{
        // bgColor: 0xF4F4F4
        // bgColor: 0xdfc8ca
        bgColor: 0xf1e5e6
    }).drawVEP(JSON.parse(data));
}

class VEPCircularRender extends BaseRenderer{
    constructor(elem,options){
        super(elem,options);
    }
    drawVEP(vepResult){
        const width = this.renderer.view.width/this.renderer.resolution;
        const height = this.renderer.view.height/this.renderer.resolution;
        // console.log(this.renderer.view.width);
        // console.log(this.renderer.view.height);
        // console.log(this.renderer.resolution);
        const circos = Circos({
            container: this.renderer.view,
            renderer: this.renderer,
            width: width,
            height: height
        });
        
        const gieStainColor = defaultConfigs.circular.gieStainColor;
        
        let layoutData = [],
            highlightData = [],
            all_variant_chrom = [];

        for(let i =0;i<vepResult.length;i++){
            if(!all_variant_chrom.length){
                all_variant_chrom.push(vepResult[i].seq_region_name);
            }else{
                if(all_variant_chrom.indexOf(vepResult[i].seq_region_name) === -1){
                    all_variant_chrom.push(vepResult[i].seq_region_name);
                }
            }
        }
        
        console.log(all_variant_chrom);

        d3.json(GRCh38_JSON,d=>{
            layoutData = d.filter(value=>{
                for(let i=0;i<all_variant_chrom.length;i++){
                    if(value.id === 'chr'+all_variant_chrom[i]){
                        return value
                    }
                }
            })

            var circular = circos.layout(layoutData,{
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

            let sortVepResult = vepResult.sort(compare);
            
            d3.tsv(Gene_GRCh38,d=>{
                d.sort(compare);
                console.log(d);
    
                for(let i=0;i<d.length;i++){
                    for(let j=0;j<sortVepResult.length;j++){
                        // if((d[i].txStart)&&(d[i].txEnd)&&(sortVepResult[j].start)&&(sortVepResult[j].end)){
                        if((d[i].txStart <= sortVepResult[j].start)&&(d[i].txEnd >= sortVepResult[j].end)){
                            highlightData.push({
                                block_id: d[i].chrom,
                                start: d[i].txStart,
                                end: d[i].txEnd,
                                value: 0
                            });
                        }
                        if(d[i].txStart > sortVepResult[j].start){break;}
                        // }
                    }
                }

                circular = circular.highlight('Gene',highlightData,{
                    innerRadius: 300,
                    outerRadius: 320,
                    opacity: 0.6,
                    color: '#000',
                    tooltipContent: function(d){
                        return[{
                           title: 'Chrom',
                           value: d.chrom 
                        },{
                            title: 'start',
                            value: d.txStart
                        },{
                            title: 'end',
                            value: d.txEnd
                        }]
                    }
                });

                circular = circular.line('variant',vepResult.map(value=>{
                    return{
                        block_id: 'chr'+value.seq_region_name,
                        start: value.start,
                        end: value.end,
                        position: value.start,
                        value: 0.01
                    }
                }),{
                    innerRadius: 0.77 / 0.95,
                    outerRadius: 0.9 / 0.95,
                    maxSpace: 1000000,
                    min: 0.0001,
                    max: 0.1,
                    color: '#000',
                    tooltipContent: function(d){
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
            
                let MetaLRData = [],MetaSVMData = [];

                for(let i=0;i<vepResult.length;i++){
                    if(vepResult[i].transcript_consequence){
                        if(JSON.stringify(vepResult[i].transcript_consequences).indexOf('metalr_rankscore') != -1){
                            let tempCommonObj ={
                                block_id: 'chr' + vepResult[i].seq_region_name,
                                start: vepResult[i].start,
                                end: vepResult[i].end,
                                position: parseInt((vepResult[i].start+vepResult[i].end)/2)
                            };
                            let temp_MetaLR_rankscore = 0, temp_MetaSVM_rankscore = 0;
                            for(let j=0;j<vepResult[i].transcript_consequence.length;j++){
                                if(vepResult[i].transcript_consequence[j].metalr_score){
                                    temp_MetaLR_rankscore = vepResult[i].transcript_consequence[j].metalr_rankscore;
                                    temp_MetaSVM_rankscore = vepResult[i].transcript_consequence[j].metasvm_rankscore;
                                    break;
                                }
                            }
                            MetaLRData.push({
                                ...tempCommonObj,
                                value: temp_MetaLR_rankscore
                            });
                            MetaSVMData.push({
                                ...tempCommonObj,
                                value: temp_MetaSVM_rankscore
                            });
                        }
                    }
                }

                circular = circular.scatter('MetaLR_rankscore',MetaLRData,{
                    innerRadius: 0.49 / 0.95,
                    outerRadius: 0.75 / 0.95,
                    // color: '#000' || function(d){
                    //     console.log(d);
                    //     for(let j=0;j<d.transcript_consequence.length;j++){
                    //         let temp_metalr_rankscore = d.transcript_consequence[j].metalr_rankscore;
                    //         if(temp_metalr_rankscore){
                    //             if(temp_metalr_rankscore > 0.9436){
                    //                 return '#f44336';
                    //             }else{
                    //                 return '#3f51b5';
                    //             }
                    //         }
                    //     }
                    // },
                    color: function(d){
                        if(d.value > 0.9436){ return '#f44336';}
                        else { return '#3f51b5';}
                    },
                    strokeColor: '#3247A6',
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
                        console.log(d);
                        return[{
                            title: 'Chrom',
                            value: d.block_id
                        },{
                            title: 'MetaLR_rankscore',
                            value: d.value
                        }]
                    }
                });

                circular = circular.heatmap('MetaSVM_rankscore',MetaSVMData,{
                    innerRadius: 0.1 / 0.95,
                    outerRadius: 0.45 / 0.95,
                    color: function(d,min,max){
                        return scaleQuantize()
                            .domain([min,max])
                            .range(['0000FF','#4169E1','#7B68EE','#6495ED','#1E90FF','#00BFFF','#87CEFA','#87CEEB','#ADD8E6','#B0E0E6','#FFA07A','#FA8072','#E9967A','#CD5C5C','#DC143C','#FF0000'])(d.value)
                    },
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
            })

        });
        
        console.log(layoutData);

        var compare = function(obj1,obj2){
            var value1 = obj1.start || obj1.txStart;
            var value2 = obj2.start || obj2.txStart;
            return value1>value2?1:(value1 < value2?-1:0);
        }
        
        // console.log(vepResult);

        // let sortVepResult = vepResult.sort(compare);
        
        // console.log(sortVepResult);
        // console.log(vepResult);

        // d3.tsv(Gene_GRCh38,d=>{
        //     d.sort(compare);
        //     console.log(d);

        //     for(let i=0;i<d.length;i++){
        //         for(let j=0;j<sortVepResult.length;j++){
        //             // if((d[i].txStart)&&(d[i].txEnd)&&(sortVepResult[j].start)&&(sortVepResult[j].end)){
        //             if((d[i].txStart <= sortVepResult[j].start)&&(d[i].txEnd >= sortVepResult[j].end)){
        //                 highlightData.push({
        //                     block_id: d[i].chrom,
        //                     start: d[i].txStart,
        //                     end: d[i].txEnd,
        //                     value: 0
        //                 });
        //             }
        //             if(d[i].txStart > sortVepResult[j].start){break;}
        //             // }
        //         }
        //     }
            
        //     console.log(highlightData);
            
        //     // highlightData = d.filter(value=>{
        //     //     for(let i=0;i<sortVepResult.length;i++){
        //     //         if((value.txStart <= sortVepResult[i].start)&&(value.txEnd >= sortVepResult[i].end)){
        //     //             return value;
        //     //             // return {
        //     //             //     block_id : value.chrom,
        //     //             //     start : value.txStart,
        //     //             //     end : value.txEnd,
        //     //             //     value : 0
        //     //             // }
        //     //         }
        //     //         if(value.txStart > sortVepResult[i].start){break;}
        //     //     }
        //     // })
        //     // highlightData = highlightData.map(value=>{
        //     //     return{
        //     //         block_id: value.chrom,
        //     //         start: value.txS
        //     //     }
        //     // })
        // })

        // let circular = circos.layout(layoutData,{
        //     innerRadius: 400,
        //     outerRadius: 420,
        //     labels: {
        //         display: true,
        //         radialOffset: 26
        //     },
        //     opacity: 1,
        //     ticks: {
        //         display: true,
        //         labelDenominator: 1000000,
        //         labelSuffex: 'M',
        //         labelSpacing: 10,
        //         labelDisplay0: false
        //     },
        //     tooltipContent: function(d){
        //         return [{
        //             title: 'Chrom',
        //             value: d.label
        //         }]
        //     }
        // });

        // circular = circular.highlight('Gene',highlightData,{
        //     innerRadius: 300,
        //     outerRadius: 320,
        //     opacity: 0.6,
        //     color: '#000',
        //     tooltipContent: function(d){
        //         return[{
        //            title: 'Chrom',
        //            value: d.chrom 
        //         },{
        //             title: 'start',
        //             value: d.txStart
        //         },{
        //             title: 'end',
        //             value: d.txEnd
        //         }]
        //     }
        // });

        // circular = circular.line('variant',vepResult.map(value=>{
        //         return{
        //             block_id: 'chr'+value.seq_region_name,
        //             start: value.start,
        //             end: value.end,
        //             position: value.start,
        //             value: 0.01
        //         }
        //     }),{
        //         innerRadius: 0.77 / 0.95,
        //         outerRadius: 0.9 / 0.95,
        //         maxSpace: 1000000,
        //         min: 0.0001,
        //         max: 0.1,
        //         color: '#000',
        //         tooltipContent: function(d){
        //             if(d.start != d.end){
        //                 return{
        //                     title: 'snv'
        //                 }
        //             }else{
        //                 return{
        //                     title: 'structural variant'
        //                 }
        //             }
        //         }
        //     })
        
        // let MetaLRData = [],MetaSVMData = [];

        // for(let i=0;i<vepResult.length;i++){
        //     if(vepResult[i].transcript_consequence){
        //         if(JSON.stringify(vepResult[i].transcript_consequences).indexOf('metalr_rankscore') != -1){
        //             let tempCommonObj ={
        //                 block_id: 'chr' + vepResult[i].seq_region_name,
        //                 start: vepResult[i].start,
        //                 end: vepResult[i].end,
        //                 position: parseInt((vepResult[i].start+vepResult[i].end)/2)
        //             };
        //             let temp_MetaLR_rankscore = 0, temp_MetaSVM_rankscore = 0;
        //             for(let j=0;j<vepResult[i].transcript_consequence.length;j++){
        //                 if(vepResult[i].transcript_consequence[j].metalr_score){
        //                     temp_MetaLR_rankscore = vepResult[i].transcript_consequence[j].metalr_rankscore;
        //                     temp_MetaSVM_rankscore = vepResult[i].transcript_consequence[j].metasvm_rankscore;
        //                     break;
        //                 }
        //             }
        //             MetaLRData.push({
        //                 ...tempCommonObj,
        //                 value: temp_MetaLR_rankscore
        //             });
        //             MetaSVMData.push({
        //                 ...tempCommonObj,
        //                 value: temp_MetaSVM_rankscore
        //             });
        //         }
        //     }
        // }

        // console.log(MetaLRData);
        // console.log(MetaSVMData);

        // circular = circular.scatter('MetaLR_rankscore',MetaLRData,{
        //         innerRadius: 0.49 / 0.95,
        //         outerRadius: 0.75 / 0.95,
        //         // color: '#000' || function(d){
        //         //     console.log(d);
        //         //     for(let j=0;j<d.transcript_consequence.length;j++){
        //         //         let temp_metalr_rankscore = d.transcript_consequence[j].metalr_rankscore;
        //         //         if(temp_metalr_rankscore){
        //         //             if(temp_metalr_rankscore > 0.9436){
        //         //                 return '#f44336';
        //         //             }else{
        //         //                 return '#3f51b5';
        //         //             }
        //         //         }
        //         //     }
        //         // },
        //         color: function(d){
        //             if(d.value > 0.9436){ return '#f44336';}
        //             else { return '#3f51b5';}
        //         },
        //         strokeColor: '#3247A6',
        //         strokeWidth: 0.5,
        //         fillOpacity: 1,
        //         shape: 'circle',
        //         size: 1.2 * Math.PI,
        //         min: 0,
        //         max: 1,
        //         axes: [{
        //             position: 0,
        //             thickness: 0.5,
        //             color: '#DC4035',
        //             opacity: 0.3
        //         },{
        //             position: 0.5,
        //             thickness: 0.5,
        //             color: '#DC4035',
        //             opacity: 0.5
        //         },{
        //             position: 1,
        //             thickness: 0.5,
        //             color: '#DC4035',
        //             opacity: 0.8
        //         }],
        //         backgrounds: [{
        //             start: 0,
        //             end: 0.01,
        //             color: '#DC4035',
        //             opacity: 0.06
        //         }],
        //         tooltipContent: function(d){
        //             console.log(d);
        //             return[{
        //                 title: 'Chrom',
        //                 value: d.block_id
        //             },{
        //                 title: 'MetaLR_rankscore',
        //                 value: d.value
        //             }]
        //         }
        //     });

        // circular = circular.heatmap('MetaSVM_rankscore',MetaSVMData,{
        //     innerRadius: 0.1 / 0.95,
        //     outerRadius: 0.45 / 0.95,
        //     color: function(d,min,max){
        //         return scaleQuantize()
        //             .domain([min,max])
        //             .range(['0000FF','#4169E1','#7B68EE','#6495ED','#1E90FF','#00BFFF','#87CEFA','#87CEEB','#ADD8E6','#B0E0E6','#FFA07A','#FA8072','#E9967A','#CD5C5C','#DC143C','#FF0000'])(d.value)
        //     },
        //     tooltipContent: function(d){
        //         return[{
        //             title: 'Chrom',
        //             value: d.block_id
        //         },{
        //             title: 'MetaSVM_rankscore',
        //             value: d.value
        //         }]
        //     }
        // });

        // circular.render();
        
    }
}

// function compare(property){
//     return function(obj1,obj2){
//         var value1 = obj1[property];
//         var value2 = obj2[proprety];
//         return value1-value2;
//     }
// }