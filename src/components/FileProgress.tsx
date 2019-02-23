import * as React from 'react';
import '../index.scss';

interface Props{
    fileStatus: string;
    fileStatusPercent: number;
}
interface States{
}

export default class FileProgress extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
    }
    render(){
        const {fileStatus,fileStatusPercent} = this.props;
        let progressBarStyle = {
            width: fileStatusPercent+'%'
        }
        if(fileStatus === 'UPLOADING'){
            return(
                <div className='fileProgress'>
                    <div className='fileProgressBar' style={progressBarStyle}>
                        <div className='fileProgressValue'>{fileStatusPercent}%</div>
                    </div>
                </div>
            )
        }else{
            return(
                null
            )
        }
        
    }
}