interface IncrementEnthusiasm {
    type: string;
}
interface DecrementEnthusiasm {
    type: string;
}
interface UploadStatusChange{
    type: string;
    name?: string;
}
interface FileSlected{
    type: string;
    name: string;
}

const UPLOAD_STATUS_CHANGE = 'UPLOAD_STATUS_CHANGE';
const INCREMENT_ENTHUSIASM = 'INCREMENT_ENTHUSIASM';
const DECREMENT_ENTHUSIASM = 'DECREMENT_ENTHUSIASM';
const FILE_SELECTED = 'FILE_SELECTED';

export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm;
export type UploadStatus = UploadStatusChange | FileSlected;

export function UploadStatusChange():UploadStatusChange{
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
export function FileSlected(name:string):FileSlected{
    return {
        type: FILE_SELECTED,
        name: name
    }
}
