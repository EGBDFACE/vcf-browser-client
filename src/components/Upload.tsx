import * as React from 'react';
// import SparkMD5 = require('spark-md5');
import * as SparkMD5 from 'spark-md5';
import axios from 'axios';
// import * as axios from 'axios';

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
interface preloadedFormat{
    file:{
        fileMd5:string,
        chunksNumber: number,
        chunkSize: number,
        fileMd5Status:boolean
    },
    chunk:{
        chunkNumber: number,
        chunkMd5: string,
        chunkFile:{
            fileformat: string,
            Chrom: string,
            body:{
                CHROM: string,
                POS: string,
                ID: string,
                REF: string,
                ALT: string,
                QUAL: string,
                FILTER: string,
                INFO: string
            }[],
            startLine: string,
            endLine: string
        }
    }
}
interface checkoutInfo{
    fileMd5: string,
    chunksNumber: number,
    chunkSize: number,
    chunk:{
        chunkMd5:string,
        chunkNumber: number
    }[]
}
interface uploadChunkList{
    // getListStatus?:boolean,
    fileStatus:string,
    fileMd5: string,
    chunksNumber: number,
    // emptyFileMd5:string,
    // fileMd5:string,
    uploadedChunk:{
        chunkMd5:string
        chunkNumber: number
    }[]
}
export default class Upload extends React.Component<Props,States>{
    private fileInput: React.RefObject<HTMLInputElement>;
    constructor(props:Props){
        super(props);
        this.fileInput = React.createRef();
    }
    upload(){
        let InputFile = this.fileInput.current.files[0];
        let blobSlice = File.prototype.slice; //browser compatibility 
        let chunkFileReader = new FileReader();
        let totalFileReader = new FileReader();
        // let sparkTotal = new SparkMD5();
        // let sparkChunk = new SparkMD5.ArrayBuffer();
        let currentChunk = 0;
        let httpConNumber = 0;
        let chunkSize = (InputFile.size > 10*1024*1024) ? 10*1024*1024 :1024*1024;
        // let uploadChunkList:uploadChunkList =  {
        //     fileStatus: '',
        //     fileMd5:'',
        //     chunksNumber:0,
        //     // emptyFileMd5:
        //     uploadedChunk:[]
        // }
        let uploadChunkList:any;
        let preloadedJSON:preloadedFormat = {
            file:{
                fileMd5: '',
                chunksNumber : Math.ceil(InputFile.size / chunkSize),
                chunkSize: chunkSize,
                fileMd5Status:false
            },
            chunk:{
                chunkNumber: 0,
                chunkMd5: '',
                chunkFile: {
                    fileformat: '',
                    Chrom: '',
                    body: [],
                    startLine: '',
                    endLine: ''
                }
            }
        };
        // let checkoutInfo:checkoutInfo = {
        //     fileMd5:'',
        //     chunksNumber: 0,
        //     chunkSize: 0,
        //     chunk:[]
        // };
        // let firstChunkMd5:string;
        totalFileReader.readAsArrayBuffer(InputFile);
        totalFileReader.onload = function(e:any){
            let sparkTotal = new SparkMD5.ArrayBuffer();
            sparkTotal.append(e.target.result);
            // console.log(e.target.result);
            // console.log(sparkTotal.end());
            preloadedJSON.file.fileMd5 = sparkTotal.end();
            console.log(preloadedJSON.file.fileMd5);
        };
        chunkFileReader.onload = function(e:any){
            let sparkChunk = new SparkMD5();
            preloadedJSON.chunk.chunkNumber = currentChunk;
            // console.log(currentChunk);
            // console.log(preloadedJSON.chunk.chunkNumber)
            sparkChunk.append(e.target.result);
            // console.log(e.target.result);
            // console.log(sparkChunk.end());
            preloadedJSON.chunk.chunkMd5 = sparkChunk.end();
            // console.log(preloadedJSON.chunk.chunkMd5);
            preloadedJSON.chunk.chunkFile.body = [];
            // console.log(preloadedJSON.chunk.chunkFile.body);
            let ChunkStringArray = e.target.result.trim().split('\n');
            // console.log(ChunkStringArray);
            ChunkStringArray.forEach(function(v:string,i:number){
                // 前端默认VCF格式为标准的VCF4.0 4.1 4.2版本
                //（我这里采用的就是#CHROM字段是按照#CHROM POS ID REF ALT QUAL FILTER INF顺序的）
                // 在后台可以进行校验判断是否是正确类型
                if(i === 0){
                    preloadedJSON.chunk.chunkFile.startLine = v;//这里将换行符去掉了（就是说当分片很不幸分的正好的时候后台难以区分和恢复
                }else if(i === ChunkStringArray.length-1){
                    preloadedJSON.chunk.chunkFile.endLine = v;//只好在服务端做一个简单的文件分析判别
                }else{
                    if(v.indexOf('#') === -1){
                        let tmp = v.split('\t');
                        let obj = {
                            CHROM: tmp[0],
                            POS: tmp[1],
                            ID: tmp[2],
                            REF: tmp[3],
                            ALT: '.',
                            QUAL: '.',
                            FILTER: '.',
                            INFO: '.'
                        };
                        // console.log(tmp)
                        let indexINS = tmp[4].indexOf('<INS>');
                        let indexDEL = tmp[4].indexOf('<DEL>');
                        let indexDUP = tmp[4].indexOf('<DUP>');
                        let indexTDUP = tmp[4].indexOf('<TDUP>');
                        let indexEND = tmp[7].indexOf('END');
                        if(indexINS+indexDEL+indexDUP+indexTDUP === -4){
                            if(tmp[4].indexOf('<') == -1){
                                obj.ALT = tmp[4];
                            }else{
                                obj.ALT = '.';
                            }
                        }
                        else{
                            obj.ALT = tmp[4];
                            let k =0;
                            while((tmp[7].charAt(indexEND+k) != ';')&&(k<= tmp[7].length)){
                                k++;
                            }
                            if(indexINS != -1){
                                obj.INFO = 'SVTYPE=INS;'+tmp[7].slice(indexEND,indexEND+k+1);
                            }else if(indexDEL != -1){
                                obj.INFO = 'SVTYPE=DEL;'+tmp[7].slice(indexEND,indexEND+k+1);
                            }else if(indexDUP != -1){
                                obj.INFO = 'SYTYPE=DUP;'+tmp[7].slice(indexEND,indexEND+k+1);
                            }else if(indexTDUP != -1){
                                obj.INFO = 'SYTYPE=TDUP;'+tmp[7].slice(indexEND,indexEND+k+1);
                            }else{
                                console.log('error,vep only support INS/DEL/DUP/TDUP structural variant');
                            }
                        }
                        preloadedJSON.chunk.chunkFile.body.push(obj);
                    }else if(v.indexOf('#CHROM') != -1){
                        // preloadedJSON.chunk.chunkFile.Chrom = v; //注意这里上传的是整个的表头
                        preloadedJSON.chunk.chunkFile.Chrom = '#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO';
                        if(v.indexOf('#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINF') == -1){
                            console.log('only support #CHROM of #CHROM POS ID REF ALT QUAL FILTER INF')
                        }
                    }else if(v.indexOf('##fileformat') != -1){
                        preloadedJSON.chunk.chunkFile.fileformat = v;
                    }else if(v.indexOf('##') != -1){}else{
                        console.log('something wrong when split vcf file');
                    }
                }
            });
            // console.log(preloadedJSON.chunk.chunkMd5);
            // console.log(preloadedJSON.chunk.chunkNumber);
            // console.log(preloadedJSON.chunk.chunkFile.body);
            // console.log(preloadedJSON.chunk)
            let chunkFile = JSON.parse(JSON.stringify(preloadedJSON.file));
            // console.log(chunkFile);
            // console.log(preloadedJSON.file);
            let chunkChunk = JSON.parse(JSON.stringify(preloadedJSON.chunk));
            // let chunkCheckobj ={
            //     chunkNumber: preloadedJSON.chunk.chunkNumber,
            //     chunkMd5: preloadedJSON.chunk.chunkMd5
            // };
            // checkoutInfo.chunk.push(chunkCheckobj);
            // console.log(chunkChunk);
            Object.assign(chunkFile,chunkChunk);
            
            // chunkFile.emptyFileChunk = firstChunkMd5;
            console.log(chunkFile.chunkNumber);
            console.log(chunkFile);
            // console.log(uploadChunkList.fileStatus);
            switch(uploadChunkList.fileStatus){
                case 'posting':
                //   console.log(uploadChunkList);
                  for(var i =0 ;i<uploadChunkList.uploadedChunk.length;i++){
                      if(chunkFile.chunkMd5 == uploadChunkList.uploadedChunk[i].chunkMd5){
                        // httpConNumber++;
                        // console.log('posting');
                        break;
                        }
                  }
                  if(i == uploadChunkList.uploadedChunk.length){
                    axios({
                        method: 'post',
                        // url: `http://222.20.79.250:8081/api/upload_file_part?emptyFileMd5=${chunkFile.emptyFileChunk}&chunkMd5=${chunkFile.chunkMd5}&fileMd5=${preloadedJSON.file.fileMd5}`,
                        url:`http://222.20.79.250:8081/api/upload_file_part?fileMd5=${preloadedJSON.file.fileMd5}&chunkMd5=${chunkFile.chunkMd5}&chunkNumber=${chunkFile.chunkNumber}`,
                        data: chunkFile
                       //data: 'jackchu'
                    }).then(response => {
                        // httpConNumber--;
                        console.log(response);
                    }).catch(error => {
                        // httpConNumber--;
                        console.log(error);
                    })
                  }else{
                    console.log(`chunkMd5=${chunkFile.chunkMd5}have uploaded`);
                  }
                  break;
                case 'notposted':
                //   httpConNumber++;
                  console.log('notposted posing');
                  axios({
                      method: 'post',
                      // url: `http://222.20.79.250:8081/api/upload_file_part?emptyFileMd5=${chunkFile.emptyFileChunk}&chunkMd5=${chunkFile.chunkMd5}&fileMd5=${preloadedJSON.file.fileMd5}`,
                      url:`http://222.20.79.250:8081/api/upload_file_part?fileMd5=${preloadedJSON.file.fileMd5}&chunkMd5=${chunkFile.chunkMd5}&chunkNumber=${chunkFile.chunkNumber}`,
                      data: chunkFile
                  //data: 'jackchu'
                  }).then(response => {
                    //   httpConNumber--;
                      console.log(response);
                  }).catch(error => {
                    //   httpConNumber--;
                      console.log(error);
                  })
                  break;
            }
            // while(httpConNumber >= 6){
            //     console.log('max http connection is set to 6 , now waiting for a connection finished');
            // }
            currentChunk++;
            if(currentChunk < preloadedJSON.file.chunksNumber){
                loadChunks(); 
            // }else{
            //     checkoutInfo.fileMd5 = preloadedJSON.file.fileMd5;
            //     checkoutInfo.chunksNumber = preloadedJSON.file.chunksNumber;
            //     checkoutInfo.chunkSize = preloadedJSON.file.chunkSize;
            //     axios({
            //         method:'post',
            //         url:`http://222.20.79.250:8081/api/checkoutInfo`,
            //         data: checkoutInfo
            //     }).then(response => {
            //         console.log(response);
            //     }).catch(error => {
            //         console.log(error);
            //     })
            }
        }
        function loadChunks(){
            let chunkStart = currentChunk * chunkSize;
            let chunkEnd  = ((chunkStart + chunkSize) > InputFile.size) ? InputFile.size : chunkStart + chunkSize;
            // console.log(chunkStart);
            // console.log(chunkEnd);
            // console.log(InputFile.size);
            chunkFileReader.readAsText(blobSlice.call(InputFile,chunkStart,chunkEnd));
        }
        totalFileReader.onloadend = function (){
            console.log('onloadedend'+preloadedJSON.file.fileMd5);
            // httpConNumber++;
            axios({
                method: 'post',
                url: `http://222.20.79.250:8081/api/pullChunkList?fileMd5=${preloadedJSON.file.fileMd5}&chunksNumber=${preloadedJSON.file.chunksNumber}`
            }).then(response => {
                // httpConNumber--;
                // console.log(response);
                // console.log(response.data);
                // if(response.data === 'notposted'){
                //     uploadChunkList.fileStatus = 'notposted';
                // }else{
                //     uploadChunkList = JSON.parse(JSON.stringify(response))
                // }
                uploadChunkList = JSON.parse(JSON.stringify(response.data));
                console.log(uploadChunkList);
                console.log(uploadChunkList.fileStatus);
                if(uploadChunkList.fileStatus != 'posted'){
                    loadChunks();
                }
                //some other list information
            }).catch(error => {
                // httpConNumber--;
                console.log(error)
            })
        }
    }
    render(){
        return(
            <div>
                <input type= "file" name="file" ref={this.fileInput}></input>
                <button onClick={()=> this.upload()}>upload</button>
            </div>
        )
    }
}