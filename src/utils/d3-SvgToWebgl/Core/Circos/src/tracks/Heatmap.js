import Track from './Track'
import {parseSpanValueData} from '../data-parser'
import {arc} from 'd3-shape'
const assign = require('lodash/assign')
import {radial, values, common} from '../configs'

const defaultConf = assign({
  color: {
    value: 'Spectral',
    iteratee: false
  },
  backgrounds: {
    value: [],
    iteratee: false
  }
}, radial, values, common)

export default class Heatmap extends Track {
  constructor (instance, conf, data) {
    super(instance, conf, defaultConf, data, parseSpanValueData)
  }

  renderDatum (parentElement, conf, layout) {
    return parentElement
      .selectAll('tile')
        .data((d) => d.values)
      .enter()
      .append('path')
        .attr('class', 'tile')
        .attr('pathType', 'arc')
        .attr('stroke-width', 0)
        .attr('pathData', d => {
          const dCopy = JSON.parse(JSON.stringify(d));
          dCopy.start = this.theta(dCopy.start, layout.blocks[dCopy.block_id])
          dCopy.end = this.theta(dCopy.end, layout.blocks[dCopy.block_id])
          dCopy.innerRadius = conf.innerRadius
          dCopy.outerRadius = conf.outerRadius
          return dCopy
        })
        .attr('opacity', conf.opacity)
        .attr('d', arc()
          .innerRadius(conf.innerRadius)
          .outerRadius(conf.outerRadius)
          .startAngle((d, i) => this.theta(d.start, layout.blocks[d.block_id]))
          .endAngle((d, i) => this.theta(d.end, layout.blocks[d.block_id]))
        )
        .attr('fill', function (d) {
          return conf.colorValue(d, conf.min === null ? conf.cmin : conf.min, conf.max === null ? conf.cmax : conf.max)
        })
  }
}
