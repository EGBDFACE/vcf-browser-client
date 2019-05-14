import * as SparkMD5 from 'spark-md5';
import axios from 'axios';
import { BASE_URL } from '../../constant';
import { FIRST_CHUNK_SIZE , UNIT_CHUNK_SIZE , MAX_CHUNK_SIZE } from '../../constant';
import store from '../../store';
import * as actions from '../../actions';
import {chunkFileRead, chunk_result_item} from './chunkFileRead';
import {chunkFileUpload } from './chunkFileUpload';

interface pullChunkData{
    fileMd5: string,
    chunksNumber: number,
    userName: string,
    fileName: string
}
interface pullChunkRes{
    uploadedChunkList: string[],
    fileStatus: string
}

export default function fileHandle(inputFile: any){
    let totalFileReader = new FileReader();
    let totalFileMd5:string = '';
    // let uploadChunkList:upload_chunk_list = {
    //     fileStatus: '',
    //     uploadedChunk: []
    // };
    let uploadedData:pullChunkRes;

    totalFileReader.readAsArrayBuffer(inputFile);

    totalFileReader.onload = function(e:any){
        let sparkTotal = new SparkMD5.ArrayBuffer();
        sparkTotal.append(e.target.result);
        totalFileMd5 = sparkTotal.end();
    }

    totalFileReader.onloadend = ()=>{
        let chunksNumber: number = getChunksNumber(inputFile);
        let pullData: pullChunkData = {
            fileName: inputFile.name,
            fileMd5: totalFileMd5,
            chunksNumber: chunksNumber,
            userName: store.getState().userInfo.name
        };
        if(JSON.stringify(store.getState().userInfo.fileList).indexOf(totalFileMd5) === -1){
            store.dispatch(actions.userFileListUpdate(inputFile.name, totalFileMd5));
        }
        axios({
            method: 'post',
            baseURL: BASE_URL,
            // url: `/pullChunkList?fileMd5=${totalFileMd5}&chunksNumber=${chunksNumber}`
            url: '/pullChunkList',
            data: pullData
        }).then( response => {
            console.log(response);
            // uploadChunkList = response.data;
            uploadedData = {
                fileStatus: response.data.fileStatus,
                uploadedChunkList: response.data.uploadedChunkList
            };
            if(uploadedData.fileStatus == 'notPosted'){
                store.dispatch(actions.FileUploadProgress(0,'Uploading'));
                fileSplit(inputFile,uploadedData,totalFileMd5);
            }else if(uploadedData.fileStatus == 'posting'){
                store.dispatch(actions.FileUploadProgress(Math.round((uploadedData.uploadedChunkList.length / chunksNumber) * 100),'Uploading'));
                fileSplit(inputFile,uploadedData,totalFileMd5);
            }else{
                store.dispatch(actions.FileUploadProgress(100,'Uploaded!'));
                store.dispatch(actions.UploadStatusChange());
            }
            if((response.data.uploadedChunkData)&&(response.data.uploadedChunkData.length != 0)){
                store.dispatch(actions.VEPFileReceive({data: response.data.uploadedChunkData, fileMd5: response.data.fileMd5}));
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

function fileSplit(inputFile: any, uploadedData: pullChunkRes,totalFileMd5:string){
    let currentChunk: number = 0,
        chunkStart: number = 0,
        chunkEnd: number = FIRST_CHUNK_SIZE;
    let chunkFileReader = new FileReader();
    let blobSlice = File.prototype.slice;
    let chunksNumber: number = getChunksNumber(inputFile);

    let uploadChunksNumber: number = chunksNumber;
    function loadChunks(preStart: number, preEnd: number){
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
        chunkFileReader.readAsText(blobSlice.call(inputFile, chunkStart, chunkEnd));
    }

    loadChunks(chunkStart, chunkEnd);

    chunkFileReader.onload = (e:any) =>{
        let chunkSparkMd5 = new SparkMD5();
        chunkSparkMd5.append(e.target.result);
        let chunkUploadedFlag:boolean = false;
        let currentChunkSparkMd5 = chunkSparkMd5.end();

        if(uploadedData.fileStatus == 'posting'){
            let list = uploadedData.uploadedChunkList;
            
            for(let i=0; i<list.length; i++){
                if(currentChunkSparkMd5 === list[i]){
                    chunkUploadedFlag = true;
                    break;
                }
            }
        }
        
        if((!chunkUploadedFlag) || (uploadedData.fileStatus == 'notPosted')){
            let chunkResult: chunk_result_item[] = chunkFileRead(e.target.result);
            // console.log(chunkResult);
            // console.log(chunkResult.length);
            // console.log(uploadChunksNumber);
            chunkFileUpload(chunkResult, totalFileMd5, currentChunkSparkMd5, chunksNumber, currentChunk);
            // if(chunkResult.length != 0){
            //     chunkFileUpload(chunkResult,totalFileMd5,currentChunkSparkMd5,uploadChunksNumber);
            // }else{
            //     uploadChunksNumber--;
            //     changeChunksNumber(uploadChunksNumber);
            // }
        }

        if(currentChunk < chunksNumber - 1){
            currentChunk++;
            loadChunks(chunkStart, chunkEnd);
        }
    }

}

function getChunksNumber(inputFile:any){
    let computeSize: number = 0,
        chunksNumber: number = 0;

    while(computeSize < inputFile.size){
        if(computeSize === 0){
            computeSize = FIRST_CHUNK_SIZE;
        }else if(computeSize + chunksNumber * UNIT_CHUNK_SIZE <= MAX_CHUNK_SIZE){
            computeSize += chunksNumber * UNIT_CHUNK_SIZE;
        }else if(computeSize + chunksNumber * UNIT_CHUNK_SIZE > MAX_CHUNK_SIZE){
            computeSize += MAX_CHUNK_SIZE;
        }
        chunksNumber++;
    }

    return chunksNumber;
}