import * as React from 'react';
// import Upload from '../components/Upload';
import { Link } from 'react-router-dom';
import TableFrame from '../components/TableFrame';
import '@/css/index.scss';
import axios from 'axios';
import { BASE_URL } from '../constant';
import LoadingLabel from '../components/LoadingLabel';
import fileHandle from '../utils/fileHandle';
import FileProgress from '../components/FileProgress';
import FilterBar from '../components/FilterBar';
import { chunkResult } from '../store';
import draw from '../utils/chartDisplay/draw';

interface fileListItem{
    fileName: string,
    fileMd5: string
}
interface vcfRequirement{
    value: string,
    label: string,
    deleteFlag: boolean
}
interface Props{
    UserName: string,
    UserFileList: fileListItem[],
    totalFileTable: string[][],
    fileLoadProgressPercent: number,
    fileUploadProgressPercent: number,
    // fileResultFromServer: any[],
    chunksResultData: chunkResult[],
    chunksResultDataTotal: any[],
    signOut?: () => void,
    userGetFile: (obj:any) => void
}
interface States{
    fileStatus: string,
    // fileName: string,
    fileObj: any,
    showFileListFlag: boolean,
    showMoreUserInfoFlag: boolean,
    showVepFilterFlag: boolean,
    // vcfFilters: vcfRequirement[],
    vcfFilteredTableData: string[][],
    vcfTableHeaders: string[],
    vepFilterHeaders: string[],
    vepFilterData: any[],
    selectedChunkIndex: number,
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
            showVepFilterFlag: false,
            fileList: [],
            // vcfFilters: [],
            vcfFilteredTableData: this.props.totalFileTable,
            vcfTableHeaders: ['Row Index','CHROM','POS','ID','REF','ALT','QUAL','FILTER','INFO'],
            vepFilterHeaders: ['CHROM','POS','ENSEMBLID','TRANSCRIPTID','PROTEINID'],
            vepFilterData: this.props.chunksResultDataTotal,
            selectedChunkIndex: undefined
        };
        this.fileInput = React.createRef();
    }
    vcfFiltersChange(req: vcfRequirement[]){
        // let vcfData = this.props.totalFileTable;
        if(req.length === 0){
            this.setState({
                vcfFilteredTableData: this.props.totalFileTable
            })
        }else{
            let vcfData = this.props.totalFileTable;
            vcfData = vcfFilter(vcfData,req,this.state.vcfTableHeaders);
            this.setState({
                vcfFilteredTableData: vcfData
            })
        }
    }
    vepFiltersChange(req: vcfRequirement[]){
        if(req.length === 0){
            this.setState({
                vepFilterData: this.props.chunksResultDataTotal
            });
            draw(this.props.chunksResultDataTotal);
        }else{
            let vepData = this.props.chunksResultDataTotal;
            vepData = vepFilter(vepData, req);
            this.setState({
                vepFilterData: vepData
            })
            draw(vepData);
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
                // data: res.data.uploadedChunkData
                chunksResult: res.data.uploadedChunkData
            });
            // this.setState({
            //     vepFilterData: res.data.uploadeddChunkData
            // });
            this.setState({
                // selectedChunkIndex: 1
                showVepFilterFlag: true
            })
            draw(res.data.uploadedChunkData);
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
        if(nextProps.totalFileTable.length != this.props.totalFileTable.length){
            this.setState({
                vcfFilteredTableData: nextProps.totalFileTable
            })
        }
        if(nextProps.chunksResultDataTotal.length != this.props.chunksResultDataTotal.length){
            this.setState({
                vepFilterData: nextProps.chunksResultDataTotal
            })
        }
    }
    drawChunkDisplay(index: number){
        this.setState({
            vepFilterData: this.props.chunksResultData[index].data,
            selectedChunkIndex: index,
            showVepFilterFlag: false
        });
        draw(this.props.chunksResultData[index].data);
    }
    drawAllChunksDisplay(){
        this.setState({
            vepFilterData: this.props.chunksResultDataTotal,
            selectedChunkIndex: this.props.chunksResultData.length,
            showVepFilterFlag: true
        })
        draw(this.props.chunksResultDataTotal);
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
    renderChartDisplayChunk(value: chunkResult, index: number){
        // const selectedStyle = {border: '1px solid black'};
        const selectedIndex = this.state.selectedChunkIndex;
        if(value.data.length === 0){
            return undefined
        }else{
            if(selectedIndex === index){
                return(
                    <span className = 'chartDisplay__chunkLabel__selected'
                        key={index}
                    >chunk: {index+1}
                    </span>
                )
            }else{
               return(
                    <div className='chartDisplay__chunkLabel'
                        key={index}
                        onClick={()=>this.drawChunkDisplay(index)}
                        // style={selectedIndex === index ? selectedStyle : undefined}
                    >chunk: {index+1}</div>
                ) 
            }
        }
    }
    renderChartDisplayTotal(){
        const selectedIndex = this.state.selectedChunkIndex;
        const hidden = { display: 'none' };
        if(selectedIndex === this.props.chunksResultData.length){
            return (
                <span className = 'chartDisplay__chunkLabel__selected'>total</span>
            )
        }else{
            return(
                <div className='chartDisplay__chunkLabel'
                        style={this.state.fileStatus === 'FILE_UPLOADED' ? undefined : hidden }
                        onClick={()=>this.drawAllChunksDisplay()}
                >total</div>
            )
        }
    }
    renderChartDisplayFilter(){
        const vepFilterHeaders = this.state.vepFilterHeaders;
        if(this.state.showVepFilterFlag){
            return(
                <FilterBar filterHeaders={vepFilterHeaders}
                    filtersChange={(value)=>this.vepFiltersChange(value)}
                    />
            )
        }else{
            return undefined
        }
    }
    render(){
        const { UserName, UserFileList, signOut, chunksResultData, chunksResultDataTotal } = this.props;
        // const vcfTableHeaders= ['Row Index','CHROM','POS','ID','REF','ALT','QUAL','FILTER','INFO'];
        const temp:string[][] = [];
        for(let i=0;i< 500; i++){
            temp[i] = [];
            for(let j=0; j<9; j++){
                temp[i][j] = (i+j).toString();
            }
        }
        // const { name } = this.props;
        // const fileList = this.state.fileList;
        // const vcfTableHeaders = this.state.vcfTableHeaders;
        const vcfTableData = this.state.vcfFilteredTableData;
        const { vepFilterData, vepFilterHeaders,  vcfTableHeaders} = this.state;
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
                <div className='TableDisplay' style={vcfTableData.length === 0 ? hidden : undefined}>
                    <FilterBar filterHeaders={vcfTableHeaders.slice(1)}
                        filtersChange={(value)=>this.vcfFiltersChange(value)}
                        />
                    <TableFrame totalFile={vcfTableData} 
                        tableHeaders={vcfTableHeaders}
                        />
                </div>
                <div className='chartDisplay'
                    style={vepFilterData.length === 0 ? hidden : undefined}
                >
                    {chunksResultData.map((value,index)=>this.renderChartDisplayChunk(value,index))}
                    {this.renderChartDisplayTotal()}
                    {this.renderChartDisplayFilter()}
                    {/* <canvas width='800' height='800'></canvas> */}
                    <div className='canvasElement'></div>
                </div>
                {/* <ChartDisplay/> */}
            </div>
        );
    }
}

