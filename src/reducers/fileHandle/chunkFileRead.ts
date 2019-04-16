export interface chunk_result_item{
    CHROM: string,
    POS: string,
    ID: string,
    REF: string,
    ALT: string,
    QUAL: string,
    FILTER: string,
    INFO: string
}

let preChunkEndLine:string = '';

export function chunkFileRead(chunkString:string):chunk_result_item[]{
   let chunkArray = chunkString.split('\n');
   let chunkResult:chunk_result_item[] = []; 

   for(let i=0; i<chunkArray.length; i++){
       let item = chunkArray[i];
       let itemArray = item.split('\t');
       if((i === 0)&&(preChunkEndLine)){
           if((((+itemArray[0]<23)&&(+itemArray[0]>0))||(itemArray[0] == 'X')||(itemArray[0] == 'Y')||(itemArray[0].indexOf('hs') == 0)||(itemArray[0].indexOf('CHR') == 0)||(itemArray[0].indexOf('GL') == 0)||(itemArray[0].indexOf('MT') == 0)||(itemArray[0].indexOf('NC')==0))&&Boolean(Number(itemArray[1]))){
               chunkResult.push(dealLine(preChunkEndLine));
               chunkResult.push(dealLine(item));
           }else if((preChunkEndLine + item).indexOf('#') === -1){
               chunkResult.push(dealLine(preChunkEndLine+item));
           }
       }else if(i === chunkArray.length-1){
           preChunkEndLine = item;
       }else if(item.indexOf('#') === -1){
           chunkResult.push(dealLine(item));
       }
   }
   return chunkResult;
}

function dealLine(v:string){
    let tmp = v.split('\t');
    let obj_upload = {
        CHROM: tmp[0],
        POS: tmp[1],
        ID: tmp[2],
        REF: tmp[3],
        ALT: tmp[4],
        QUAL: '.',
        FILTER: '.',
        INFO: '.'
    };
    let indexINS = tmp[4].indexOf('<INS>');
    let indexDEL = tmp[4].indexOf('<DEL>');
    let indexDUP = tmp[4].indexOf('<DUP>');
    let indexTDUP = tmp[4].indexOf('<TDUP>');
    let indexEND = tmp[7].indexOf('END');
    if(indexINS+indexDEL+indexDUP+indexTDUP === -4){
        if(tmp[4].indexOf('<') == -1){}
        else{
            obj_upload.REF = '.';
        }
    }
    else{
        let k =0;
        while((tmp[7].charAt(indexEND+k) != ';')&&(k<= tmp[7].length)){
            k++;
        }
        if(indexINS != -1){
            obj_upload.INFO = 'SVTYPE=INS;'+tmp[7].slice(indexEND,indexEND+k+1);
        }else if(indexDEL != -1){
            obj_upload.INFO = 'SVTYPE=DEL;'+tmp[7].slice(indexEND,indexEND+k+1);
        }else if(indexDUP != -1){
            obj_upload.INFO = 'SYTYPE=DUP;'+tmp[7].slice(indexEND,indexEND+k+1);
        }else if(indexTDUP != -1){
            obj_upload.INFO = 'SYTYPE=TDUP;'+tmp[7].slice(indexEND,indexEND+k+1);
        }else{
            console.log('error,vep only support INS/DEL/DUP/TDUP structural variant');
        }
    }
    return obj_upload;
}