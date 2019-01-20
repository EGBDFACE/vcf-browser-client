import * as React from 'react';
import SparkMD5 = require('spark-md5');
import axios from 'axios';

interface Props{

}
interface States{

}
interface Params{
    chunks:{
        chunk: number,
        start: number,
        end: number,
        chunkMd5 : string,
        chunks: number
    }[],
    file:{
        fileName: string,
        fileSize: number,
        fileMd5: string,
        fileChunks: number
    }
}
export default class FileUploader extends React.Component<Props,States>{
    private fileInput: React.RefObject<HTMLInputElement>;
    constructor(props:Props){
        super(props);
        this.fileInput = React.createRef();
    }
    preUpload(){
        let InputFile = this.fileInput.current.files[0];
        let blobSlice = File.prototype.slice;
        let chunkSize = 1024*1024*5;
        let chunks = Math.ceil(InputFile.size/chunkSize);
        let currentChunk = 0;
        let spark = new SparkMD5.ArrayBuffer();
        let chunkFileReader = new FileReader();
        let totalFileReader = new FileReader();
        let params:Params={
            chunks:[],
            file:{
                fileName: '',
                fileSize: 0,
                fileMd5: '',
                fileChunks: 0
            }
        };
        console.log(params);
        totalFileReader.readAsArrayBuffer(InputFile);
        totalFileReader.onload= function (e:any){
            spark.append(e.target.result);
            console.log('totalFileReader:e.target.result'+e.target.result);
            console.log('2'+spark.end());
            params.file.fileMd5 = spark.end();
            console.log('1'+spark.end());
            params.file.fileName = InputFile.name;
            params.file.fileSize = InputFile.size;
            params.file.fileChunks = chunks;
            console.log('totalFileReader success');
        }
        chunkFileReader.onload= function (e:any){
            spark.append(e.target.result);
            let obj = {
                chunk: currentChunk + 1,
                start: currentChunk * chunkSize,
                end: ((currentChunk * chunkSize + chunkSize) >= InputFile.size) ? InputFile.size : currentChunk * chunkSize + chunkSize,
                chunkMd5 : spark.end(),
                chunks : chunks
            }
            currentChunk++;
            params.chunks.push(obj);
            if(currentChunk < chunks){
                loadNext();
            }else{
                console.log('finish loading');
                console.log(params);
                axios({
                    method: 'post',
                    url: 'http://222.20.79.250:8081',
                    data: params,
                    // onUploadProgress: ProgressEvent => {
                    //     var percent = Math.floor(ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
                    //     console.log(percent);
                    // }
                }).then(response =>{
                    console.log(response.data);
                }).catch(error => {
                    console.log(error);
                })
            }
        }
        function loadNext(){
            let chunkStart = currentChunk * chunkSize;
            let chunkEnd = ((chunkStart + chunkSize) > InputFile.size) ? InputFile.size : chunkStart + chunkSize;
            chunkFileReader.readAsArrayBuffer(blobSlice.call(InputFile,chunkStart,chunkEnd));
        }
        loadNext();
    }
    upload(){

    }
    render(){
        return(
            <div>
                <input type= "file" name="file" ref={this.fileInput} onChange = {()=> this.preUpload()}></input>
                <button onClick={()=> this.upload()}>upload</button>
            </div>
        )
    }
}