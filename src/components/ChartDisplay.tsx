import * as React from 'react';

import draw from '../utils/chartDisplay/draw';

interface Props{
    data: any[],
    fileState: string
}
interface States{}

export default class ChartDisplay extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
    }
    // componentDidMount(){
    //     line();
    // }   
    componentDidUpdate(){
        const { data,fileState } = this.props; 
        // console.log('component update');
        // console.log(data);
        // getData(data);
        if((data.length != 0)&&(fileState != 'PREPARE_TO_UPLOAD')){
            console.log(data);
            // getData(data);
            draw(data);
            // resData.getDetailData(data);
            // resData.getLayoutData().then(()=>{
            //     console.log(resData.variant_data);
            //     console.log(resData.metalr_rankscore_data);
            //     console.log(resData.metasvm_rankscore_data);
            //     drawVepResultDiagram();
            // })
        }
    }
    render(){
        const { data,fileState } = this.props;
        // console.log(data);
        // console.log(data.length);
        // console.log(fileState);
        // if((data.length != 0)&&(fileState != 'PREPARE_TO_UPLOAD')){
            return(
                <div className='chartDisplay'>
                    <canvas width='800' height='800'></canvas>
                </div>
            )
        // }else{
        //     return null
        // }
    }
}