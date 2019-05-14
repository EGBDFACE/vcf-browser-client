const d3 = Object.assign({}, require('d3-selection'), require('d3-array'), require('d3-zoom'), require('d3-scale'), require('d3-axis'), require('d3-request'), require('d3-format'), require('../Core/d3-SvgToWebgl'));
import BaseRenderer from './BaseRenderer';
// deal with d3.event is null error
const merge = require('lodash/merge')
import {
  event as currentEvent
} from 'd3-selection';
import {
  roundNumber
} from '../Util';
import baseConfig from '../Config/base';
import defaultConfigs from '../Config';

export default class ChartRenderer extends BaseRenderer {
  constructor(elem, options) {
    super(elem, options)
  }
  iris(data, configs) {
    const options = merge({}, defaultConfigs.base, configs);
    // const margin = options.canvasMargin;
    const contentSize = options.contentSize;
    const margin = {
      h: (this.renderer.view.width / this.renderer.resolution - contentSize.w) / 2,
      v: (this.renderer.view.height / this.renderer.resolution - contentSize.h) / 2
    }
    const range = options.range;

    const container = d3.select(this.renderer.view)
      .toCanvas(this.renderer);

    options.zoom && container.call(d3.zoom().on('zoom', zoom));

    const x = d3.scaleLinear()
      .domain(range.x)
      .range([0, contentSize.w]);

    const y = d3.scaleLinear()
      .domain(range.y)
      .range([contentSize.h, 0]);

    const clip = container.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', contentSize.w)
      .attr('height', contentSize.h);
    // x axis clip
    container.append('defs')
      .append('clipPath')
      .attr('id', 'clipX')
      .append('rect')
      .attr('x', -5)
      .attr('width', contentSize.w + 10)
      .attr('height', margin.v)
    // y axis clip
    container.append('defs')
      .append('clipPath')
      .attr('id', 'clipY')
      .append('rect')
      .attr('x', -margin.h)
      .attr('y', -5)
      .attr('width', margin.h + 1)
      .attr('height', contentSize.h + 10)

    const content = container.append('g')
      .classed('content', true)
      .attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')')
      .attr('clip-path', 'url(#clip)')
      .append('g');

