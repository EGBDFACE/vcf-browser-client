import * as SparkMD5 from 'spark-md5';
import axios from 'axios';
import { BASE_URL } from '../../constant';
import { FIRST_CHUNK_SIZE , UNIT_CHUNK_SIZE , MAX_CHUNK_SIZE } from '../../constant';
import store from '../../store/store';
import * as actions from '../../actions/action';
import {chunkFileRead, chunk_result_item} from './chunkFileRead';
import chunkFileUpload from './chunkFileUpload';

interface upload_chunk_list_item_info{
    chunkMd5: string,
    chunkNumber: number
}
interface upload_chunk_list{
    fileStatus: string,
    uploadedChunk: upload_chunk_list_item_info[]
}

export default function fileHandle(inputFile: any){
    let totalFileReader = new FileReader();
    let totalFileMd5:string = '';
    let uploadChunkList:upload_chunk_list;

    totalFileReader.readAsArrayBuffer(inputFile);

    totalFileReader.onload = function(e:any){
        let sparkTotal = new SparkMD5.ArrayBuffer();
        sparkTotal.append(e.target.result);
        totalFileMd5 = sparkTotal.end();
    }

    totalFileReader.onloadend = ()=>{
        axios({
            method: 'post',
            baseURL: BASE_URL,
            url: `/pullChunkList?fileMd5=${totalFileMd5}`
        }).then( response => {
            uploadChunkList = response.data;
            if(uploadChunkList.fileStatus != 'posted'){
                store.dispatch(actions.FileUploadProgress(0,'Uploading'));
                fileSplit(inputFile,uploadChunkList,totalFileMd5);
            }else{
                store.dispatch(actions.FileUploadProgress(100,'Uploaded!'));
                store.dispatch(actions.UploadStatusChange());
            }
        }).catch( err => {
            console.error(err.message);
        })
    }

    totalFileReader.onprogress = evt =>{
        if(evt.lengthComputable){
            let percentLoaded = Math.round(( evt.loaded / evt.total ) * 100);
            store.dispatch( actions.FileUploadProgress( percentLoaded , 'Loading...' ));
        }
    }

}

function fileSplit(inputFile: any, uploadChunkList: upload_chunk_list,totalFileMd5:string){
    let currentChunk: number = 0,
        chunkStart: number = 0,
        chunkEnd: number = FIRST_CHUNK_SIZE;
    let chunkFileReader = new FileReader();
    let blobSlice = File.prototype.slice;
    let chunksNumber: number = 0;
    let computeSize: number = 0;

    console.log(inputFile.size);
    while(computeSize < inputFile.size){
        if(computeSize === 0){
            computeSize = FIRST_CHUNK_SIZE;
        }else if(computeSize + chunksNumber * UNIT_CHUNK_SIZE <= MAX_CHUNK_SIZE){
            computeSize += chunksNumber * UNIT_CHUNK_SIZE;
        }else if(computeSize + chunksNumber * UNIT_CHUNK_SIZE > MAX_CHUNK_SIZE){
            computeSize += MAX_CHUNK_SIZE;
        }
        chunksNumber++
    }
    console.log(chunksNumber);

    function loadChunks(preStart: number, preEnd: number){
        // let start: number, end: number;
        if(currentChunk === 0){
            chunkStart = preStart;
            chunkEnd = (preEnd > inputFile.size) ? inputFile.size : preEnd;
        }else if(preEnd + currentChunk * UNIT_CHUNK_SIZE > MAX_CHUNK_SIZE){
            chunkStart = preEnd;
            chunkEnd = (chunkStart + MAX_CHUNK_SIZE > inputFile.size) ? inputFile.size : chunkStart + MAX_CHUNK_SIZE;
        }else{
            chunkStart = preEnd;
            chunkEnd = (chunkStart + currentChunk * UNIT_CHUNK_SIZE > inputFile.size) ? inputFile.size : chunkStart + currentChunk * UNIT_CHUNK_SIZE;
        }
        console.log(chunkStart);
        console.log(chunkEnd);
        chunkFileReader.readAsText(blobSlice.call(inputFile, chunkStart, chunkEnd));
    }

    loadChunks(chunkStart, chunkEnd);

    chunkFileReader.onload = (e:any) =>{
        let chunkSparkMd5 = new SparkMD5();
        chunkSparkMd5.append(e.target.result);
        let chunkUploadedFlag:boolean = false;

        if(uploadChunkList.fileStatus !== 'notposted'){
            let list = uploadChunkList.uploadedChunk;
            
            for(let i=0; i<list.length; i++){
                if(chunkSparkMd5.end() === list[i].chunkMd5){
                    chunkUploadedFlag = true;
                    break;
                }
            }
        }else if((!chunkUploadedFlag) || (uploadChunkList.fileStatus === 'notposted')){
            let chunkResult: chunk_result_item[] =chunkFileRead(e.target.result);
            chunkFileUpload(chunkResult,totalFileMd5,chunkSparkMd5.end(),chunksNumber)
        }
        if(currentChunk < chunksNumber - 1){
            currentChunk++;
            loadChunks(chunkStart, chunkEnd);
        }
    }

}