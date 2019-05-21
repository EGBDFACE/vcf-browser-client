import * as React from 'react';
import { Link } from 'react-router-dom';
import '@/css/sign.scss'
import axios from 'axios';
import { BASE_URL } from '../constant';
import { userInfo } from '../store';
import store from '../store';
import * as actions from '../actions';
import SignError from '../components/SignError';
import history from '../router/history';
// import * as bcrypt from 'bcrypt';
const bcrypt = require('bcryptjs');
const jsSHA = require('jssha');

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

    // componentDidMount(){
    //     let saltRounds = 10;
    //     for(let i=0;i<10;i++){
    //         let temp = bcrypt.genSaltSync(saltRounds);
    //         console.log(temp);
    //     }
    // }

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
        let getSaltData = {
            name: this.state.name
        };
        axios({
            method: 'post',
            baseURL: BASE_URL,
            url: '/getSalt',
            data: getSaltData
        }).then( res => {
            console.log(res);
            let salt: string = res.data;
            let nowTime: string = Math.floor(new Date().getTime()/60000).toString();
            let passwordS: string = bcrypt.hashSync(this.state.password, salt);
            console.log(passwordS);
            // let passwordST: string = bcrypt.hashSync(nowTime, passwordS);
            // console.log(passwordST);
            let shaObj = new jsSHA('SHA-512','TEXT');
            shaObj.update(passwordS);
            shaObj.update(nowTime);
            let passwordST: string = shaObj.getHash('HEX');
            console.log(passwordST);
            let userInfo = {
                name: this.state.name,
                password: passwordST
            };
            axios({
                method: 'post',
                baseURL: BASE_URL,
                url: '/signIn',
                data: userInfo
            }).then( res => {
                console.log(res);
                if(typeof res.data === 'string'){
                    this.setState({
                        errorMessage: 'incorrect username or password',
                        ableToSubmit: true
                    });
                }else{
                    this.setState({
                        errorMessage: ''
                    });
                    store.dispatch(actions.userSignIn(res.data.name, res.data.fileList));
                    history.push('/');
                }
            })
        }).catch( err => {
            console.error(err.message);
        })

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