    content.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function (d) {
        return x(d.x);
      })
      .attr('cy', function (d) {
        return y(d.y);
      })
      .attr('r', function (d) {
        return d.r;
      })
      .style('stroke-width', function (d) {
        return d.strokeWidth || options.style.strokeWidth
      })
      .style('stroke', function (d) {
        return d.stroke || options.style.stroke;
      })
      .style('fill', function (d) {
        return d.fill || options.style.fill;
      })
      .style('fill-opacity', function (d) {
        return d.fillOpacity || options.style.fill;
      });

    const xAxis = d3.axisBottom(x).ticks(6);
    const yAxis = d3.axisLeft(y).ticks(6);

    const cX = container.append('g')
      .attr('transform', 'translate(' + margin.h + ', ' + (contentSize.h + margin.v) + ')')
      .attr('clip-path', 'url(#clipX)')
      .call(xAxis);
    const cY = container.append('g')
      .attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')')
      .attr('clip-path', 'url(#clipY)')
      .call(yAxis);

    var rootNode = content.node().rootNode;
    configs.completed && configs.completed()
    function zoom() {
      var node = content.node().glElem;
      // var xPath = cX.select('path.domain').node().glElem;
      var xTicks = cX.selectAll('g.tick')._groups[0].map(function (d) {
        return d.glElem;
      })
      var yTicks = cY.selectAll('g.tick')._groups[0].map(function (d) {
        return d.glElem;
      })
      // console.log(xPath, xTicks)
      var transform = currentEvent.transform;
      xTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          }
        }
        d.position.x = (d.oriPos.x * transform.k + transform.x);
      })
      yTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          }
        }
        d.position.y = (d.oriPos.y * transform.k + transform.y);
      })
      node.scale.x = transform.k;
      node.scale.y = transform.k;
      node.position.x = transform.x;
      node.position.y = transform.y;
      rootNode.renderer.render(rootNode.stage);
      // content.attr('transform', currentEvent.transform);
      // cX.call(xAxis.scale(currentEvent.transform.rescaleX(x)));
      // cY.call(yAxis.scale(currentEvent.transform.rescaleY(y)));
    }
  }

  // draw candleStick chart
  candleStick(data, configs) {
    const options = merge({}, defaultConfigs.base, defaultConfigs.chart.candleStick, configs);
    const contentSize = options.contentSize;
    // const margin = options.canvasMargin;
    const margin = {
      h: (this.renderer.view.width / this.renderer.resolution - contentSize.w) / 2,
      v: (this.renderer.view.height / this.renderer.resolution - contentSize.h) / 2
    }
    const blockWidth = options.blockWidth;
    let x = d3.scaleTime().range([0, contentSize.w]);
    let y = d3.scaleLinear().range([contentSize.h, 0]);
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
    const timeRange = options.range.x;
    const valueRange = options.range.y;
    const style = options.style;

    x.domain(timeRange.map(function (v, i) {
      const tmpDate = new Date(v);
      if (i === 0) {
        tmpDate.setDate(tmpDate.getDate() - 2);
      } else {
        tmpDate.setDate(tmpDate.getDate() + 2);
      }
      return tmpDate;
    }));
    y.domain(valueRange.map(function (v, i) {
      return i === 0 ? roundNumber(v, 10, false) : roundNumber(v, 10, true);
    }));

    const svg = d3.select(this.renderer.view)
      .toCanvas(this.renderer);
    options.zoom && svg.call(d3.zoom().on('zoom', zoomed));

    // clipPath
    // !important
    // pay attention that the clippath area is related to the ref element
    const clip = svg.append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', contentSize.w)
      .attr('height', contentSize.h);

    // x axis clip
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'clipX')
      .append('rect')
      .attr('x', -5)
      .attr('width', contentSize.w + 10)
      .attr('height', margin.v)
    // y axis clip
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'clipY')
      .append('rect')
      .attr('x', -margin.h)
      .attr('y', -5)
      .attr('width', margin.h + 1)
      .attr('height', contentSize.h + 10)

    const container = svg.append('g')
      .attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')');

    const cX = container.append('g')
      .attr('class', 'xAxis')
      .attr('transform', 'translate(0, ' + contentSize.h + ')')
      .attr('clip-path', 'url(#clipX)')
      .call(xAxis);

    const cY = container.append('g')
      .attr('class', 'yAxis')
      .attr('clip-path', 'url(#clipY)')
      .call(yAxis);

    const content = container.append('g')
      .attr('class', 'clipArea')
      .attr('clip-path', 'url(#clip)')
      .append('g')
      .attr('class', 'content');

    const blocks = content.selectAll('.block')
      .data(data)
      .enter()
      .append('path')
      .attr('d', function (d) {
        return getPath(d);
      })
      .style('stroke-width', function (d) {
        return d.strokeWidth || style.strokeWidth
      })
      .style('fill', function (d) {
        return d.fill || style.fill
      })
      .style('stroke', function (d) {
        return d.stroke || style.stroke
      });
    var rootNode = content.node().rootNode;

    function zoomed() {
      var node = content.node().glElem;
      // var xPath = cX.select('path.domain').node().glElem;
      var xTicks = cX.selectAll('g.tick')._groups[0].map(function (d) {
        return d.glElem;
      })
      var yTicks = cY.selectAll('g.tick')._groups[0].map(function (d) {
        return d.glElem;
      })
      // console.log(xPath, xTicks)
      var transform = currentEvent.transform;
      xTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          }
        }
        d.position.x = (d.oriPos.x * transform.k + transform.x);
      })
      yTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          }
        }
        d.position.y = (d.oriPos.y * transform.k + transform.y);
      })
      node.scale.x = transform.k;
      node.scale.y = transform.k;
      node.position.x = transform.x;
      node.position.y = transform.y;
      rootNode.renderer.render(rootNode.stage);
      // content.attr('transform', currentEvent.transform);
      // cX.call(xAxis.scale(currentEvent.transform.rescaleX(x)));
      // cY.call(yAxis.scale(currentEvent.transform.rescaleY(y)));
    }

    function getPath(d) {
      const xCoor = x(new Date(d.x));
      return (
        'M ' + xCoor + ' ' + y(d.value[0]) + ' ' +
        'V ' + y(d.value[1]) + ' ' +
        'H ' + (xCoor - blockWidth / 2) + ' ' +
        'V ' + y(d.value[2]) + ' ' +
        'H ' + (xCoor + blockWidth / 2) + ' ' +
        'V ' + y(d.value[1]) + ' ' +
        'H ' + xCoor + ' ' +
        'M ' + xCoor + ' ' + y(d.value[2]) + ' ' +
        'V ' + y(d.value[3])
      )
    }
  }

  // draw occurrence chart
  occurrence(data, configs) {
    const options = merge({}, defaultConfigs.base, defaultConfigs.chart.occurrence, configs);
    const xAxisLabel = options.range.x;
    const yAxisLabel = options.range.y;
    const unitSize = options.unitSize;
    const gap = options.gap;
    const contentSize = options.contentSize;
    // const margin = options.canvasMargin;
    const margin = {
      h: (this.renderer.view.width / this.renderer.resolution - contentSize.w) / 2,
      v: (this.renderer.view.height / this.renderer.resolution - contentSize.h) / 2
    }
    const style = options.style;
    const svg = d3.select(this.renderer.view)
      .toCanvas(this.renderer)

    options.zoom && svg.call(d3.zoom().on('zoom', zoomed));
    // clips
    const defs = svg.append('defs');
    const clipContent = defs
      .append('clipPath')
      .attr('id', 'clip-content')
      .append('rect')
      .attr('width', contentSize.w)
      .attr('height', contentSize.h);
    const clipXAxis = defs
      .append('clipPath')
      .attr('id', 'clip-x-axis')
      .append('rect')
      .attr('width', contentSize.w)
      .attr('height', margin.v);
    const clipYAxis = defs
      .append('clipPath')
      .attr('id', 'clip-y-axis')
      .append('rect')
      .attr('width', margin.h)
      .attr('height', contentSize.h);
    // content
    const content = svg.append('g')
      .attr('class', 'content-wrapper')
      .attr('transform', 'translate(' + margin.h + ', ' + margin.v + ')')
      .attr('clip-path', 'url(#clip-content)')
      .append('g')
      .attr('class', 'content');
    // axis
    const xAxis = svg.append('g')
      .attr('class', 'xAxisSvg')
      .attr('transform', 'translate(' + margin.h + ', 0)')
      .attr('clip-path', 'url(#clip-x-axis)')
      .append('g')
      .attr('class', 'x-axis-wrapper axis-wrapper')
      .attr('transform', 'translate(0, ' + margin.v + ') rotate(-90)')
      .selectAll('text')
      .data(xAxisLabel)
      .enter()
      .append('text')
      .attr('class', 'x-axis')
      .attr('x', unitSize.w)
      // deal with fontSize less than 12px
      .attr('transform', function () {
        if (unitSize.w < 12) {
          return 'scale(' + unitSize.w / 12 + ')';
        }
      })
      .style('font-size', unitSize.w + 'px')
      .style('text-anchor', 'start')
      .text(function (d) {
        return d;
      })
      .attr('y', function (d, i) {
        return i * (unitSize.w + gap) + unitSize.w * 2 / 3;
      });

    const yAxis = svg.append('g')
      .attr('class', 'yAxisSvg')
      .attr('transform', 'translate(0, ' + margin.v + ')')
      .attr('clip-path', 'url(#clip-y-axis)')
      .append('g')
      .attr('class', 'y-axis-wrapper axis-wrapper')
      .selectAll('text')
      .data(yAxisLabel)
      .enter()
      .append('text')
      .attr('class', 'y-axis')
      .attr('x', margin.h - unitSize.w)
      .attr('transform', function () {
        if (unitSize.h < 12) {
          return 'scale(' + unitSize.h / 12 + ')';
        }
      })
      .style('text-anchor', 'end')
      .style('font-size', unitSize.h + 'px')
      .text(function (d) {
        return d;
      })
      .attr('y', function (d, i) {
        return i * (unitSize.h + gap) + unitSize.h * 2 / 3;
      });

    this._generateTip();
    const self = this;
    content.selectAll('.block')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'block')
      .attr('x', function (d) {
        return d.y * (unitSize.w + gap);
      })
      .attr('y', function (d) {
        return d.x * (unitSize.h + gap);
      })
      .attr('width', unitSize.w)
      .attr('height', unitSize.h)
      .attr('stroke-width', 0)
      .style('fill', function (d) {
        return d.color || style.fill;
      })
      .on('mouseover', function (d) {
        var tipStr = self._generateTipStr(d.label)
        self.tipContent.html(tipStr)
        self.tip
          .style('opacity', 0.9)
          .style('top', currentEvent.data.originalEvent.clientY - self.tip.node().clientHeight - 20 + 'px')
          .style('left', currentEvent.data.originalEvent.clientX + 'px')
      })
      .on('mouseout', function (d) {
        self.tip
          .style('opacity', 0);
      });

    // function generateTip(date, rate) {
    //   return '<ul>' +
    //     '<li><span class="title">names: </span>' + date + '</li>' +
    //     '<li><span class="title">count: </span>' + rate + '</li>' +
    //     '</ul>';
    // }
    var rootNode = content.node().rootNode;
      configs.completed && configs.completed()
    function zoomed() {
      var node = content.node().glElem;
      var xTicks = xAxis._groups[0].map(function (d) {
        return d.glElem;
      })
      var yTicks = yAxis._groups[0].map(function (d) {
        return d.glElem;
      })
      var transform = currentEvent.transform;
      xTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          }
        }
        d.position.y = (d.oriPos.y * transform.k + transform.x);
        d.scale.x = unitSize.w < 12 ? unitSize.w / 12 * transform.k : transform.k;
        d.scale.y = d.scale.x;
      })
      yTicks.forEach(function (d) {
        if (!d.oriPos) {
          d.oriPos = {
            x: d.position.x,
            y: d.position.y
          }
        }
        d.position.y = (d.oriPos.y * transform.k + transform.y);
        d.scale.x = unitSize.h < 12 ? unitSize.h / 12 * transform.k : transform.k;
        d.scale.y = d.scale.x;
      })
      node.scale.x = transform.k;
      node.scale.y = transform.k;
      node.position.x = transform.x;
      node.position.y = transform.y;
      rootNode.renderer.render(rootNode.stage);
      // content.attr('transform', currentEvent.transform);
      // xAxis.attr('y', function (d, i) {
      //   return currentEvent.transform.x + (i * (unitSize.w + gap) + unitSize.w * 3 / 4) * currentEvent.transform.k - (currentEvent.transform.k - 1) * 3;
      // })
      // yAxis.attr('y', function (d, i) {
      //   return currentEvent.transform.y + (i * (unitSize.h + gap) + unitSize.h * 3 / 4) * currentEvent.transform.k - (currentEvent.transform.k - 1) * 3;
      // })
    }
  }

  // draw boxplot
  boxplot(data, configs) {
    const options = merge({}, defaultConfigs.base, configs);
    const contentSize = options.contentSize;
    // const margin = options.canvasMargin;
    const margin = {
      h: (this.renderer.view.width / this.renderer.resolution - contentSize.w) / 2,
      v: (this.renderer.view.height / this.renderer.resolution - contentSize.h) / 2
    }
    const barWidth = options.barWidth;
    const ticks = options.ticks;
    // let x = d3.scaleLinear().domain(options.range.x).range([0, contentSize.w]);
    // let y = d3.scaleLinear().domain(options.range.y).range([contentSize.h, 0]);
    // const xAxis = d3.axisBottom(x).tickValues(ticks.x.values).tickFormat(d3.format(ticks.x.format));
    // const yAxis = d3.axisLeft(y);
    const style = merge({}, options.style, configs.style);
    this._generateTip();
    const self = this;
    // deal with data
    if (data.fileUrl) {
      d3[data.fileType](data.fileUrl, function (data) {
        let columns = data.columns;
        let dataRecord = data.reduce(function (acc, v, i) {
          const key = v.key;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(v);
          return acc;
        }, {})
        const recordMinandMax = {};
        const recordQuantile = {};
        const recordOutlier = {}
        const xAxisData = Object.keys(dataRecord);
        // sort data record
        xAxisData.forEach(function (key) {
          dataRecord[key].sort(function (a, b) {
            return a.value - b.value
          })
          recordMinandMax[key] = {
            min: +dataRecord[key][0].value,
            max: +dataRecord[key][dataRecord[key].length - 1].value
          }
          recordQuantile[key] = getQuantile(dataRecord[key].map(function (v) {
            return +v.value
          }))
          const IQR = recordQuantile[key][2] - recordQuantile[key][0]
          const min = recordQuantile[key][0] - 1.5 * IQR;
          const max = recordQuantile[key][2] + 1.5 * IQR;
          recordOutlier[key] = {
            low: dataRecord[key].filter(function (d) {
              return +d.value < min
            }),
            high: dataRecord[key].filter(function (d) {
              return +d.value > max
            })
          }
        })
        // calculate the xscale and yscale
        let xScale = d3.scalePoint().domain(xAxisData).range([0, contentSize.w]);
        xScale.padding([barWidth * 3 / 4 / xScale.step()]);
        let yScale = d3.scaleLinear().domain([
          d3.min(Object.values(recordMinandMax), function (v) {
            return v.min
          }),
          d3.max(Object.values(recordMinandMax), function (v) {
            return v.max
          })
        ]).range([contentSize.h, 0])
        const svg = d3.select(self.renderer.view)
          .toCanvas(self.renderer);

        options.zoom && svg.call(d3.zoom().on('zoom', zoomed));

        // add clipPath
        const defs = svg.append('defs');
        const clip = defs
          .append('clipPath')
          .attr('id', 'clip')
          .append('rect')
          .attr('width', contentSize.w)
          .attr('height', contentSize.h);
        // x axis clip
        defs
          .append('clipPath')
          .attr('id', 'clipX')
          .append('rect')
          .attr('x', -5)
          .attr('width', contentSize.w + 10)
          .attr('height', margin.v)
        // y axis clip
        defs
          .append('clipPath')
          .attr('id', 'clipY')
          .append('rect')
          .attr('x', -margin.h)
          .attr('y', -5)
          .attr('width', margin.h + 1)
          .attr('height', contentSize.h + 10)
        // add container
        const container = svg.append("g")
          .attr('clip-path', 'url(#clip)')
          .attr("transform", "translate(" + margin.h + "," + margin.v + ")");

        const axisY = svg.append("g").attr("transform", "translate(" + margin.h + ',' + margin.v + ')').attr('clip-path', 'url(#clipY)')
        const axisX = svg.append("g").attr("transform", "translate(" + margin.h + ',' + (contentSize.h + margin.v) + ')')
          .attr('clip-path', 'url(#clipX)')
        // add legends
        if (configs.legends) {
          svg.append("g").attr("transform", "translate(" + (margin.h + contentSize.w / 2) + ',' + (contentSize.h + margin.v) + ')')
            .append('text')
            .style('font-size', configs.legends.fontSize && (configs.legends.fontSize + 'px') || '16px')
            .style('text-anchor', 'middle')
            .attr('x', 0)
            .attr('y', configs.legends.xOffset)
            .text(configs.legends.x);
          svg.append("g").attr("transform", "translate(" + margin.h + ',' + (margin.v + contentSize.h / 2) + ')')
            .append('text')
            .style('font-size', configs.legends.fontSize && (configs.legends.fontSize + 'px') || '16px')
            .style('text-anchor', 'middle')
            .attr('x', -configs.legends.yOffset)
            .attr('y', 0)
            .attr('transform', 'rotate(-90)')
            .text(configs.legends.y);
        }
        // group the boxplot
        const content = container.append("g");
        xAxisData.forEach(function (key) {
          const lines = [{
            y1: recordQuantile[key][2]
          }, {
            y2: recordQuantile[key][0]
          }];
          if (recordOutlier[key].high.length) {
            lines[0].y2 = recordQuantile[key][2] + 1.5 * (recordQuantile[key][2] - recordQuantile[key][0]);
          } else {
            lines[0].y2 = recordMinandMax[key].max
          }
          if (recordOutlier[key].low.length) {
            lines[1].y1 = recordQuantile[key][0] - 1.5 * (recordQuantile[key][2] - recordQuantile[key][0]);
          } else {
            lines[1].y1 = recordMinandMax[key].min
          }
          // Draw the box plot vertical lines
          const verticalLines = content.selectAll(".verticalLines")
            .data(lines)
            .enter()
            .append("line")
            .attr("x1", function (d) {
              return xScale(key);
            })
            .attr("y1", function (d) {
              return yScale(d.y1);
            })
            .attr("x2", function (d) {
              return xScale(key);
            })
            .attr("y2", function (d) {
              return yScale(d.y2);
            })
            .attr("stroke", typeof style.stroke === 'function' ? style.stroke(key) : style.stroke)
            .attr("stroke-width", style.strokeWidth)
            .attr("fill", "none");

          // Draw the boxes of the box plot, filled in white and on top of vertical lines
          const rects = content.selectAll(".rect")
            .data([recordQuantile[key]])
            .enter()
            .append("rect")
            .attr("width", barWidth)
            .attr("height", function (d) {
              return yScale(d[0]) - yScale(d[2]);
            })
            .attr("x", function (d) {
              return xScale(key) - barWidth / 2;
            })
            .attr("y", function (d) {
              return yScale(d[2]);
            })
            .attr("fill", function (d) {
              return '#ffffff';
            })
            .attr("stroke", typeof style.stroke === 'function' ? style.stroke(key) : style.stroke)
            .attr("stroke-width", style.strokeWidth)
            .on('mouseover', function (d) {
              if (!configs.boxTips) return;
              var tipStr = self._generateTipStr(configs.boxTips(key, d))
              self.tipContent.html(tipStr)
              self.tip
                .style('opacity', 0.9)
                .style('top', currentEvent.data.originalEvent.clientY - self.tip.node().clientHeight - 20 + 'px')
                .style('left', currentEvent.data.originalEvent.clientX + 'px')
            })
            .on('mouseout', function (d) {
              self.tip
                .style('opacity', 0);
            });

          const horizontalLine = content.selectAll(".whiskers")
            .data([recordQuantile[key][1]])
            .enter()
            .append("line")
            .attr("x1", function (d) {
              return xScale(key) - barWidth / 2
            })
            .attr("y1", function (d) {
              return yScale(d)
            })
            .attr("x2", function (d) {
              return xScale(key) + barWidth / 2
            })
            .attr("y2", function (d) {
              return yScale(d)
            })
            .attr("stroke", typeof style.stroke === 'function' ? style.stroke(key) : style.stroke)
            .attr("stroke-width", style.strokeWidth + 1)
            .attr("fill", "none");

          const circles = content.selectAll(".circles")
            .data(recordOutlier[key].low.concat(recordOutlier[key].high))
            .enter()
            .append('circle')
            .attr('cx', xScale(key))
            .attr('cy', function (d) {
              return yScale(+d.value)
            })
            .attr('r', 2)
            .attr('fill', typeof style.fill === 'function' ? style.fill(key) : style.fill)
            .attr('stroke-width', 0)
            .attr('stroke', 'none')
            .on('mouseover', function (d) {
              if (!configs.outlierTips) return;
              var tipStr = self._generateTipStr(configs.outlierTips(key, d))
              self.tipContent.html(tipStr)
              self.tip
                .style('opacity', 0.9)
                .style('top', currentEvent.data.originalEvent.clientY - self.tip.node().clientHeight - 20 + 'px')
                .style('left', currentEvent.data.originalEvent.clientX + 'px')
            })
            .on('mouseout', function (d) {
              self.tip
                .style('opacity', 0);
            });
        })
        const xAxis = d3.axisBottom(xScale);
        // .tickValues(ticks.x.values).tickFormat(d3.format(ticks.x.format));
        const yAxis = d3.axisLeft(yScale);
        // Setup a scale on the left
        const cY = axisY.append("g")
          .call(yAxis)
          .style('font-family', style.fontFamily);

        // Setup a series axis on the top
        const cX = axisX.append("g")
          .call(xAxis)
          .style('font-family', style.fontFamily);

        // function zoomed() {
        //   g.attr('transform', currentEvent.transform);
        //   cX.call(xAxis.scale(currentEvent.transform.rescaleX(x)));
        //   cY.call(yAxis.scale(currentEvent.transform.rescaleY(y)));
        // }
        configs.completed && configs.completed()
        var rootNode = content.node().rootNode;

        function zoomed() {
          var node = content.node().glElem;
          // var xPath = cX.select('path.domain').node().glElem;
          var xTicks = cX.selectAll('g.tick')._groups[0].map(function (d) {
            return d.glElem;
          })
          var yTicks = cY.selectAll('g.tick')._groups[0].map(function (d) {
            return d.glElem;
          })
          // console.log(xPath, xTicks)
          var transform = currentEvent.transform;
          xTicks.forEach(function (d) {
            if (!d.oriPos) {
              d.oriPos = {
                x: d.position.x,
                y: d.position.y
              }
            }
            d.position.x = (d.oriPos.x * transform.k + transform.x);
          })
          yTicks.forEach(function (d) {
            if (!d.oriPos) {
              d.oriPos = {
                x: d.position.x,
                y: d.position.y
              }
            }
            d.position.y = (d.oriPos.y * transform.k + transform.y);
          })
          node.scale.x = transform.k;
          node.scale.y = transform.k;
          node.position.x = transform.x;
          node.position.y = transform.y;
          rootNode.renderer.render(rootNode.stage);
          // content.attr('transform', currentEvent.transform);
          // cX.call(xAxis.scale(currentEvent.transform.rescaleX(x)));
          // cY.call(yAxis.scale(currentEvent.transform.rescaleY(y)));
        }
      })
    }

    function getQuantile(d) {
      return [
        d3.quantile(d, 0.25),
        d3.quantile(d, 0.5),
        d3.quantile(d, 0.75)
      ]
    }
  }
  _generateTip() {
    if (d3.select('body').select('.tip').empty()) {
      this.tip = d3.select('body')
        .append('div')
        .attr('class', 'tip')
        .style('opacity', 0)
        .style('position', 'fixed')
        .style('font-family', baseConfig.style.fontFamily)
        .style('text-align', 'left')
        .style('padding', '5px 10px')
        .style('background-color', '#333333')
        .style('color', 'white')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('z-index', 9999);
      this.tipContent = this.tip.append('div')
        .attr('class', 'tip-content');
      this.tip.append('div')
        .style('border-top', '8px solid #333333')
        .style('border-left', '5px solid #333333')
        .style('border-bottom', '8px solid transparent')
        .style('border-right', '5px solid transparent')
        .style('position', 'absolute')
        .style('top', 'calc(100% - 5px)')
        .style('left', 0)
    } else {
      this.tip = d3.select('body').select('.tip')
      this.tipContent = this.tip.select('.tip-content')
    }
  }
  _generateTipStr(tipArr) {
    var tipStr = '';
    for (var i = 0; i < tipArr.length; i++) {
      var li = document.createElement('li');
      li.style.fontSize = '12px';
      li.style.color = '#ffffff';
      li.style.listStyle = 'none';
      var title = tipArr[i].title;
      var value = tipArr[i].value;
      var titleNode = document.createElement('span');
      titleNode.style.color = '#dddddd';
      titleNode.innerText = title + ': ';
      li.appendChild(titleNode);
      var valueNode = document.createTextNode(value);
      li.appendChild(valueNode);
      var serializer = new XMLSerializer();
      tipStr += serializer.serializeToString(li);
    }
    return tipStr;
  }
}