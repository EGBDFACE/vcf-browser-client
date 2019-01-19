import * as React from 'react';
import {Link} from 'react-router-dom';
import Props from '../components/Hello';
import axios from 'axios';

export default class Two extends React.Component<Props,any>{
    private fileInput: React.RefObject<HTMLInputElement>;
    constructor(props:Props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.fileInput = React.createRef();
    }
    handleClick(){
        // var xhr = new XMLHttpRequest();
        // var formDate = new FormData();
        // var fileInput = document.getElementById("myfile");
        // var file = fileInput.files[0];
        // const file = files[0];
        // console.log(selectorFiles[0]);
        // const fileInput:FileList = document.getElementById("myFile").files;
        const data = new FormData();
        data.append('fileName',this.fileInput.current.files[0].name);
        data.append('file',this.fileInput.current.files[0]);
        axios({
            method: 'post',
            timeout: 2000,
            url: 'http://222.20.79.250:8081',
            data: data,
            onUploadProgress: ProgressEvent => {
                var percent = Math.floor(ProgressEvent.loaded / ProgressEvent.total *100) + '%';
                console.log(percent);
            }
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        });
        // data.append('file',selectorFiles[0]);
        // fetch('http://localhost:8080/upload',{
        //     method:'POST',
        //     body: data
        // }).then(res => {
        //     if(res.ok){
        //         console.log('success')
        //         return res.json();
        //     }else{
        //         console.log('error')
        //     }
        // }).then(res => {
        //     console.log('res is',res);
        // })
    }
    render(){
        return (
            <div>
                <div>TWO</div>
                <Link to="/">goto Home</Link>
                <input type="file" name="file" ref={this.fileInput}></input>
                <button onClick={()=>this.handleClick()}>upload</button>
            </div>
        );
    }
}