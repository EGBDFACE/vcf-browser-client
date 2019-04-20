import { parse } from 'querystring';

const GRCh38_JSON = require('../../assets/vep/10GRCh38.json');
const Gene_GRCh37 = require('../../assets/vep/geno_position_GRCh37.txt');
const d3_request = require('d3-request');

var all_variant_chrom = [],
    // geno_data = {},
    highlight_data = [],
    layout_data = [],
    variant_data = [],
    metalr_rankscore_data = [],
    metasvm_rankscore_data = [],
    geno_data = [],
    transcript_data = [],
    protein_data = [];

var get_all_variant_chrom = function(data,callback){
    console.log('get_all_variant_chrom');
    for(let i = 0;i<data.length;i++){
        if(!all_variant_chrom.length){
            all_variant_chrom.push(data[i].Location.chrom);
        }else{
            if(all_variant_chrom.indexOf(data[i].Location.chrom) ===-1 ){
                all_variant_chrom.push(data[i].Location.chrom);
            }
        }
    }
    callback(null);
    // console.log(all_variant_chrom);
}

var get_detail_data = function(data,callback){
    for(let i=0;i<data.length;i++){
        
        if(!all_variant_chrom.length){
            all_variant_chrom.push(data[i].Location.chrom);
        }else{
            if(all_variant_chrom.indexOf(data[i].Location.chrom) === -1){
                all_variant_chrom.push(data[i].Location.chrom);
            }
        }

        if(data[i].transcriptConsequences){
            for(let j=0; j<data[i].transcriptConsequences.length; j++){
                let gene = data[i].transcriptConsequences[j].MutantGene;
                let transcript = data[i].transcriptConsequences[j].Transcript;
                let protein = data[i].transcriptConsequences[j].Protein;
                let blockID = 'chr' + data[i].Location.chrom;
                if(isConsequence(gene)){
                  geno_data.push({
                    block_id : blockID,
                    start: parseInt(gene.Location.start),
                    end: parseInt(gene.Location.end),
                    id: gene.ID,
                    des: gene.Description
                    });  
                }
                if(isConsequence(transcript)){
                  transcript_data.push({
                    block_id: blockID,
                    start: parseInt(transcript.Location.start),
                    end: parseInt(transcript.Location.end),
                    id: transcript.ID,
                    name: transcript.Name
                    });
                }
                if(isConsequence(protein)){
                  protein_data.push({
                    block_id: blockID,
                    start: parseInt(protein.Position.start),
                    end: parseInt(protein.Position.end),
                    id: protein.ID
                    });
                }
            }
        }

        variant_data.push({
            block_id: 'chr' + value.Location.chrom,
            start: value.Location.start,
            end: value.Location.end,
            position: value.Location.start,
            value: 0.01
        });

        if(data[i].PredictorScore){
            let tempCommonObj = {
                block_id: 'chr'+ data[i].Location.start,
                start: data[i].Location.start,
                end: data[i].Location.end,
                position: parseInt((data[i].Location.start + data[i].Location.end)/2)
            };
            if(data[i].PredictorScore){
                let temp_metalr_rankscore = 0, temp_metasvm_rankscore = 0;
                if(data[i].PredictorScore.metalr){
                    temp_metalr_rankscore = data[i].PredictorScore.metalr.rankscore;
                }
                if(data[i].PredictorScore.metasvm){
                    temp_metasvm_rankscore = data[i].PredictorScore.metasvm.rankscore;
                }
                metalr_rankscore_data.push({
                    ...tempCommonObj,
                    value: temp_metalr_rankscore
                });
                metasvm_rankscore_data.push({
                    ...tempCommonObj,
                    value: temp_metasvm_rankscore
                });
            }
        }

    }
    callback(null);
}

var get_layout_data = function(callback){
    console.log('get_layout_data');
    d3_request.json(GRCh38_JSON,d=>{
        layout_data = d.filter(value => {
            for(let i=0;i<all_variant_chrom.length;i++){
                if(value.id === 'chr'+all_variant_chrom[i]){
                    return value;
                }
            }
        });
        callback(null);
        // console.log(layout_data);
    });
}

