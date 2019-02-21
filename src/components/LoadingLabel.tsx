import * as React from 'react';
import '../index.scss';
import * as PIXI from 'pixi.js';
// import loadingPNF from '../images/loading.png';
const loadingPNG = require('../images/loading.png');

interface Props{

}
interface States{

}
 
export default class LoadingLabel extends React.Component<Props,States>{
    constructor(props:Props){
        super(props);
    }

    componentDidMount(){
        let app = new PIXI.Application({
            width:20,
            height:20,
            antialias: true,
            backgroundColor: 0xd3394c
        });
        document.getElementById('loadingLabel').appendChild(app.view);
        // document.body.appendChild(app.view);
        // console.log(loadingPNG);
        let loadingIcon = PIXI.Sprite.from(loadingPNG);
        // console.log(loadingIcon);
        loadingIcon.anchor.set(0.5);
        loadingIcon.width = 20;
        loadingIcon.height = 20; 
        loadingIcon.x = app.screen.width/2 + 2 ;
        loadingIcon.y = app.screen.height/2 + 2 ;
        app.stage.addChild(loadingIcon);
        app.ticker.add(delta => {
            loadingIcon.rotation += 0.1 * delta;
        });
    }

    render(){
        return(
            <i id='loadingLabel'></i>
        )
    }
}