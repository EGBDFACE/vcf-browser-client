import * as React from 'react';
import { Link } from 'react-router-dom';
import '@/assets/css/sign.scss'
import axios from 'axios';
import { BASE_URL } from '../constant';
import { userInfo } from '../store';
import store from '../store';
import * as actions from '../actions';
import SignError from '../components/SignError';
import history from '../router/history';

interface Props{}
interface States{
    name: string
    password: string
    ableToSubmit: boolean,
    errorMessage: string,
}

export default class SignIn extends React.Component<Props,States>{
    constructor(props: Props){
        super(props);
        this.state = {
            name: '',
            password: '',
            ableToSubmit: false,
            errorMessage: ''
        }
    }

    nameInput(value:string){
        this.setState({
            name: value
        });
        if(Boolean(value)&&Boolean(this.state.password)){
            this.setState({
                ableToSubmit: true
            })
        }else{
            this.setState({
                ableToSubmit: false
            })
        }
    }

    passwordInput(value:string){
        this.setState({
            password: value
        });
        if(Boolean(value)&&Boolean(this.state.name)){
            this.setState({
                ableToSubmit: true
            })
        }else{
            this.setState({
                ableToSubmit: false
            })
        }
    }

    signIn(){
        let signInfo = {
            name: this.state.name,
            password: this.state.password
        };
        
        this.setState({
            ableToSubmit: false
        });

        axios({
            method: 'post',
            baseURL: BASE_URL,
            url: '/signIn',
            data: signInfo
        }).then( res => {
            console.log(res);
            if(typeof res.data === 'string'){
                this.setState({
                    errorMessage: res.data.replace(/_/g,' ').toLowerCase(),
                    ableToSubmit: true
                });
            }else{
                this.setState({
                    errorMessage: ''
                });
                let userInfo:userInfo = {
                    name: res.data.name,
                    id: res.data.id,
                    fileList: res.data.fileList?res.data.fileList:[]
                }
                store.dispatch(actions.userSignIn(userInfo.name,userInfo.fileList));
                history.push('/');
            }
        }).catch( err => {
            console.error(err.message);
        });

    }
    
    render(){
        const hidden={
            display: 'none'
        };
        return(
            <div>
                <div className='sign__header'>
                    <i className='signIn__logo'></i>
                    <h1>Sign in to VCF browser</h1>
                </div>
                <SignError message={this.state.errorMessage}></SignError>
                <div className='sign__form'>
                    <label htmlFor='login_field'>Username</label>
                    <input value={this.state.name} onChange={(e)=>this.nameInput(e.target.value)} className='form-control' type='text' name='login' id='login_field'></input>
                    <label htmlFor='login_password'>Password</label>
                    <input value={this.state.password} onChange={(e)=>this.passwordInput(e.target.value)} className='form-control' type='password' name='login_password' id='login_password'></input>
                    <button onClick={() => this.signIn()} style={this.state.ableToSubmit?null:hidden} className='form-submit'>Sign in</button>
                    <span style={this.state.ableToSubmit?hidden:null} className='form-unable-submit'>Sign in</span>
                </div>
                <div className='sign__help'>
                    <p>New to VCF browser?</p>
                    <Link to='/signUp'>Create an accout</Link>
                </div>
            </div>
        )
    }
}