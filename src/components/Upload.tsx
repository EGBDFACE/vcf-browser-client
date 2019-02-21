import * as React from 'react';
import UploadBt from '../containers/UploadBt';
import UploadInput from '../containers/UploadInput';
// import * as axios from 'axios';
import '../index.scss';

interface Props{

}
interface States{

}

export default class Upload extends React.Component<Props,States>{
    // private fileInput: React.RefObject<HTMLInputElement>;
    constructor(props:Props){
        super(props);
        // this.fileInput = React.createRef();
    }
    // fileSelect(name:any){
    //     // console.log(this.fileInput.current.files[0]);
    //     console.log(name);
    // }
    render(){
        // const { selectedFileName, fileSelect,fileUpload} = this.props;
        // console.log(this.props)
        // console.log(selectedFileName)
        // console.log(this.fileInput.current.files[0]); 
        return(
            <div className='fileUpload'>
                <UploadInput/>
                <UploadBt/>
                {/* <button onClick={()=> fileUpload(this.fileInput.current.files[0])} className='fileUploadBt fileUploadBt_disable'>UPLOAD</button> */}
            </div>
        )
    }
}