import Track from './Track'
import {
  parseChordData
} from '../data-parser'
import {
  registerTooltip
} from '../behaviors/tooltip'
import {
  ribbon
} from '../../../d3-chord'
const assign = require('lodash/assign')
const isFunction = require('lodash/isFunction')
import {
  event
} from 'd3-selection'

import {
  common,
  values
} from '../configs'

const defaultConf = assign({
  color: {
    value: '#fd6a62',
    iteratee: true
  },
  radius: {
    value: null,
    iteratee: false
  },
  stroke: {
    value: '#000000',
    iteratee: false
  },
  strokeWidth: {
    value: 0,
    iteratee: false
  }
}, common, values)

const normalizeRadius = (radius, layoutRadius) => {
  if (radius >= 1) return radius
  return radius * layoutRadius
}

export default class Chords extends Track {
  constructor(instance, conf, data) {
    super(instance, conf, defaultConf, data, parseChordData)
  }

  getCoordinates(d, layout, conf, datum) {
    const block = layout.blocks[d.id]
    const startAngle = block.start + d.start /
      block.len * (block.end - block.start)
    const endAngle = block.start + d.end /
      block.len * (block.end - block.start)

    let radius
    if (isFunction(conf.radius)) {
      radius = normalizeRadius(conf.radius(datum), layout.conf.innerRadius)
    } else if (conf.radius) {
      radius = normalizeRadius(conf.radius, layout.conf.innerRadius)
    }

    if (!radius) {
      radius = layout.conf.innerRadius
    }

    return {
      radius,
      startAngle,
      endAngle
    }
  }

  renderChords(parentElement, name, conf, data, instance, getCoordinates) {
    const track = parentElement.append('g')
    const self = this
    const link = track
      .selectAll('.chord')
      .data(data)
      .enter().append('path')
      .attr('class', 'chord')
      .attr('d', function (d) {
        return ribbon()
          .source((d) => getCoordinates(d.source, instance._layout, self.conf, d))
          .target((d) => getCoordinates(d.target, instance._layout, self.conf, d))(d) + ''
      })
      .attr('pathType', 'ribbon')
      .attr('pathData', function (d) {
        const ribbonData = ribbon()
          .source((d) => getCoordinates(d.source, instance._layout, self.conf, d))
          .target((d) => getCoordinates(d.target, instance._layout, self.conf, d))(d)
          .arcs;
        // console.log(ribbonData);
        // const s = getCoordinates(d.source, instance._layout, self.conf, d)
        // const t = getCoordinates(d.target, instance._layout, self.conf, d)
        // s.startAngle = s.startAngle - Math.PI / 2
        // s.endAngle = s.endAngle - Math.PI / 2
        // t.startAngle = t.startAngle - Math.PI / 2
        // t.endAngle = t.endAngle - Math.PI / 2
        // return [s, t]
        return ribbonData;
      })
      .attr('opacity', conf.opacity)
      .attr('stroke', conf.stroke)
      .attr('stroke-width', conf.strokeWidth)
      .on('mouseover', (d) => {
        this.dispatch.call('mouseover', this, d)
        // instance.clipboard.attr('value', conf.tooltipContent(d))
      })
      .on('mouseout', (d) =>
        this.dispatch.call('mouseout', this, d)
      )

    Object.keys(conf.events).forEach((eventName) => {
      link.on(eventName, function (d, i, nodes) {
        conf.events[eventName](d, i, nodes, event)
      })
    })

    link.attr('fill', conf.colorValue)

    return link
  }

  render(instance, parentElement, name) {
    parentElement.select('.' + name).remove()

    const track = parentElement.append('g')
      .attr('class', name + ' item-wrapper')
      .attr('z-index', this.conf.zIndex)

    const selection = this.renderChords(
      track,
      name,
      this.conf,
      this.data,
      instance,
      this.getCoordinates
    )
    if (this.conf.tooltipContent) {
      registerTooltip(this, instance, selection, this.conf)
    }
    return this
  }
}