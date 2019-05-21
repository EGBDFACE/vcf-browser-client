import store from "../../store";
import * as actions from '../../actions';

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
let indexInTable:number = 0;

export function chunkFileRead(chunkString:string):chunk_result_item[]{
   let chunkArray = chunkString.split('\n');
   let chunkResult:chunk_result_item[] = []; 
   let chunkDataToDisplay: string[][] = [];

   for(let i=0; i<chunkArray.length; i++){
       let item = chunkArray[i];
       if((i === 0)&&(preChunkEndLine)){
           if(isCompleteLine(item) && isCompleteLine(preChunkEndLine)){
               chunkResult.push(dealLine(preChunkEndLine));
               chunkResult.push(dealLine(item));
               chunkDataToDisplay.push(dealLineToDisplay(preChunkEndLine,indexInTable++));
               chunkDataToDisplay.push(dealLineToDisplay(item,indexInTable++));
           }else if(isCompleteLine(preChunkEndLine + item)){
               chunkResult.push(dealLine(preChunkEndLine+item));
               chunkDataToDisplay.push(dealLineToDisplay(preChunkEndLine+item,indexInTable++));
           }
       }else if(i === chunkArray.length-1){
           preChunkEndLine = item;
       }else if(isCompleteLine(item)){
           chunkResult.push(dealLine(item));
           chunkDataToDisplay.push(dealLineToDisplay(item,indexInTable++));
       }
   }
   store.dispatch(actions.FileTabDisplay(chunkDataToDisplay));
   return chunkResult;
}

function dealLineToDisplay(v:string,index:number){
    let tmp = v.split('\t');
    let arr_display: string[] = [];

    arr_display[0] = index.toString();
    for(let i=0; i< 8; i++){
        arr_display[i+1] = tmp[i];
    }
    
    return arr_display;
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

function isCompleteLine(v:string){
    if(v.indexOf('#') != -1){
        return false;
    }

    let v_A = v.split('\t');
    let chr = v_A[0];
    let chr_N = Number(chr);

    if(isNaN(chr_N)){
        return false;
    }

    if((chr_N > 22) || (chr_N < 1)){
        if((chr != 'X') && (chr != 'Y')){
            return false;
        }
    }
    
    let pos = Number(v_A[1]); //parseInt 可以解析以数字开头的部分数字字符串（非数字部分在转换过程被删除）

    if(isNaN(pos)){
        return false;
    }

    return true;
}