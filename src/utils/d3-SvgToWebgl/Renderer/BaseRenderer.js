import * as PIXI from 'pixi.js';
import defaultConfigs from '../Config';
export default class BaseRenderer {
  constructor(elem, options) {
    this.renderer = new PIXI.autoDetectRenderer({
      width: elem.width || defaultConfigs.base.canvasSize.w,
      height: elem.height || defaultConfigs.base.canvasSize.h,
      resolution: options && options.resolution || window.devicePixelRatio,
      view: elem,
      backgroundColor: options && options.bgColor,
      transparent: options && options.transparent || false,
      antialias: true
    });
    this.renderer.view.style.width = elem.width / this.renderer.resolution + 'px';
    this.renderer.view.style.height = elem.height / this.renderer.resolution + 'px';
    //add suitable canvas width and height 
    //map to 800X800
    if(elem.width / this.renderer.resolution > elem.height / this.renderer.resolution){
      this.renderer.view.style.width = '800px';
      this.renderer.view.style.height = (elem.height / this.renderer.resolution) / (elem.width / this.renderer.resolution) * 800 + 'px';
    }else{
      this.renderer.view.style.height = '800px';
      this.renderer.view.style.width  = (elem.width / this.renderer.resolution) / (elem.height / this.renderer.resolution) * 800 + 'px';
    }
    
  }
}