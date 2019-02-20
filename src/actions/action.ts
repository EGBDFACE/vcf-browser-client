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
    file?: object;
    name?: string;
}

const UPLOAD_STATUS_CHANGE = 'UPLOAD_STATUS_CHANGE';
const INCREMENT_ENTHUSIASM = 'INCREMENT_ENTHUSIASM';
const DECREMENT_ENTHUSIASM = 'DECREMENT_ENTHUSIASM';
const FILE_SELECTED = 'FILE_SELECTED';
const FILE_UPLOAD = 'FILE_UPLOAD';

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
export function FileSlected(name:string):UploadStatus{
    return {
        type: FILE_SELECTED,
        name
    }
}
// export function FileUpload(file:object):FileUpload{
export function FileUpload(file:object):UploadStatus{
    return {
        type: FILE_UPLOAD,
        file
    }
}
