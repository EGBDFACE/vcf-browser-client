const defaultsDeep = require('lodash/defaultsDeep')
const forEach = require('lodash/forEach')
const isArray = require('lodash/isArray')
const map = require('lodash/map')
// import {select} from 'd3-selection'
const d3 = Object.assign({}, require('../../d3-SvgToWebgl'), require('d3-zoom'));
import {
  event as currentEvent
} from 'd3-selection';
import Layout from './layout/index'
import render from './render'
import Text from './tracks/Text'
import Highlight from './tracks/Highlight'
import Histogram from './tracks/Histogram'
import Chords from './tracks/Chords'
import Heatmap from './tracks/Heatmap'
import Line from './tracks/Line'
import Scatter from './tracks/Scatter'
import Stack from './tracks/Stack'

const defaultConf = {
  width: 700,
  height: 700,
  container: 'circos',
  defaultTrackWidth: 10
}

class Core {
  constructor(conf) {
    this.tracks = {}
    this._layout = null
    this.conf = defaultsDeep(conf, defaultConf)
    this.svgContainer = d3.select(this.conf.container).toCanvas(this.conf.renderer);
    this.svg = this.svgContainer.append('g')
      .attr('class', 'content');
    var zoomed = function () {
      var node = this.node().glElem;
      var rootNode = this.node().rootNode;
      var transform = currentEvent.transform;
      node.scale.x = transform.k;
      node.scale.y = transform.k;
      node.position.x = transform.x;
      node.position.y = transform.y;
      rootNode.renderer.render(rootNode.stage);
    };
    zoomed = zoomed.bind(this.svg);
    this.svgContainer.call(d3.zoom().on('zoom', zoomed))
    if (d3.select('body').select('.circular-tooltip').empty()) {
      this.tip = d3.select('body').append('div')
        .attr('class', 'circular-tooltip')
        .style('opacity', 0)
        .style('position', 'fixed')
        .style('font-family', 'AvenirNext-Medium, Baskerville, Palatino-Roman, Helvetica, "Times New Roman"')
        .style('text-align', 'left')
        .style('padding', '5px 10px')
        .style('background-color', '#333333')
        .style('color', 'white')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('z-index', 9999);
      this.tipContent = this.tip.append('div')
        .attr('class', 'circular-tooltip-content')
      // add triangle
      this.tip.append('div')
        .style('border-top', '8px solid #333333')
        .style('border-left', '5px solid #333333')
        .style('border-bottom', '8px solid transparent')
        .style('border-right', '5px solid transparent')
        .style('position', 'absolute')
        .style('top', 'calc(100% - 5px)')
        .style('left', 0)
    } else {
      this.tip = d3.select('body').select('.circular-tooltip')
      this.tipContent = this.tip.select('.circular-tooltip-content')
    }
  }

  removeTracks(trackIds) {
    if (typeof (trackIds) === 'undefined') {
      map(this.tracks, (track, id) => {
        this.svg.select('.' + id).remove()
      })
      this.tracks = {}
    } else if (typeof (trackIds) === 'string') {
      this.svg.select('.' + trackIds).remove()
      delete this.tracks[trackIds]
    } else if (isArray(trackIds)) {
      forEach(trackIds, function (trackId) {
        this.svg.select('.' + trackId).remove()
        delete this.tracks[trackId]
      })
    } else {
      console.warn('removeTracks received an unhandled attribute type')
    }

    return this
  }

  layout(data, conf) {
    this._layout = new Layout(conf, data)
    return this
  }

  chords(id, data, conf) {
    this.tracks[id] = new Chords(this, conf, data)
    return this
  }
  heatmap(id, data, conf) {
    this.tracks[id] = new Heatmap(this, conf, data)
    return this
  }
  highlight(id, data, conf) {
    this.tracks[id] = new Highlight(this, conf, data)
    return this
  }
  histogram(id, data, conf) {
    this.tracks[id] = new Histogram(this, conf, data)
    return this
  }
  line(id, data, conf) {
    this.tracks[id] = new Line(this, conf, data)
    return this
  }
  scatter(id, data, conf) {
    this.tracks[id] = new Scatter(this, conf, data)
    return this
  }
  stack(id, data, conf) {
    this.tracks[id] = new Stack(this, conf, data)
    return this
  }
  text(id, data, conf) {
    this.tracks[id] = new Text(this, conf, data)
    return this
  }
  render(ids, removeTracks) {
    render(ids, removeTracks, this)
  }
}

const Circos = (conf) => {
  const instance = new Core(conf)
  return instance
}

// export default Circos
export default Core