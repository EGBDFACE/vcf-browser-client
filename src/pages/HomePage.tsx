import * as React from 'react';
// import Upload from '../components/Upload';
import { Link } from 'react-router-dom';
import TableFrame from '../components/TableFrame';
import '@/css/index.scss';
import axios from 'axios';
import { BASE_URL } from '../constant';
import { fileReceive } from '../store';
import LoadingLabel from '../components/LoadingLabel';
import fileHandle from '../utils/fileHandle';
import FileProgress from '../components/FileProgress';

interface fileListItem{
    fileName: string,
    fileMd5: string
}
interface Props{
    UserName: string,
    UserFileList: fileListItem[],
    totalFileTable: string[][],
    fileLoadProgressPercent: number,
    fileUploadProgressPercent: number,
    fileResultFromServer: any[],
    signOut?: () => void,
    userGetFile: (obj:fileReceive) => void
}
interface States{
    fileStatus: string,
    // fileName: string,
    fileObj: any,
    showFileListFlag: boolean,
    showMoreUserInfoFlag: boolean,
    fileList: fileListItem[] //for test
}

export default class Home extends React.Component<Props,States>{
    
    private fileInput: React.RefObject<HTMLInputElement>;

    constructor(props: Props){
        super(props);
        this.state = {
            fileStatus: 'FILE_NOT_SELECTED',
            // fileName: '',
            fileObj: undefined,
            showFileListFlag: false,
            showMoreUserInfoFlag: false,
            fileList: []
        };
        this.fileInput = React.createRef();
    }

