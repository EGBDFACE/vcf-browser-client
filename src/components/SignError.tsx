import * as React from 'react';
import '@/assets/css/sign.scss';

interface Props{
    message: string
}
interface States{
    deleteFlag: boolean
}

export default class SignError extends React.Component<Props,States>{
    constructor(props: Props){
        super(props);
        this.state = {
            deleteFlag: true
        }       
        // 不借助componentWillReceiveProps不会得到正确结果
        // if(props.message){
        //    this.state = {
        //     deleteFlag: false
        //     }; 
        // }else{
        //     this.state = {
        //         deleteFlag: true
        //     };
        // }
    }
    componentWillReceiveProps(nextProps:Props){
        if(nextProps.message){
            this.setState({
                deleteFlag: false
            });
        }else{
            this.setState({
                deleteFlag: true
            })
        }
    }

    delete(){
        this.setState({
            deleteFlag: true
        });
    }

    render(){
        const hidden= {display: 'none'};
        return (
            <div className='sign__error' style={this.state.deleteFlag?hidden:null}>
                <p>{this.props.message}</p>
                <i className='sign__error__delete' onClick={() => this.delete()}></i>
            </div>
        )
    }
}