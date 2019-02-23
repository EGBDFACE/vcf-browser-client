import * as React from 'react';
import '../index.scss';
import LoadingLabel from './LoadingLabel';

interface Props{
    // uploading: boolean,
    fileStatus: string,
    inputFile: object,
    fileStatusStage: string,
    fileUpload: (file:object) => void
}
interface States{

}

export default class UploadBt extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
    }
    render(){
        const { fileStatus,inputFile,fileUpload,fileStatusStage } = this.props;
        // console.log(fileStatus);
        // console.log(fileStatusStage);
        switch(fileStatus){
            case 'FILE_NOT_SELECTED':
                return(
                    <div  className='fileUploadBt_Disable'>
                        <span>{fileStatusStage}</span>
                    </div>
                )
            case 'PREPARE_TO_UPLOAD':
                return(
                    <button onClick = {()=>fileUpload(inputFile)} className='fileUploadBt_Enable'>{fileStatusStage}</button>
                )
            case 'UPLOADING':
                return(
                    <div className='fileUploadBt_Disable'>
                        <span>{fileStatusStage}</span>
                        <LoadingLabel/>
                    </div>
                    
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