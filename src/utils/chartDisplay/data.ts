import { CHROM_COLOR, VARIANT_INTERVAL, GENE_INTERVAL } from '../../constant';

interface Item{
    start?: number,
    end?: number,
    block_id?: string,
    id?: string,
    label?: string,
    color?: string,
    len?: number,
    position?: number,
    value?: number
    des?: string
    preserveStart?: number
    preserveEnd?: number
}
export interface I_common{
    block_id: string,
    start: number,
    end: number,
    position: number
}
export interface item_layout{
    id: string,
    label: string,
    color: string,
    len: number
}
export interface item_variant_score extends I_common{
    value: number,
    preserveStart?: number,
    preserveEnd?: number
}
export interface item_gene extends I_common{
    id: string,
    des: string,
    preserveStart: number,
    preserveEnd: number
}
export interface I_VEPData{
    variantData: item_variant_score[],
    metalrData: item_variant_score[],
    layoutData: item_layout[],
    geneData: item_gene[]
}

export function getData(data: any){

    let layoutData: item_layout[] = [],
        variantData: item_variant_score[] = [],
        metalrData: item_variant_score[] = [],
        metasvmData: item_variant_score[] = [],
        geneData: item_gene[] = [],
        transcriptData: Item[] = [],
        proteinData: Item[] = [];

    let temp = readRowData(data);

    GenerateRelativePosition(temp);

    // layoutData = getLayoutData(temp);
    let detail = getDetailData(temp);

    layoutData = detail.layout;
    
    variantData = detail.variant;

    metalrData = detail.metalr;

    metasvmData = detail.metasvm;

    geneData = detail.gene;

    console.log(temp);
    console.log(layoutData);
    console.log(variantData);
    console.log(geneData);
    console.log(metalrData);
    console.log(metasvmData);
    
    let returnObj:I_VEPData = {
        layoutData: layoutData,
        geneData: geneData,
        variantData: variantData,
        metalrData: metalrData
    };
    return returnObj;
}

function readRowData(data:any){
    let temp: any = {};
    // let index: number = 0;
    for(let i=0; i<data.length; i++){
        if(data[i].transcriptConsequences){
            if(data[i].Location.start >= parseInt(data[i].transcriptConsequences[0].MutantGene.Location.start)){
                if(data[i].Location.end <= parseInt(data[i].transcriptConsequences[0].MutantGene.Location.end)){
                    let chrom  = 'chr'+data[i].Location.chrom;
                    let variantStart = data[i].Location.start - parseInt(data[i].transcriptConsequences[0].MutantGene.Location.start);
                    if(!temp[chrom]){
                        temp[chrom] = [];
                    }
                    temp[chrom].push({
                        raw: data[i],
                        // chrom: data[i].Location.chrom,
                        chrom: chrom,
                        variantStart: variantStart,
                        variantEnd: variantStart + VARIANT_INTERVAL,
                        geneStart: parseInt(data[i].transcriptConsequences[0].MutantGene.Location.start),
                        geneEnd: parseInt(data[i].transcriptConsequences[0].MutantGene.Location.end)  
                    })
                }
            }
        }
    }
    return temp;
}

function GenerateRelativePosition(value: any){
    for(let key in value){
        
        value[key].sort(compare('geneStart'));

        for(let i=0; i<value[key].length; i++){
            if(i == 0){
                value[key][i].RelGeneStart = 0;
                value[key][i].RelGeneEnd = value[key][i].geneEnd - value[key][i].geneStart;
            }else if(value[key][i].geneStart == value[key][i-1].geneStart){
                value[key][i].RelGeneStart = value[key][i-1].RelGeneStart;
                value[key][i].RelGeneEnd = value[key][i-1].RelGeneEnd;
            }else{
                value[key][i].RelGeneStart = value[key][i-1].RelGeneEnd + GENE_INTERVAL;
                value[key][i].RelGeneEnd = value[key][i].RelGeneStart + value[key][i].geneEnd - value[key][i].geneStart;
            }

            value[key][i].RelVariantStart = value[key][i].RelGeneStart + value[key][i].variantStart;
            value[key][i].RelVaraintEnd = value[key][i].RelGeneStart + value[key][i].variantEnd + VARIANT_INTERVAL;

        }
    }
}

function getDetailData(value:any){
    console.log('run get data ');
    let variantData: item_variant_score[] = [],
        metalrData: item_variant_score[] = [],
        layoutData: item_layout[] = [],
        geneData: item_gene[] = [],
        metasvmData: item_variant_score[] = [];
    
    for(let key in value){

        layoutData.push({
            id: key,
            label: key,
            color: CHROM_COLOR[key],
            len: value[key][value[key].length - 1].RelGeneEnd
        });

        let temp = value[key];
        for(let i=0; i< temp.length; i++){

            let commonObj = {
                block_id: temp[i].chrom,
                start: temp[i].RelVariantStart,
                end: temp[i].RelVaraintEnd,
                position: (temp[i].RelVariantStart + temp[i].RelVaraintEnd) / 2
            };

            variantData.push({
                ...commonObj,
                value: 0.01,
                preserveStart: temp[i].RelVariantStart,
                preserveEnd: temp[i].RelVaraintEnd
            });

            geneData.push({
                ...commonObj,
                preserveStart: temp[i].RelGeneStart,
                preserveEnd: temp[i].RelGeneEnd,
                id: temp[i].raw.transcriptConsequences[0].MutantGene.ID,
                des: temp[i].raw.transcriptConsequences[0].MutantGene.Description
            });

            if(temp[i].raw.PredictorScore){
                let metalrRankScore = parseFloat(temp[i].raw.PredictorScore.metalr.rankscore);
                let metasvmRankScore = parseFloat(temp[i].raw.PredictorScore.metasvm.rankscore);

                metalrData.push({
                    ...commonObj,
                    value: metalrRankScore
                });

                metasvmData.push({
                    ...commonObj,
                    value: metasvmRankScore
                })
            }
        }
    }

    return {
        variant: variantData,
        metalr: metalrData,
        metasvm: metasvmData,
        layout: layoutData,
        gene: geneData
    }
}

function compare(p: string){
    return function(m: any, n: any){
        return m[p] - n[p];
    }
}