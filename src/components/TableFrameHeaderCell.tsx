import * as React from 'react';

interface Props{
    content: string;
}
interface States{

}

export default class TableFrameHeaderCell extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
    }
    render(){
        return(
            <div className='tableHeaderCell'>
                <span>{this.props.content}</span>
            </div>
        )
    }
}