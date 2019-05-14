import Track from './Track'
import {parseSpanValueData} from '../data-parser'
import {arc} from 'd3-shape'
const assign = require('lodash/assign')
import {axes, radial, values, common} from '../configs'

const defaultConf = assign({
  direction: {
    value: 'out',
    iteratee: false
  },
  color: {
    value: '#fd6a62',
    iteratee: true
  },
  backgrounds: {
    value: [],
    iteratee: false
  }
}, axes, radial, common, values)

export default class Histogram extends Track {
  constructor (instance, conf, data) {
    super(instance, conf, defaultConf, data, parseSpanValueData)
  }

  renderDatum (parentElement, conf, layout) {
    const bin = parentElement.selectAll('.bin')
      .data(d => d.values)
      .enter().append('path')
      .attr('class', 'bin')
      .attr('opacity', conf.opacity)
      .attr('stroke-width', 0)
      .attr('pathType', 'arc')
      .attr('pathData', d => {
        const dCopy = JSON.parse(JSON.stringify(d))
        dCopy.innerRadius = conf.direction == 'in' ? conf.outerRadius - this.scale(d.value) : conf.innerRadius
        dCopy.outerRadius = conf.direction == 'out' ? conf.innerRadius + this.scale(d.value) : conf.outerRadius
        dCopy.start = this.theta(d.start, layout.blocks[d.block_id])
        dCopy.end = this.theta(d.end, layout.blocks[d.block_id])
        return dCopy;
      })
      .attr('d', arc()
        .innerRadius((d) => {
          if (conf.direction == 'in') {
            return conf.outerRadius - this.scale(d.value)
          }
          return conf.innerRadius
        })
        .outerRadius((d) => {
          if (conf.direction == 'out') {
            return conf.innerRadius + this.scale(d.value)
          }
          return conf.outerRadius
        })
        .startAngle((d) => this.theta(d.start, layout.blocks[d.block_id]))
        .endAngle((d) => this.theta(d.end, layout.blocks[d.block_id]))
      )
    bin.attr('fill', conf.colorValue)
    return bin
  }
}
