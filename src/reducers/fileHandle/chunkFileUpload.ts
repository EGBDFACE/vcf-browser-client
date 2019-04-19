import axios from 'axios';
import { BASE_URL } from '../../constant';
import { chunk_result_item } from './chunkFileRead';
import store from '../../store/store';
import * as actions from '../../actions/action';

export default function chunkFileUpload(data: chunk_result_item[], fileMd5: string, chunkMd5: string, chunksNumber: number){
    console.log(`uploadChunkMd5: ${chunkMd5}`);
    axios({
        method: 'post',
        baseURL: BASE_URL,
        url: `/upload_file_part?fileMd5=${fileMd5}&chunkMd5=${chunkMd5}&chunksNumber=${chunksNumber}`,
        data: data
    }).then(res => {
        if(res.data.uploadedChunk.length === chunksNumber){
            store.dispatch(actions.FileUploadProgress(100,'Uploaded!'));
            store.dispatch(actions.UploadStatusChange());
        }else{
            store.dispatch(actions.FileUploadProgress(Math.round((res.data.uploadedChunk.length / chunksNumber) * 100), 'Uploading...'));
        }
        console.log(res);
        store.dispatch(actions.VEPFileReceive({data: res.data.data, fileMd5: res.data.fileMd5}));
    }).catch(err => {
        console.error(err.message);
    })
}