    fileListEnable(){
        this.setState({
            showFileListFlag: true
        });
    }
    fileListDisable(){
        this.setState({
            showFileListFlag: false
        });
    }
    moreUserInfoEnable(){
        this.setState({
            showMoreUserInfoFlag: true
        });
    }
    moreUserInfoDisable(){
        this.setState({
            showMoreUserInfoFlag: false
        })
    }
    getFileResult(fileMd5: string){
        let pullData = {fileMd5: fileMd5};
        axios({
            method: 'post',
            baseURL: BASE_URL,
            url: '/pullChunkList',
            data: pullData
        }).then( res => {
            this.props.userGetFile({
                fileMd5: res.data.fileMd5,
                data: res.data.uploadedChunkData
            });
        })
    }
    fileInputChange(value: any){
        this.setState({
            // fileName: value.name,
            fileObj: value,
            fileStatus: 'FILE_SELECTED'
        });
    }
    fileUploadBtClick(){
        this.setState({
            fileStatus: 'FILE_UPLOADING'
        });
        fileHandle(this.state.fileObj);
    }
    componentWillReceiveProps(nextProps: Props){
        if((nextProps.fileUploadProgressPercent != this.props.fileUploadProgressPercent)&&(nextProps.fileUploadProgressPercent === 100)){
            this.setState({
                fileStatus: 'FILE_UPLOADED'
            });
        }
    }
    renderFileListItem(item:fileListItem,index: number){
        return(
            <li key={index} onClick={()=>this.getFileResult(item.fileMd5)} className='fileList__content__list__item'>{item.fileName}</li>
        )
    }
    renderFileInput(){
        switch(this.state.fileStatus){
            case 'FILE_NOT_SELECTED':
            case 'FILE_SELECTED':
            case 'FILE_UPLOADED':
                return(
                    <div className='fileInputDiv'>
                        <input type='file' 
                            accept='text/x-vcard' 
                            id='file'
                            name='file'
                            ref={this.fileInput}
                            className='fileInput'
                            onChange={() => this.fileInputChange(this.fileInput.current.files[0])}
                        />
                        {/* <label htmlFor='file'>{this.state.fileName ? this.state.fileName : 'Choose a file'}</label> */}
                        <label htmlFor='file'>{this.state.fileObj ? this.state.fileObj.name : 'Choose a file'}</label>
                    </div>
                )
            case 'FILE_UPLOADING':
                return(
                    // <span className='fileUploadBt_Disable'>{this.state.fileName}</span>
                    <span className='fileUploadBt_Disable'>{this.state.fileObj.name}</span>
                )
            default:
                return null 
        }
    }
    renderFileUploadBt(){
        switch(this.state.fileStatus){
            case 'FILE_NOT_SELECTED':
                return(
                    <div className='fileUploadBt_Disable'>
                        <span>Start Upload</span>
                    </div>
                )
            case 'FILE_SELECTED':
                return(
                    <button onClick={() => this.fileUploadBtClick()} 
                        className='fileUploadBt_Enable'>
                        Start Upload
                    </button>
                )
            case 'FILE_UPLOADING':
                return(
                    <div className='fileUploadBt_Disable'>
                        <span>Uploading...</span>
                        <LoadingLabel/>
                    </div>
                )
            case 'FILE_UPLOADED':
                return(
                    <div className='fileUploadBt_Disable'>
                        <span>Uploaded!</span>
                    </div>
                )
            default:
                return null
        }
    }
    renderFileProgress(){
        // let percent = this.props.fileProgressPercent;
        let loadPercent = this.props.fileLoadProgressPercent;
        let uploadPercent = this.props.fileUploadProgressPercent;
        // console.log(`load percent : ${loadPercent}`);
        // console.log(`upload percent : ${uploadPercent}`);
        if(this.state.fileStatus === 'FILE_UPLOADING'){
            if(loadPercent != 100){
                return (
                    <FileProgress percent={loadPercent}/>
                )
            }else{
                return (
                    <FileProgress percent={uploadPercent}/>
                )
            }
        }else{
            return null
        }
    }
    render(){
        const { UserName, UserFileList, signOut, totalFileTable } = this.props;
        const temp:string[][] = [];
        for(let i=0;i< 500; i++){
            temp[i] = [];
            for(let j=0; j<9; j++){
                temp[i][j] = (i+j).toString();
            }
        }
        // const { name } = this.props;
        // const fileList = this.state.fileList;
        const hidden = { display: 'none'};
        return (
            <div>
                <div className='header'>
                    <div className='header__inner'>
                        <h1>VCF browser</h1>
                        <div className='header__userInfo'>
                            <i onMouseEnter={()=>this.fileListEnable()} onMouseLeave={()=>this.fileListDisable()} className='header__fileList' style={UserName?null:hidden}></i>
                            <div onMouseEnter={()=>this.fileListEnable()} onMouseLeave={()=>this.fileListDisable()} style={this.state.showFileListFlag?null:hidden} className='header__fileList__content'>
                                <span className='fileList__content__arrow'></span>
                                <p className='fileList__content__header'>已上传文件</p>
                                <p style={UserFileList.length===0?null:hidden}>(空)</p>
                                <ul style={UserFileList.length===0?hidden:null} className='fileList__content__list'>
                                  {UserFileList.map((value,index)=>this.renderFileListItem(value,index))}
                                </ul>
                            </div>
                            <div className='header__profile'>
                                <Link to='/signIn' style={UserName?hidden:null} className='button__login'>Sign in</Link>
                                <Link to='/signUp' style={UserName?hidden:null} className='button__primary'>Sign Up</Link>
                                <i onMouseEnter={()=>this.moreUserInfoEnable()} onMouseLeave={()=>this.moreUserInfoDisable()} style={UserName?null:hidden} className='header__profile__icon'></i>
                                <div onMouseEnter={()=>this.moreUserInfoEnable()} onMouseLeave={()=>this.moreUserInfoDisable()} style={this.state.showMoreUserInfoFlag?null:hidden} className='header__profile__menu'>
                                    <span className='header__profile__menu__arrow'></span>
                                    <p className='header__profile__menu__quit' onClick={signOut} >退出</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Upload/> */}
                <div className='fileUpload'>
                    {this.renderFileInput()}
                    {this.renderFileUploadBt()}
                    {this.renderFileProgress()}
                 </div>
                {/* <Hello nameadd='sra'/> */}
                <TableFrame totalFile={totalFileTable} />
                {/* <ChartDisplay/> */}
            </div>
        );
    }
}