import * as React from 'react';
import Upload from '../components/Upload';
import { Link } from 'react-router-dom';
// import TableFrame from '../containers/TableFrame';
import '@/index.scss';
import axios from 'axios';
import ChartDisplay from '../containers/ChartDisplay';
import { BASE_URL } from '../constant';
import { fileReceive } from '../store';

interface fileListItem{
    fileName: string,
    fileMd5: string
}
interface Props{
    name: string,
    fileList: fileListItem[],
    signOut?: () => void,
    userGetFile: (obj:fileReceive) => void
}
interface States{
    showFileListFlag: boolean,
    showMoreUserInfoFlag: boolean,
    fileList: fileListItem[]
}

export default class Home extends React.Component<Props,States>{
    constructor(props: Props){
        super(props);
        this.state = {
            showFileListFlag: false,
            showMoreUserInfoFlag: false,
            fileList: [
                {
                    fileName: 'file 1',
                    fileMd5: 'dsaghsjgkasjlfasklg'
                },
                {
                    fileName: 'file 2',
                    fileMd5: 'dasgiooipugskajdorug',
                },
                {
                    fileName: 'file 3',
                    fileMd5: 'fahguuijalkjflkjasl'
                }
            ]
        }
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
    renderFileListItem(item:fileListItem,index: number){
        return(
            <li key={index} onClick={()=>this.getFileResult(item.fileMd5)} className='fileList__content__list__item'>{item.fileName}</li>
        )
    }

    render(){
        const { name, fileList, signOut } = this.props;
        // const { name } = this.props;
        // const fileList = this.state.fileList;
        const hidden = { display: 'none'};
        return (
            <div>
                <div className='header'>
                    <div className='header__inner'>
                        <h1>VCF browser</h1>
                        <div className='header__userInfo'>
                            <i onMouseEnter={()=>this.fileListEnable()} onMouseLeave={()=>this.fileListDisable()} className='header__fileList' style={name?null:hidden}></i>
                            <div onMouseEnter={()=>this.fileListEnable()} onMouseLeave={()=>this.fileListDisable()} style={this.state.showFileListFlag?null:hidden} className='header__fileList__content'>
                                <span className='fileList__content__arrow'></span>
                                <p className='fileList__content__header'>已上传文件</p>
                                <p style={fileList.length===0?null:hidden}>(空)</p>
                                <ul style={fileList.length===0?hidden:null} className='fileList__content__list'>
                                  {fileList.map((value,index)=>this.renderFileListItem(value,index))}
                                </ul>
                            </div>
                            <div className='header__profile'>
                                <Link to='/signIn' style={name?hidden:null} className='button__login'>Sign in</Link>
                                <Link to='/signUp' style={name?hidden:null} className='button__primary'>Sign Up</Link>
                                <i onMouseEnter={()=>this.moreUserInfoEnable()} onMouseLeave={()=>this.moreUserInfoDisable()} style={name?null:hidden} className='header__profile__icon'></i>
                                <div onMouseEnter={()=>this.moreUserInfoEnable()} onMouseLeave={()=>this.moreUserInfoDisable()} style={this.state.showMoreUserInfoFlag?null:hidden} className='header__profile__menu'>
                                    <span className='header__profile__menu__arrow'></span>
                                    <p className='header__profile__menu__quit' onClick={signOut} >退出</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Upload/>
                {/* <Hello nameadd='sra'/> */}
                {/* <TableFrame /> */}
                <ChartDisplay/>
            </div>
        );
    }
}