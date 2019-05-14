export const BASE_URL = 'http://222.20.79.250:8081/api/';

export const FIRST_CHUNK_SIZE = 10 * 1024; //10K
// export const FIRST_CHUNK_SIZE = 1024 * 1024; //1M for test
export const UNIT_CHUNK_SIZE = 20 * 1024; // i * UNIT_CHUNK_SIZE to achieve dynamic increment size
export const MAX_CHUNK_SIZE = 100 * 1024;

export const VARIANT_INTERVAL = 0;
export const GENE_INTERVAL = 0;

export const CHROM_COLOR = getColorChrom();

function getColorChrom(){
    const colorArray:string[] = [
    "#1f77b4","#aec7e8","#ff7f0e","#ffbb78",
    "#2ca02c","#98df8a","#d62728","#ff9896",
    "#9467bd","#c5b0d5","#8c564b","#c49c94",
    "#e377c2","#f7b6d2","#7f7f7f","#c7c7c7",
    "#bcbd22","#dbdb8d","#17becf","#9edae5",
    "#393b79","#5254a3","#6b6ecf","#9c9ede"
    ];
    
    let colorChrom:any = {};

    for(let i=0; i<colorArray.length; i++){
    if(i < 22){
        colorChrom['chr'+(i+1)] = colorArray[i];
    }else if( i == 22){
        colorChrom['chrX'] = colorArray[i];
    }else{
        colorChrom['chrY'] = colorArray[i];
    }
    }

    return colorChrom;
 }