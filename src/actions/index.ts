import { chunkResult } from "../store";

export interface FileProgress{
    type: string;
    percent: number;
}
export interface FileTable{
    type: string;
    chunkList: string[][];
}
export interface FileUpload extends FileProgress,FileTable{}

export interface VEPFileReceive{
    type?: string,
    // data: any[],
    chunkResult: chunkResult
    // chunkMd5: string,
    fileMd5: string
    chunksResult?: any[]
}
export interface userInfoAction{
    type: string,
    name?: string,
    fileList?: {
        fileName: string,
        fileMd5: string
    }[],
    fileName?: string,
    fileMd5?: string
}

const FILE_UPLOAD_PROGRESS = 'FILE_UPLOAD_PROGRESS';
const FILE_LOAD_PROGRESS = 'FILE_LOAD_PROGRESS';
const FILE_TABLE_DISPLAY = 'FILE_TABLE_DISPLAY';
const VEP_RESULT_NOTPOSTED_CHANGE = 'VEP_RESULT_NOTPOSTED_CHANGE';
const VEP_FILE_INPUT_CHANGE = 'VEP_FILE_INPUT_CHANGE';
const USER_SIGN_IN = 'USER_SIGN_IN';
const USER_SIGN_OUT = 'USER_SIGN_OUT';
const USER_FILELIST_UPDATE = 'USER_FILELIST_UPDATE';
const VEP_RESULT_CHANGE_FROM_PULLCHUNKLIST = 'VEP_RESULT_CHANGE_FROM_PULLCHUNKLIST';

export function FileUploadProgress(percent:number): FileProgress{
    return {
        type: FILE_UPLOAD_PROGRESS,
        percent
    }
}
export function FileLoadProgress(percent: number): FileProgress{
    return{
        type: FILE_LOAD_PROGRESS,
        percent
    }
}
export function FileTabDisplay(chunkList:string[][]) : FileTable{
    return {
        type : FILE_TABLE_DISPLAY,
        chunkList
    }
}
export function VEPFileReceive(responseFile:VEPFileReceive):VEPFileReceive{
    return{
        type: VEP_RESULT_NOTPOSTED_CHANGE,
        fileMd5: responseFile.fileMd5,
        // chunkMd5: responseFile.chunkMd5,
        // data: responseFile.data
        chunkResult: responseFile.chunkResult
    }
}
export function VEPFileChangeFromPullChunkList(data:any){
    return{
        type: VEP_RESULT_CHANGE_FROM_PULLCHUNKLIST,
        fileMd5: data.fileMd5,
        chunksResult: data.chunksResult
    }
}
export function InputFileChange(){
    return {
        type: VEP_FILE_INPUT_CHANGE
    }
}
export function userSignIn(name: string, fileList: {fileName:string,fileMd5:string}[]):userInfoAction{
    return{
        type: USER_SIGN_IN,
        name,
        fileList
    }
}
export function userSignOut(){
    return{
        type: USER_SIGN_OUT
    }
}
export function userFileListUpdate(fileName: string, fileMd5: string){
    return{
        type: USER_FILELIST_UPDATE,
        fileName,
        fileMd5
    }
}
