import axios from 'axios';
import { BASE_URL } from '../../constant';
import { chunk_result_item } from './chunkFileRead';
import store, { chunkResult } from '../../store';
import * as actions from '../../actions';

interface chunk{
    chunkData: chunk_result_item[],
    fileMd5: string,
    chunkMd5: string,
    chunksNumber: number,
    chunkNumber: number
}

export function chunkFileUpload(item: chunk_result_item[], fileMd5: string, chunkMd5: string, chunksNumber: number, chunkNumber: number){
    let chunkData: chunk = { 
        chunkData: item,
        fileMd5: fileMd5,
        chunkMd5: chunkMd5,
        chunksNumber: chunksNumber,
        chunkNumber: chunkNumber
    }
    // console.log(`uploadChunkMd5: ${chunkMd5} , chunksNumber : ${chunksNumber}`);
    axios({
        method: 'post',
        baseURL: BASE_URL,
        // url: `/uploadFilePart?fileMd5=${fileMd5}&chunkMd5=${chunkMd5}&chunksNumber=${chunksNumber}`,
        // data: data
        url: '/uploadChunkFile',
        data: chunkData
    }).then(res => {
        console.log(res);
        console.log(res.data)
        // console.log(`Math.round ${Math.round((res.data.uploadedChunkList.length / chunksNumber) * 100)}`);
        if(res.data.uploadedChunkList.length === chunksNumber){
            store.dispatch(actions.FileUploadProgress(100));
        }else{
            store.dispatch(actions.FileUploadProgress(Math.round((res.data.uploadedChunkList.length / chunksNumber) * 100)));
        }
        // if(res.data.chunkResult.length != 0){
        //     store.dispatch(actions.VEPFileReceive({data: res.data.chunkResult, fileMd5: res.data.fileMd5}));
        // }
        let chunkResult: chunkResult = {
            data: res.data.chunkResult,
            chunkMd5: res.data.chunkMd5,
            chunkNumber: res.data.chunkNumber
        }
        store.dispatch(actions.VEPFileReceive({
            chunkResult: chunkResult,
            fileMd5: res.data.fileMd5
        }))
        // store.dispatch(actions.VEPFileReceive({data: res.data.data, fileMd5: res.data.fileMd5}));
    }).catch(err => {
        console.error(err.message);
    })
}

// export function changeChunksNumber(chunksNumber:number){
//     axios({
//         method: 'post',
//         baseURL: BASE_URL,
//         url: `/changeChunksNumber?chunksNumber=${chunksNumber}`
//     }).then(res=>{
//         if(res.data.uploadedChunk.length === chunksNumber){
//             store.dispatch(actions.FileUploadProgress(100,'Uploaded!'));
//             store.dispatch(actions.UploadStatusChange());
//         }else{
//             store.dispatch(actions.FileUploadProgress(Math.round((res.data.uploadedChunk.length / chunksNumber) * 100),'Uploading...'));
//         }
//     }).catch(err=>{
//         console.error(err.message);
//     })
// }