// var get_geno_data = function(callback){
//     console.log('get_geno_data');
//     // if(!geno_data.length){
//     d3_request.tsv(Gene_GRCh37,d=>{
//         for(let i=0;i<d.length;i++){
//             // geno_data[d[i].chrom].push(d[i])
//             if(!geno_data[d[i].chrom]){
//                 geno_data[d[i].chrom] = [];
//                 geno_data[d[i].chrom].push(d[i]);
//             }else{
//                 geno_data[d[i].chrom].push(d[i]);
//             }
//         }
//         callback(null);
//         // console.log(geno_data);
//     });
//     // }
// }



// var get_highlight_data = function(data,callback){
//     console.log('get_highlight_data');
//     for(let i=0;i<data.length;i++){
//         let chromTemp = 'chr' + data[i].seq_region_name;
//         for(let j=0;j<geno_data[chromTemp].length;j++){
//             if((parseInt(geno_data[chromTemp][j].txStart)<= data[i].start)&&(parseInt(geno_data[chromTemp][j].txEnd)>= data[i].end)){
//                 if(JSON.stringify(highlight_data).indexOf(geno_data[chromTemp][j].name) === -1){
//                     highlight_data.push({
//                         block_id: geno_data[chromTemp][j].chrom,
//                         start: parseInt(geno_data[chromTemp][j].txStart),
//                         preserve_start: parseInt(geno_data[chromTemp][j].txStart),
//                         end: parseInt(geno_data[chromTemp][j].txEnd),
//                         preserve_end: parseInt(geno_data[chromTemp][j].txEnd),
//                         value: 0.1,
//                         name: geno_data[chromTemp][j].name
//                     });
//                     break;
//                 }
//             }
//         }
//     }
//     callback(null);
//     // console.log(highlight_data);
// }

var get_consequences_data = function(data,callback){
    for(let i=0; i<data.length; i++){
        if(data[i].transcriptConsequences){
            for(let j=0; j<data[i].transcriptConsequences.length; j++){
                let gene = data[i].transcriptConsequences[j].MutantGene;
                let transcript = data[i].transcriptConsequences[j].Transcript;
                let protein = data[i].transcriptConsequences[j].Protein;
                let blockID = 'chr' + data[i].Location.chrom;
                if(isConsequence(gene)){
                  geno_data.push({
                    block_id : blockID,
                    start: parseInt(gene.Location.start),
                    end: parseInt(gene.Location.end),
                    id: gene.ID,
                    des: gene.Description
                    });  
                }
                if(isConsequence(transcript)){
                  transcript_data.push({
                    block_id: blockID,
                    start: parseInt(transcript.Location.start),
                    end: parseInt(transcript.Location.end),
                    id: transcript.ID,
                    name: transcript.Name
                    });
                }
                if(isConsequence(protein)){
                  protein_data.push({
                    block_id: blockID,
                    start: parseInt(protein.Position.start),
                    end: parseInt(protein.Position.end),
                    id: protein.ID
                    });
                }
            }
        }
    }
    callback(null);
}

var get_variant_data = function(data,callback){
    console.log('get_variant_data');
    variant_data = data.map(value => {
        return{
            block_id: 'chr' + value.Location.chrom,
            start: value.Location.start,
            end: value.Location.end,
            position: value.Location.start,
            value: 0.01
        }
    });
    callback(null);
    // console.log(variant_data);
}

var get_meta_data = function(data,callback){
    console.log('get_meta_data');
    for(let i=0;i<data.length;i++){
        if(data[i].PredictorScore){
            let tempCommonObj = {
                block_id: 'chr'+ data[i].Location.start,
                start: data[i].Location.start,
                end: data[i].Location.end,
                position: parseInt((data[i].Location.start + data[i].Location.end)/2)
            };
            let temp_metalr_rankscore = 0, temp_metasvm_rankscore = 0;
            if(data[i].PredictorScore.metalr){
                temp_metalr_rankscore = data[i].PredictorScore.metalr.rankscore;
            }
            if(data[i].PredictorScore.metasvm){
                temp_metasvm_rankscore = data[i].PredictorScore.metasvm.rankscore;
            }
            metalr_rankscore_data.push({
                ...tempCommonObj,
                value: temp_metalr_rankscore
            });
            metasvm_rankscore_data.push({
                ...tempCommonObj,
                value: temp_metasvm_rankscore
            });
        }
    }
    callback(null);
    // console.log(metalr_rankscore_data);
    // console.log(metasvm_rankscore_data);
}

