interface IncrementEnthusiasm {
    type: string;
}
interface DecrementEnthusiasm {
    type: string;
}
interface UploadStatusChange{
    type: string;
}

const UPLOAD_STATUS_CHANGE = 'UPLOAD_STATUS_CHANGE';
const INCREMENT_ENTHUSIASM = 'INCREMENT_ENTHUSIASM';
const DECREMENT_ENTHUSIASM = 'DECREMENT_ENTHUSIASM';

export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm;
export type UploadStatus = UploadStatusChange;
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
