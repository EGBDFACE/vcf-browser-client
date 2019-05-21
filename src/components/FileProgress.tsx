import * as React from 'react';
import '@/css/index.scss';

interface Props{
    // fileStatusPercent: number;
    percent: number;
}
interface States{
}

export default class FileProgress extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
    }
    render(){
        // const {fileStatusPercent} = this.props;
        const percent = this.props.percent;
        let progressBarStyle = {
            width: percent+'%'
        }
        return(
            <div className='fileProgress'>
                <div className='fileProgressBar' style={progressBarStyle}>
                    <div className='fileProgressValue'>{percent}%</div>
                </div>
            </div>
        )
    }
}