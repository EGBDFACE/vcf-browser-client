const d3 = Object.assign({}, require('d3-selection'), require('d3-zoom'), require('d3-scale'), require('d3-axis'), require('d3-format'), require('../Core/d3-SvgToWebgl'));
import BaseRenderer from './BaseRenderer';
// deal with d3.event is null error
import {
	event as currentEvent
} from 'd3-selection';
import {
	roundNumber
} from '../Util';

export default class ShapeRenderer extends BaseRenderer {
	constructor(elem, options) {
		super(elem, options)
		this.stage = new PIXI.Container()
	}
	beginDraw() {
		this.container = new PIXI.Container()
	}
	drawCircle(x, y, radius, lineWidth = 0, strokeColor = 0, fillColor = 0) {
		const circle = new PIXI.Graphics()
		circle.lineStyle(lineWidth, strokeColor, 1)
		circle.beginFill(fillColor, 1)
		circle.drawCircle(x, y, radius)
		circle.endFill()
		this.container.addChild(circle)
	}
	drawRect(x, y, width, height, lineWidth = 0, strokeColor = 0, fillColor = 0) {
		const rect = new PIXI.Graphics()
		rect.lineStyle(lineWidth, strokeColor, 1)
		rect.beginFill(fillColor, 1)
		rect.drawRect(x, y, width, height)
		rect.endFill()
		this.container.addChild(rect)
	}
	drawEllipse(x, y, width, height, lineWidth = 0, strokeColor = 0, fillColor = 0) {
		const rect = new PIXI.Graphics()
		rect.lineStyle(lineWidth, strokeColor, 1)
		rect.beginFill(fillColor, 1)
		rect.drawEllipse(x, y, width, height)
		rect.endFill()
		this.container.addChild(rect)
	}
	render() {
		this.stage.addChild(this.container)
		this.renderer.render(this.stage)
	}
}