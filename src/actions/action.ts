import FileUploader from "../components/FileUploader";

interface IncrementEnthusiasm {
    type: string;
}
interface DecrementEnthusiasm {
    type: string;
}
// interface UploadStatusChange{
//     type: string;
//     name?: string;
// }
// interface FileSlected{
//     type: string;
//     name: string;
// }
// interface FileUpload{
//     type: string;
//     file: object;
//     name?: string;
// }
export interface UploadStatus{
    type: string;
    file?: any;
    name?: string;
    fileStatus?: string;
    fileStatusPercent?: number;
    fileStatusStage?: string;
    chunkList?: string[][];
}

const UPLOAD_STATUS_CHANGE = 'UPLOAD_STATUS_CHANGE';
const INCREMENT_ENTHUSIASM = 'INCREMENT_ENTHUSIASM';
const DECREMENT_ENTHUSIASM = 'DECREMENT_ENTHUSIASM';
const FILE_SELECTED = 'FILE_SELECTED';
const FILE_UPLOAD = 'FILE_UPLOAD';
const FILE_UPLOAD_PROGRESS = 'FILE_UPLOAD_PROGRESS';
const FILE_TABLE_DISPLAY = 'FILE_TABLE_DISPLAY';

export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm;
// export type UploadStatus = UploadStatusChange | FileSlected | FileUpload;

// export function UploadStatusChange():UploadStatusChange{
export function UploadStatusChange():UploadStatus{
    return {
        type: UPLOAD_STATUS_CHANGE
    }
}
export function incrementEnthusiasm():IncrementEnthusiasm{
    return {
        type: INCREMENT_ENTHUSIASM
    }
}
export function decrementEnthusiasm():DecrementEnthusiasm{
    return {
        type: DECREMENT_ENTHUSIASM
    }
}
// export function FileSlected(name:string):FileSlected{
export function FileSlected(file:any):UploadStatus{
    console.log(file);
    return {
        type: FILE_SELECTED,
        file
    }
}
// export function FileUpload(file:object):FileUpload{
export function FileUpload(file:object):UploadStatus{
    return {
        type: FILE_UPLOAD,
        file
    }
}
export function FileUploadProgress(fileStatusPercent:number,fileStatusStage:string){
    return {
        type: FILE_UPLOAD_PROGRESS,
        fileStatusPercent,
        fileStatusStage
    }
}
export function FileTabDisplay(chunkList:string[][]){
    return {
        type : FILE_TABLE_DISPLAY,
        chunkList
    }
}
