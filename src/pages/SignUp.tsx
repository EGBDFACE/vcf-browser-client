import * as React from 'react';
import '@/assets/css/sign.scss';
import axios from 'axios';
import { BASE_URL } from '../constant';
import store, { userInfo } from '../store';
import * as actions from '../actions';
import SignError from '../components/SignError';
// import { withRouter } from 'react-router-dom';
import history from '../router/history';

interface Props{}
interface States{
    name: string
    password: string
    confirmPassword: string
    ableToSubmit: boolean,
    errorMessage: string
}

export default class SignUp extends React.Component<Props,States>{
    constructor(props: Props){
        super(props);
        this.state={
            name: '',
            password: '',
            confirmPassword: '',
            ableToSubmit: false,
            errorMessage: ''
        };
    }

    nameInput(value: string){
        this.setState({
            name: value
        });
        if(value&&this.state.password&&(this.state.password == this.state.confirmPassword)){
            this.setState({
                ableToSubmit: true
            });
        }else{
            this.setState({
                ableToSubmit: false
            });
        }
    }

    passwordInput(value: string){
        this.setState({
            password: value
        });
        if(value&&this.state.name&&(value == this.state.confirmPassword)){
            this.setState({
                ableToSubmit: true
            });
        }else{
            this.setState({
                ableToSubmit: false
            });
        }
    }

    confirmPasswordInput(value: string){
        this.setState({
            confirmPassword: value
        });
        if(value&&this.state.name&&(value == this.state.password)){
            this.setState({
                ableToSubmit: true
            });
        }else{
            this.setState({
                ableToSubmit: false
            });
        }
    }

    signUp(){
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
            url: '/signUp',
            data: signInfo
        }).then( res =>{
            console.log(res);
            if(res.data === 'SIGN_UP_SUCCESS'){
                // const history = createBrowserHistory();
                // history.push('/');
                store.dispatch(actions.userSignIn(signInfo.name,[]));
                history.push('/');
            }else{
                this.setState({
                    errorMessage: res.data.replace(/_/g,' ').toLowerCase(),
                    ableToSubmit: true
                });
            }
        }).catch( err => {
            console.error(err.message);
        });

    }
    
    render(){
        const hidden = { display: 'none'};
        return(
            <div>
                <div className='sign__header'>
                    <i className='signUp__logo'></i>
                    <h1>Sign up to VCF browser</h1>
                </div>
                <SignError message={this.state.errorMessage}></SignError>
                <div className='sign__form'>
                    <label htmlFor='signUp_field'>Username</label>
                    <input value={this.state.name} onChange={(e)=>this.nameInput(e.target.value)} className='form-control' type='text' name='signUp' id='signUp_field'></input>
                    <label htmlFor='signUp_password'>Password</label>
                    <input value={this.state.password} onChange={(e)=>this.passwordInput(e.target.value)} className='form-control' type='password' name='signUp_password' id='signUp_password'></input>
                    <label htmlFor='confirm_password'>Confirm password</label>
                    <input value={this.state.confirmPassword} onChange={(e)=>this.confirmPasswordInput(e.target.value)} className='form-control' type='password' name='confirm_password' id='confirm_password'></input>
                    <button onClick={()=>this.signUp()} style={this.state.ableToSubmit?null:hidden} className='form-submit'>Sign up</button>
                    <span style={this.state.ableToSubmit?hidden:null} className='form-unable-submit'>Sign up</span>
                </div>
            </div>
        )
    }
}

// export default withRouter(SignUp)