function vcfFilter(data: string[][], filters: vcfRequirement[], headers: string[]): string[][]{
    let filteredData: string[][] = [];
    let headerObj:any = {};
    for(let i=0; i<headers.length; i++){
        headerObj[headers[i]] = i;
    }
    for(let i=0; i<data.length;i++){
        let pairFlag: boolean = true;
        for(let j=0; j<filters.length; j++){
            if(filters[j].label === 'CHROM'){ // 染色体号严格匹配
                if(data[i][1] != filters[j].value){
                    pairFlag = false;
                    break;
                }
            }else if(data[i][headerObj[filters[j].label]].indexOf(filters[j].value) === -1){
                pairFlag = false;
                break;
            }
        }
        if(pairFlag){
            filteredData.push(data[i]);
        }
    }
    return filteredData;
}

function vepFilter(data: any[], filters: vcfRequirement[]): any[]{
    // let reqObj: any = {};
    let filteredData: any[] = [];
    // for(let i=0 ; i<filters.length; i++){
    //     reqObj[filters[i].label] = filters[i].value;
    // }
    for(let i=0 ; i< data.length; i++){
        let pairFlag: boolean = true;
        for(let j=0; j<filters.length; j++){
            if(filters[j].label === 'CHROM'){
                if(data[i].Location.chrom != filters[j].value){
                    pairFlag = false;
                    break;
                }
            }else if(filters[j].label === 'POS'){
                if((data[i].Location.start>=+filters[j].value)||(data[i].Location.end <= +filters[j].value)){
                    pairFlag = false;
                    break;
                }
            }else if(filters[j].label === 'ENSEMBLID'){
                if(data[i].EnsemblID != filters[j].value){
                    pairFlag = false;
                    break;
                }
            }else if(filters[j].label === 'TRANSCRIPTID'){
                if((data[i].transcriptConsequences)&&(data[i].transcriptConsequences.length != 0)&&(data[i].transcriptConsequences[0].Transcript)){
                    if(data[i].transcriptConsequences[0].Transcript.ID != filters[j].value){
                        pairFlag = false;
                        break;
                    }
                }else{
                    pairFlag = false;
                    break;
                }
            }else if(filters[j].label === 'PROTEINID'){
                if((data[i].transcriptConsequences)&&(data[i].transcriptConsequences.length != 0)&&(data[i].transcriptConsequences[0].Protein)){
                    if(data[i].transcriptConsequences[0].Protein.ID != filters[j].value){
                        pairFlag = false;
                        break;
                    }
                }else {
                    pairFlag = false;
                    break;
                }
            }else{
                console.error('wrong filter label');
            }
        }
        if(pairFlag){
            filteredData.push(data[i]);
        }
    }
    // return []
    return filteredData;
}