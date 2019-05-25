import BaseRenderer from '../d3-SvgToWebgl/Renderer/BaseRenderer';
import Core from '../d3-SvgToWebgl/Core/Circos/src/circos';
import { getData, item_gene, item_layout, item_variant_score, I_VEPData } from './data';


export default function draw(data: any){
    let blank = document.createElement('canvas');
    blank.width = 800;
    blank.height = 800;
    if(document.getElementsByTagName('canvas').length != 0 ){
        for(let i=0 ; i<document.getElementsByTagName('canvas').length; i++){
            document.getElementsByTagName('canvas')[i].remove();
        }
    }
    document.getElementsByClassName('canvasElement')[0].appendChild(blank);

    let canvas = document.getElementsByTagName('canvas')[0];
    
    // let blank = document.createElement('canvas');
    // blank.width = canvas.width;
    // blank.height  = canvas.height;
    // if(blank.toDataURL() === canvas.toDataURL()){
    //     console.log('canvas blank');
    // }
    //clearCanvas
    // console.log('clearCanvas');
    // console.log(data);
    // let gl = canvas.getContext('webgl');
    // // context.clearRect(0,0,canvas.width,canvas.height);
    // gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    // gl.clearColor(0.0, 0.5, 0.0, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    
    // canvas.width = document.body.clientWidth;
    // canvas.height = document.body.clientHeight;
    canvas.width = 800;
    canvas.height = 800;

    let vepData:I_VEPData = getData(data);
    // console.log(vepData);
    
    new VEPCircularRender(document.getElementsByTagName('canvas')[0],{
        bgColor: 0xf1e5e6
    }).drawVEP(vepData);

}

class VEPCircularRender extends BaseRenderer{
    constructor(elem:any,options:any){
        super(elem,options);
    }

    drawVEP(vepData: any){
        const width = this.renderer.view.width/this.renderer.resolution;
        const height = this.renderer.view.height/this.renderer.resolution;

        const circos = new Core({
            container: this.renderer.view,
            renderer: this.renderer,
            width: width,
            height: height
        });

        let circular = circos.layout(vepData.layoutData,{
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
            tooltipContent: function(d:item_layout){
                return [{
                    title: 'Chrom',
                    value: d.label
                }]
            }
        });

        circular = circular.highlight('Gene',vepData.geneData,{
            innerRadius: 360,
            outerRadius: 380,
            color: '#000',
            strokeWidth: 1,
            strokeColor: '#000',
            tooltipContent: function(d:item_gene){
                return[{
                    title: 'Chrom',
                    value: d.block_id 
                },{
                    title: 'start',
                    value: d.preserveStart,
                    // value: d.start
                },{
                    title: 'end',
                    value: d.preserveEnd,
                    // value: d.end
                },{
                    title: 'ID',
                    value: d.id
                },{
                    title: 'Description',
                    value: d.des
                }]
            }
        });

        circular = circular.highlight('variant',vepData.variantData,{
            innerRadius: 0.55 / 0.95,
            outerRadius: 0.75 / 0.95,
            color: "#000",
            strokeWidth: 1,
            strokeColor: "#000",
            tooltipContent: function(d:item_variant_score){
                return [{
                    title: 'Chrom',
                    value: d.block_id
                },{
                    title: 'start',
                    value: d.preserveStart
                },{
                    title: 'end',
                    value: d.preserveEnd
                }]
            }
        })
         
        circular = circular.scatter('MetaLR_rankscore',vepData.metalrData,{
            // innerRadius: 0.49 / 0.95,
            // outerRadius: 0.75 / 0.95,
            innerRadius: 0.1 / 0.95,
            outerRadius: 0.49 / 0.95,
            
            color: function(d:item_variant_score){
                // console.log(d);
                if(d.value > 0.9634){ return '#f44336';}
                else { return '#3f51b5';}
            },
            strokeColor: function(d:item_variant_score){
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
            tooltipContent: function(d:item_variant_score){
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

        circular.render();

    }
}