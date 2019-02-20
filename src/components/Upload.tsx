import * as React from 'react';
import BtUpload from '../containers/BtUpload';
// import * as axios from 'axios';
import '../index.scss';

interface Props{
    selectedFileName: string,
    fileSelect?: (file:object) => void,
    fileUpload?: (file:object) => void
}
interface States{

}

export default class Upload extends React.Component<Props,States>{
    private fileInput: React.RefObject<HTMLInputElement>;
    constructor(props:Props){
        super(props);
        this.fileInput = React.createRef();
    }
    // fileSelect(name:any){
    //     // console.log(this.fileInput.current.files[0]);
    //     console.log(name);
    // }
    render(){
        const { selectedFileName, fileSelect,fileUpload} = this.props;
        // console.log(this.props)
        // console.log(selectedFileName)
        // console.log(this.fileInput.current.files[0]); 
        return(
            <div className='fileUpload'>
                <input type= "file" accept='text/x-vcard' id='file' name="file" ref={this.fileInput} className='fileInput' onChange={()=>fileSelect(this.fileInput.current.files[0])}/>
                <label htmlFor='file'>{selectedFileName}</label>
                <BtUpload/>
                {/* <button onClick={()=> fileUpload(this.fileInput.current.files[0])} className='fileUploadBt fileUploadBt_disable'>UPLOAD</button> */}
            </div>
        )
    }
}