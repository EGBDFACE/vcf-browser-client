import * as React from 'react';
import '../index.scss';
import { FileUpload } from '../actions/action';

interface Props{
    // uploading: boolean,
    fileStatus: string,
    inputFile: object,
    fileUpload: (file:object) => void
}
interface States{

}

export default class BtUpload extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
    }
    render(){
        const { fileStatus,inputFile,fileUpload } = this.props;
        switch(fileStatus){
            case 'FILE_NOT_SELECTED':
                return(
                    <div  className='fileUploadBt_Disable'>
                        <span>Start Upload</span>
                    </div>
                );
            case 'PREPARE_TO_UPLOAD':
                return(
                    <button onClick = {()=>fileUpload(inputFile)} className='fileUploadBt_Enable'>UPLOAD</button>
                )
            case 'UPLOADING':
                return(
                    <span>Uploading</span>
                )
            default: return <span>loading...</span>
        }
        // if(uploading){
        //     return(
        //         <button onClick = {()=>fileUpload(inputFile)}>UPLOADING...</button>
        //     )
        // }
        // else{
        //     return(
        //         <span></span>
        //     )
        // }
    }
}