function isConsequence(value){
    if(!value){
        return false;
    }

    if(!value.Location && !value.Position){
        return false;
    }

    if(value.Location && !value.Location.start){
        return false;
    }

    if(value.Position && !value.Position.start){
        return false;
    }

    return true;
} 

// 去重
// var arr=[{a:1},{a:1},{a:2},{a:3},{a:3}];
// var mapObj = new Map(arr);
// arr.filter(obj=> {
//     return !mapObj.has(obj[a]) && mapObj.set(obj[a],1)
// })



function getDetailData(data){
    for(let i=0;i<data.length;i++){
        
        if(!all_variant_chrom.length){
            all_variant_chrom.push(data[i].Location.chrom);
        }else{
            if(all_variant_chrom.indexOf(data[i].Location.chrom) === -1){
                all_variant_chrom.push(data[i].Location.chrom);
            }
        }

        if(data[i].transcriptConsequences){
            for(let j=0; j<data[i].transcriptConsequences.length; j++){
                let gene = data[i].transcriptConsequences[j].MutantGene;
                let transcript = data[i].transcriptConsequences[j].Transcript;
                let protein = data[i].transcriptConsequences[j].Protein;
                let blockID = 'chr' + data[i].Location.chrom;
                if(isConsequence(gene)){
                  geno_data.push({
                    block_id : blockID,
                    start: parseInt(gene.Location.start),
                    preserve_start: parseInt(gene.Location.start),
                    end: parseInt(gene.Location.end),
                    preserve_end: parseInt(gene.Location.end),
                    id: gene.ID,
                    des: gene.Description
                    });  
                }
                if(isConsequence(transcript)){
                  transcript_data.push({
                    block_id: blockID,
                    start: parseInt(transcript.Location.start),
                    end: parseInt(transcript.Location.end),
                    id: transcript.ID,
                    name: transcript.Name
                    });
                }
                if(isConsequence(protein)){
                  protein_data.push({
                    block_id: blockID,
                    start: parseInt(protein.Position.start),
                    end: parseInt(protein.Position.end),
                    id: protein.ID
                    });
                }
            }
        }

        variant_data.push({
            block_id: 'chr' + data[i].Location.chrom,
            start: data[i].Location.start,
            end: data[i].Location.end
        });

        if(data[i].PredictorScore){
            let tempCommonObj = {
                block_id: 'chr'+ data[i].Location.chrom,
                start: data[i].Location.start,
                end: data[i].Location.end,
                position: parseInt((data[i].Location.start + data[i].Location.end)/2)
            };
            let temp_metalr_rankscore = 0, temp_metasvm_rankscore = 0;
            if(data[i].PredictorScore.metalr){
                temp_metalr_rankscore = data[i].PredictorScore.metalr.rankscore;
            }
            if(data[i].PredictorScore.metasvm){
                temp_metasvm_rankscore = data[i].PredictorScore.metasvm.rankscore;
            }
            metalr_rankscore_data.push({
                ...tempCommonObj,
                value: temp_metalr_rankscore
            });
            metasvm_rankscore_data.push({
                ...tempCommonObj,
                value: temp_metasvm_rankscore
            });
        }

    }
}

function getLayoutData(){
    return new Promise(function(resolve, reject){
        d3_request.json(GRCh38_JSON,d=>{
            layout_data = d.filter(value => {
                for(let i=0;i<all_variant_chrom.length;i++){
                    if(value.id === 'chr'+all_variant_chrom[i]){
                        return value;
                    }
                }
            });
            resolve();
        });
    })
}

export { 
    all_variant_chrom,
    highlight_data,
    layout_data,
    variant_data,
    geno_data,
    metalr_rankscore_data,
    metasvm_rankscore_data,
    get_all_variant_chrom,
    get_layout_data,
    get_geno_data,
    get_highlight_data,
    get_variant_data,
    get_meta_data,
    get_consequences_data,
    get_detail_data,
    getDetailData,
    getLayoutData
};