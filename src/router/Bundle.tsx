// import * as React from 'react';

// export default class Bundle extends React.Component<any,any>{
//     constructor(props?:any){
//         super(props);
//         this.state = {
//             mod : null
//         }
//     }
//     // state:any = {
//     //     mod: null
//     // };
//     componentWillMount(){
//         this.load(this.props)
//     }
//     componentWillReceiveProps(nextProps:any){
//         if(nextProps.load !== this.props.load){
//             this.load(nextProps)
//         }
//     }
//     load(props:any){
//         this.setState({
//             mod: null
//         });
//         props.load((mod:any) => {
//             this.setState({
//                 mod: mod.default ? mod.default : mod
//             })
//         })
//     }
//     render(){
//         return this.state.mod ? this.props.children(this.state.mod) : null;
//     }
// }