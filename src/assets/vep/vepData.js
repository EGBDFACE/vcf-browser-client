const GRCh38_JSON = require('../../assets/vep/10GRCh38.json');
const Gene_GRCh37 = require('../../assets/vep/geno_position_GRCh37.txt');
const d3_request = require('d3-request');

var all_variant_chrom = [],
    geno_data = {},
    highlight_data = [],
    layout_data = [],
    variant_data = [],
    metalr_rankscore_data = [],
    metasvm_rankscore_data = [];

var get_all_variant_chrom = function(data,callback){
    console.log('get_all_variant_chrom');
    for(let i = 0;i<data.length;i++){
        if(!all_variant_chrom.length){
            all_variant_chrom.push(data[i].seq_region_name);
        }else{
            if(all_variant_chrom.indexOf(data[i].seq_region_name) ===-1 ){
                all_variant_chrom.push(data[i].seq_region_name);
            }
        }
    }
    callback(null);
    // console.log(all_variant_chrom);
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

var get_geno_data = function(callback){
    console.log('get_geno_data');
    // if(!geno_data.length){
    d3_request.tsv(Gene_GRCh37,d=>{
        for(let i=0;i<d.length;i++){
            // geno_data[d[i].chrom].push(d[i])
            if(!geno_data[d[i].chrom]){
                geno_data[d[i].chrom] = [];
                geno_data[d[i].chrom].push(d[i]);
            }else{
                geno_data[d[i].chrom].push(d[i]);
            }
        }
        callback(null);
        // console.log(geno_data);
    });
    // }
}

var get_highlight_data = function(data,callback){
    console.log('get_highlight_data');
    for(let i=0;i<data.length;i++){
        let chromTemp = 'chr' + data[i].seq_region_name;
        for(let j=0;j<geno_data[chromTemp].length;j++){
            if((parseInt(geno_data[chromTemp][j].txStart)<= data[i].start)&&(parseInt(geno_data[chromTemp][j].txEnd)>= data[i].end)){
                if(JSON.stringify(highlight_data).indexOf(geno_data[chromTemp][j].name) === -1){
                    highlight_data.push({
                        block_id: geno_data[chromTemp][j].chrom,
                        start: parseInt(geno_data[chromTemp][j].txStart),
                        preserve_start: parseInt(geno_data[chromTemp][j].txStart),
                        end: parseInt(geno_data[chromTemp][j].txEnd),
                        preserve_end: parseInt(geno_data[chromTemp][j].txEnd),
                        value: 0.1,
                        name: geno_data[chromTemp][j].name
                    });
                    break;
                }
            }
        }
    }
    callback(null);
    // console.log(highlight_data);
}

var get_variant_data = function(data,callback){
    console.log('get_variant_data');
    variant_data = data.map(value => {
        return{
            block_id: 'chr' + value.seq_region_name,
            start: value.start,
            end: value.end,
            position: value.start,
            value: 0.01
        }
    });
    callback(null);
    // console.log(variant_data);
}

var get_meta_data = function(data,callback){
    console.log('get_meta_data');
    for(let i=0;i<data.length;i++){
        if(data[i].transcript_consequences){
            let tempCommonObj = {
                block_id: 'chr'+ data[i].seq_region_name,
                start: data[i].start,
                end: data[i].end,
                position: parseInt((data[i].start + data[i].end)/2)
            };
            if(JSON.stringify(data[i].transcript_consequences).indexOf('metalr_rankscore') != -1){
                let temp_metalr_rankscore = 0, temp_metasvm_rankscore = 0;
                for(let j=0;j<data[i].transcript_consequences.length;j++){
                    temp_metalr_rankscore = data[i].transcript_consequences[j].metalr_rankscore;
                    temp_metasvm_rankscore = data[i].transcript_consequences[j].metasvm_rankscore;
                    break;
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
    // console.log(metalr_rankscore_data);
    // console.log(metasvm_rankscore_data);
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
    get_meta_data
};