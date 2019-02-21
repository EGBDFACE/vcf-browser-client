import * as React from 'react';
import '../index.scss';

interface Props{
    selectedFileName: string,
    fileStatus: string,
    fileSelect?: (file:object) => void
}
interface States{

}

export default class UploadInput extends React.Component<Props,States>{
    private fileInput: React.RefObject<HTMLInputElement>;
    constructor(props:Props){
        super(props);
        this.fileInput = React.createRef();
    }
    render(){
        const { fileStatus,fileSelect,selectedFileName } = this.props;
        if(fileStatus === 'UPLOADING'){
            return(
                <span className='fileUploadBt_Disable'>{selectedFileName}</span>
            )
        }else{
            return(
                <div className='fileInputDiv'>
                    <input type= "file" accept='text/x-vcard' id='file' name="file" ref={this.fileInput} className='fileInput' onChange={()=>fileSelect(this.fileInput.current.files[0])}/>
                    <label htmlFor='file'>{selectedFileName}</label>
                </div>
            )
        }
    }
}