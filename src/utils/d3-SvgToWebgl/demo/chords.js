import Plot from '../index.js';
import { scaleQuantize } from 'd3-scale';
import store from '../../store/store';

export default function drawDemo(){
	var canvas = document.getElementsByTagName('canvas')[0];
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	// store.getState().fileReceive.data 
	new Plot.circular(document.getElementsByTagName('canvas')[0], {
		bgColor: 0xF4F4F4
	// }).chords({
	}).visShare({
		fileUrl: '/dist/chords/10GRCh37.json',
		fileType: 'json',
		configs: {
			innerRadius: 320 * 0.95,
			outerRadius: 320,
			labels: true,
			ticks: true,
			labelSuffix: 'M',
			labelSpacing: 10
		}
	}, [{
		circularType: 'highlight',
		name: 'CpG',
		fileUrl: '/dist/chords/CpG.v3.bed',
		fileType: 'tsv',
		configs: {
			innerRadius: 0.83 / 0.95,
			outerRadius: 0.92 / 0.95,
			color: function (d, min, max) {
				return scaleQuantize().domain([min, max]).range(['#3247A6', '#4A46AE', '#6E6BBE', '#8F6BBE', '#CD78C0', '#E0619D', '#ED6086', '#E35E73', '#E56060', '#DF5349', '#DC4035', '#ED2E21'])(d.value)
			},
			tips: function (d) {
				return [{
					title: 'Chrom',
					value: d.chrom
				}, {
					title: 'value',
					value: d.value
				}]
			}
		}
	}, {
		circularType: 'heatmap',
		name: 'CHG',
		fileUrl: '/dist/chords/CHG.v3.bed',
		fileType: 'tsv',
		configs: {
			innerRadius: 0.715 / 0.95,
			outerRadius: 0.805 / 0.95,
			color: function (d, min, max) {
				return scaleQuantize().domain([min, max]).range(['#3247A6', '#4A46AE', '#6E6BBE', '#8F6BBE', '#CD78C0', '#E0619D', '#ED6086', '#E35E73', '#E56060', '#DF5349', '#DC4035', '#ED2E21'])(d.value)
			},
			tips: function (d) {
				return [{
					title: 'Chrom',
					value: d.chrom
				}, {
					title: 'value',
					value: d.value
				}]
			}
		}
	},
	{
		circularType: 'heatmap',
		name: 'CHH',
		fileUrl: '/dist/chords/CHH.v3.bed',
		fileType: 'tsv',
		configs: {
			innerRadius: 0.59 / 0.95,
			outerRadius: 0.68 / 0.95,
			color: function (d, min, max) {
				return scaleQuantize().domain([min, max]).range(['#3247A6', '#4A46AE', '#6E6BBE', '#8F6BBE', '#CD78C0', '#E0619D', '#ED6086', '#E35E73', '#E56060', '#DF5349', '#DC4035', '#ED2E21'])(d.value)
			},
			tips: function (d) {
				return [{
					title: 'Chrom',
					value: d.chrom
				}, {
					title: 'value',
					value: d.value
				}]
			}
		}
	},
	{
		circularType: 'heatmap',
		name: 'repeats',
		fileUrl: '/dist/chords/repeats.txt',
		fileType: 'tsv',
		configs: {
			innerRadius: 0.475 / 0.95,
			outerRadius: 0.565 / 0.95,
			color: function (d, min, max) {
				return scaleQuantize().domain([min, max]).range(['#3247A6', '#4A46AE', '#6E6BBE', '#8F6BBE', '#CD78C0', '#E0619D', '#ED6086', '#E35E73', '#E56060', '#DF5349', '#DC4035', '#ED2E21'])(d.value)
			},
			tips: function (d) {
				return [{
					title: 'Chrom',
					value: d.chrom
				}, {
					title: 'value',
					value: d.value
				}]
			}
		}
	}, 
	{
		circularType: 'scatter',
		name: 'lncRNA',
		fileUrl: '/dist/chords/lncRNA.bed',
		fileType: 'tsv',
		configs: {
			innerRadius: 0.3 / 0.95,
			outerRadius: 0.45 / 0.95,
			color: '#3247A6',
			stroke: '#3247A6',
			thickness: 0.1,
			size: 1.2 * Math.PI,
			// fillOpacity: function (d) {
			// 	var i = scaleLinear().domain([0, 0.01]).range([0.5, 1]).clamp(true)(d.value)
			// 	return i;
			// },
			// min: 0,
			// max: 6,
			// axes: [{
			// 	position: 0.000001,
			// 	thickness: 1,
			// 	color: '#FFAFE3',
			// 	opacity: 0.3
			// }, {
			// 	position: 0.005,
			// 	thickness: 1,
			// 	color: '#FFAFE3',
			// 	opacity: 0.5
			// }, {
			// 	position: 0.01,
			// 	thickness: 1,
			// 	color: '#FFAFE3',
			// 	opacity: 0.7
			// }],
			// backgrounds: [{
			// 	start: 0,
			// 	end: 0.01,
			// 	color: '#FFAFE3',
			// 	opacity: 0.15
			// }],
			tips: function (d, i) {
				return [{
					title: 'Chrom',
					value: d.chrom
				}, {
					title: 'Value',
					value: d.value
				}]
			}
		}
	}, {
		circularType: 'chords',
		name: 'interchr',
		fileUrl: '/dist/chords/interchr.json',
		fileType: 'json',
		configs: {
			stroke: '#3247A6',
			strokeWidth: 1,
			radius: 0.3 / 0.95
		}
	}, {
		circularType: 'chords',
		name: 'intrachr',
		fileUrl: '/dist/chords/intrachr.json',
		fileType: 'json',
		configs: {
			stroke: '#DC4035',
			strokeWidth: 1,
			radius: 0.3 / 0.95
		}
	}]);
}