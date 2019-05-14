// import FileUploader from "../components/FileUploader";

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
    // chunkTabList?: object[];
}
export interface TableDisplay{
    type: string;
    inputPageNumber?: number;
    singlePageNumber?: number;
    totalPageNumber?: number;
}
export interface VEPFileReceive{
    type?: string,
    data: any[],
    // chunkMd5: string,
    fileMd5: string
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

const UPLOAD_STATUS_CHANGE = 'UPLOAD_STATUS_CHANGE';
const INCREMENT_ENTHUSIASM = 'INCREMENT_ENTHUSIASM';
const DECREMENT_ENTHUSIASM = 'DECREMENT_ENTHUSIASM';
const FILE_SELECTED = 'FILE_SELECTED';
const FILE_UPLOAD = 'FILE_UPLOAD';
const FILE_UPLOAD_PROGRESS = 'FILE_UPLOAD_PROGRESS';
const FILE_TABLE_DISPLAY = 'FILE_TABLE_DISPLAY';
const VCF_TABLE_FRAME_PREVIOUS = 'VCF_TABLE_FRAME_PREVIOUS';
const VCF_TABLE_FRAME_NEXT = 'VCF_TABLE_FRAME_NEXT';
const VCF_TABLE_FRAME_INPUT_PAGE = 'VCF_TABLE_FRAME_INPUT_PAGE';
const VCF_TABLE_FRAME_SINGLE_PAGE = 'VCF_TABLE_FRAME_SINGLE_PAGE';
const VEP_RESULT_NOTPOSTED_CHANGE = 'VEP_RESULT_NOTPOSTED_CHANGE';
const USER_SIGN_IN = 'USER_SIGN_IN';
const USER_SIGN_OUT = 'USER_SIGN_OUT';
const USER_FILELIST_UPDATE = 'USER_FILELIST_UPDATE';
// const VCF_TABLE_FRAME_TOTAL_PAGE = 'VCF_TABLE_FRAME_TOTAL_PAGE';

export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm ;
// export type UploadStatus = UploadStatusChange | FileSlected | FileUpload;
export type AllAction = UploadStatus | TableDisplay | VEPFileReceive | userInfoAction;
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
    // console.log(file);
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
// export function FileTabDisplay(chunkTabList:object[]){
    // console.log(chunkList);
    return {
        type : FILE_TABLE_DISPLAY,
        chunkList
        // chunkTabList
    }
}
export function VCFTableFrame_Previous():TableDisplay{
    return {
        type: VCF_TABLE_FRAME_PREVIOUS
    }
}
export function VCFTableFrame_Next():TableDisplay{
    return{
        type: VCF_TABLE_FRAME_NEXT
    }
}
export function VCFTableFrame_InputPage(totalPageNumber:number,inputPageNumber:number):TableDisplay{
    return{
        type: VCF_TABLE_FRAME_INPUT_PAGE,
        inputPageNumber,
        totalPageNumber
    }
}
export function VCFTableFrame_SinglePage(singlePageNumber:number):TableDisplay{
    return{
        type: VCF_TABLE_FRAME_SINGLE_PAGE,
        singlePageNumber
    }
}
export function VEPFileReceive(responseFile:VEPFileReceive):VEPFileReceive{
    return{
        type: VEP_RESULT_NOTPOSTED_CHANGE,
        fileMd5: responseFile.fileMd5,
        // chunkMd5: responseFile.chunkMd5,
        data: responseFile.data
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
// export function VCFTableFrame_TotalPage(totalPageNumber:number):TableDisplay{
//     return{
//         type: VCF_TABLE_FRAME_TOTAL_PAGE,
//         totalPageNumber
//     }
// }