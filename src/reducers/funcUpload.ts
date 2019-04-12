import * as SparkMD5 from 'spark-md5';
import axios from 'axios';
import store from '../store/store';
import * as actions from '../actions/action';

interface preloadedFormat{
    file:{
        fileMd5:string,
        chunksNumber: number,
        // chunkSize: number,
        fileMd5Status:boolean
    },
    chunk:{
        chunkNumber: number,
        chunkMd5: string,
        chunkFile:{
            fileformat: string,
            Chrom: string,
            body:{
                CHROM: string,
                POS: string,
                ID: string,
                REF: string,
                ALT: string,
                QUAL: string,
                FILTER: string,
                INFO: string
            }[],
            startLine: string,
            endLine: string
        }
    }
}

export function funcUpload(InputFile:any){
    let blobSlice = File.prototype.slice; //browser compatibility 
    let chunkFileReader = new FileReader();
    let totalFileReader = new FileReader();
    let currentChunk = 0;
    // let chunkSize:number[];
    // const firstChunkSize = 512*1024;
    // chunkSize[0] = firstChunkSize;
    // chunkSize[1] = (InputFile.size > 10*1024*1024) ? 10*1024*1024 : 1024*1024;
    let chunkSize = (InputFile.size > 10*1024*1024) ? 10*1024*1024 :1024*1024;
    let uploadChunkList:any;
    let preloadedJSON:preloadedFormat = {
        file:{
            fileMd5: '',
            chunksNumber : Math.ceil(InputFile.size / chunkSize),
            // chunksNumber: Math.ceil((InputFile.size - chunkSize[0]) / chunkSize[1]) + 1,
            // chunkSize: chunkSize,
            fileMd5Status:false
        },
        chunk:{
            chunkNumber: 0,
            chunkMd5: '',
            chunkFile: {
                fileformat: '',
                Chrom: '',
                body: [],
                startLine: '',
                endLine: ''
            }
        }
    };
    // let vepResultFromServer:string[]= [];
    totalFileReader.readAsArrayBuffer(InputFile);
    totalFileReader.onload = function(e:any){
        let sparkTotal = new SparkMD5.ArrayBuffer();
        sparkTotal.append(e.target.result);
        preloadedJSON.file.fileMd5 = sparkTotal.end();
    };
    let preChunkEndLine:string = '';
    let totalIndexTabDisplay:number = 0;
    chunkFileReader.onload = function(e:any){
        let sparkChunk = new SparkMD5();
        preloadedJSON.chunk.chunkNumber = currentChunk;
        sparkChunk.append(e.target.result);
        preloadedJSON.chunk.chunkMd5 = sparkChunk.end();
        preloadedJSON.chunk.chunkFile.body = [];
        let ChunkStringArray = e.target.result.trim().split('\n');
        let chunkTabDisplay:string[][] =[];
        let indexChunkTabDisplay:number = 0;
        ChunkStringArray.forEach(function(v:string,i:number=0){
            if(i === 0){
                if(preChunkEndLine){
                    let vArray = v.split('\t');
                    if((((+vArray[0]<23)&&(+vArray[0]>0))||(vArray[0] == 'X')||(vArray[0] == 'Y')||(vArray[0].indexOf('hs') == 0)||(vArray[0].indexOf('CHR') == 0)||(vArray[0].indexOf('GL') == 0)||(vArray[0].indexOf('MT') == 0)||(vArray[0].indexOf('NC')==0))&&Boolean(Number(vArray[1]))){
                        let preChunkEndLineArray = preChunkEndLine.split('\t');
                        chunkTabDisplay[indexChunkTabDisplay] = new Array();
                        chunkTabDisplay[indexChunkTabDisplay+1] = new Array();
                        chunkTabDisplay[indexChunkTabDisplay][0] = totalIndexTabDisplay.toString();
                        chunkTabDisplay[indexChunkTabDisplay+1][0] = (totalIndexTabDisplay+1).toString();
                        for(let j=0;j<8;j++){
                            chunkTabDisplay[indexChunkTabDisplay][j+1] = preChunkEndLineArray[j];
                            chunkTabDisplay[indexChunkTabDisplay+1][j+1] = vArray[j];
                        }
                        indexChunkTabDisplay+=2;
                        totalIndexTabDisplay+=2;
                        preloadedJSON.chunk.chunkFile.body.push(dealLine(preChunkEndLine));
                        preloadedJSON.chunk.chunkFile.body.push(dealLine(v));
                    }
                    else{
                        let temp = preChunkEndLine + v;
                        let tempArray = temp.split('\t');
                        chunkTabDisplay[indexChunkTabDisplay] = new Array();
                        chunkTabDisplay[indexChunkTabDisplay][0] = totalIndexTabDisplay.toString();
                        for(let j=0;j<8;j++){
                            chunkTabDisplay[indexChunkTabDisplay][j+1] = tempArray[j];
                        }
                        indexChunkTabDisplay++;
                        totalIndexTabDisplay++;
                        preloadedJSON.chunk.chunkFile.body.push(dealLine(temp));
                    }
                }
            }else if(i === ChunkStringArray.length-1){
                preChunkEndLine = v;
            }else{
                if(v.indexOf('#') === -1){
                    let tmp = v.split('\t');
                    let obj = dealLine(v);
                    chunkTabDisplay[indexChunkTabDisplay] = new Array();
                    chunkTabDisplay[indexChunkTabDisplay][0] = totalIndexTabDisplay.toString();
                    for(let j=0;j<8;j++){
                        chunkTabDisplay[indexChunkTabDisplay][j+1] = tmp[j];
                    }
                    indexChunkTabDisplay++;
                    totalIndexTabDisplay++;
                    preloadedJSON.chunk.chunkFile.body.push(obj);
                }else if(v.indexOf('#CHROM') != -1){
                    preloadedJSON.chunk.chunkFile.Chrom = '#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO';
                    if(v.indexOf('#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINF') == -1){
                        console.log('only support #CHROM of #CHROM POS ID REF ALT QUAL FILTER INF')
                    }
                }else if(v.indexOf('##fileformat') != -1){
                    preloadedJSON.chunk.chunkFile.fileformat = v;
                }else if(v.indexOf('##') != -1){}else{
                    console.log('something wrong when split vcf file');
                }
            }
        });
        store.dispatch(actions.FileTabDisplay(chunkTabDisplay));
        let chunkFile = JSON.parse(JSON.stringify(preloadedJSON.file));
        let chunkChunk = JSON.parse(JSON.stringify(preloadedJSON.chunk));
        Object.assign(chunkFile,chunkChunk);
        console.log(chunkFile);
        switch(uploadChunkList.fileStatus){
            case 'posting':
              let posting_uploadedPercent = Math.round((uploadChunkList.uploadedChunk.length/preloadedJSON.file.chunksNumber)*100);
              store.dispatch(actions.FileUploadProgress(posting_uploadedPercent,'Uploading...'));
              for(var i =0 ;i<uploadChunkList.uploadedChunk.length;i++){
                  if(chunkFile.chunkMd5 == uploadChunkList.uploadedChunk[i].chunkMd5){
                    break;
                    }
              }
              if(i == uploadChunkList.uploadedChunk.length){
                axios({
                    method: 'post',
                    url:`http://222.20.79.250:8081/api/upload_file_part?fileMd5=${preloadedJSON.file.fileMd5}&chunkMd5=${chunkFile.chunkMd5}&chunkNumber=${chunkFile.chunkNumber}`,
                    data: chunkFile
                }).then(response => {
                    // console.log(response.data);
                    if(response.data.chunksNumber === response.data.uploadChunk.length){
                        store.dispatch(actions.FileUploadProgress(100,'Uploaded!'));
                        store.dispatch(actions.UploadStatusChange());
                    }else{
                        store.dispatch(actions.FileUploadProgress(Math.round((response.data.uploadedChunk.length/response.data.chunksNumber)*100),'Uploading...'));
                    }
                }).catch(error => {
                    console.log(error);
                })
              }else{
                console.log(`chunkMd5=${chunkFile.chunkMd5}have uploaded`);
              }
              break;
            case 'notposted':
              axios({
                  method: 'post',
                  url:`http://222.20.79.250:8081/api/upload_file_part?fileMd5=${preloadedJSON.file.fileMd5}&chunkMd5=${chunkFile.chunkMd5}&chunkNumber=${chunkFile.chunkNumber}`,
                  data: chunkFile
              }).then(response => {
                  console.log(response);
                  console.log(JSON.parse(response.data.data));
                //   for(let i=0;i<JSON.parse(response.data.data).length;i++){
                //       if((JSON.parse(response.data.data)[i].id == 'rs17878711')){
                //           console.log(JSON.parse(response.data.data)[i]);
                //       }
                //   }
                //   JSON.parse(response.data.data).map((value:any)=>{
                //     if(value.most_severe_consequence === 'missense_variant'){
                //         console.log(value);
                //     }
                //   })
                  if(response.data.chunksNumber == response.data.uploadedChunk.length){
                    store.dispatch(actions.FileUploadProgress(100,'Uploaded!'));
                    store.dispatch(actions.UploadStatusChange());
                    // vepResultFromServer.push(response.data);
                    // console.log(vepResultFromServer);
                  }else{
                    store.dispatch(actions.FileUploadProgress(Math.round((response.data.uploadedChunk.length/response.data.chunksNumber)*100),'Uploading...'));
                    // vepResultFromServer.push(response.data);
                  }
                //   store.dispatch(actions.VEPFileReceive({data:response.data.data,fileMd5:response.data.fileMd5}));
              }).catch(error => {
                  console.log(error);
              })
              break;
            case 'posted':
              break;
        }
        currentChunk++;
        if(currentChunk < preloadedJSON.file.chunksNumber){
            loadChunks(); 
        }
    }
    function loadChunks(){
        // let chunkStart:number,chunkEnd:number;
        // if(currentChunk === 0){
        //     chunkStart = 0;
        //     chunkEnd = (chunkSize[0] > InputFile.size) ? InputFile.size : chunkSize[0];
        // }else{
        //     chunkStart = chunkSize[0] + (currentChunk - 1)*chunkSize[1];
        //     chunkEnd = ((chunkStart + chunkSize[1]) > InputFile.size) ? InputFile.size : chunkSize[1];
        // }
        let chunkStart = currentChunk * chunkSize;
        let chunkEnd  = ((chunkStart + chunkSize) > InputFile.size) ? InputFile.size : chunkStart + chunkSize;
        chunkFileReader.readAsText(blobSlice.call(InputFile,chunkStart,chunkEnd));
    }
    totalFileReader.onloadend = function (){
        // console.log('onloadedend'+preloadedJSON.file.fileMd5);
        axios({
            method: 'post',
            url: `http://222.20.79.250:8081/api/pullChunkList?fileMd5=${preloadedJSON.file.fileMd5}&chunksNumber=${preloadedJSON.file.chunksNumber}`
        }).then(response => {
            uploadChunkList = JSON.parse(JSON.stringify(response.data));
            // console.log(uploadChunkList);
            // console.log(uploadChunkList.fileStatus);
            if(uploadChunkList.fileStatus != 'posted'){
                store.dispatch(actions.FileUploadProgress(0,'Uploading...'));
            }else{
                store.dispatch(actions.FileUploadProgress(100,'Uploaded!'));
                store.dispatch(actions.UploadStatusChange());
            }
            loadChunks();
        }).catch(error => {
            console.log(error)
        })
    }
    totalFileReader.onprogress = function(evt){
        if(evt.lengthComputable){
            let percentLoaded = Math.round((evt.loaded / evt.total)*100);
            store.dispatch(actions.FileUploadProgress(percentLoaded,'Loading...'));
        }
    }
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