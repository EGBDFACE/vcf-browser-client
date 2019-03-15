import * as React from 'react';

interface Props{
    data: string[],
    fileState: string
}
interface States{}

export default class ChartDisplay extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
    }
    render(){
        const { data,fileState } = this.props;
        console.log(data);
        if((data.length != 0)&&(fileState != 'PREPARE_TO_UPLOAD')){
            return(
                <div className='chartDisplay'>
                    <canvas width='800' height='800'></canvas>
                </div>
            )
        }else{
            return null
        }
    }
}