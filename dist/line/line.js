// import Plot from '../index.js';
import Plot from '../../d3-SvgToWebgl/index.js';

export default function line(){
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    new Plot.circular(document.getElementsByTagName('canvas')[0], {bgColor: 0xffffff}).line({
    // new Plot.circular(document.getElementsByTagName('canvas')[0], {bgColor: 0xffffff}).visShare({
        // fileUrl: '/dist/line/GRCh37.json',
        fileUrl: './GRC37.json',
        fileType: 'json',
        configs: {
            innerRadius: 300,
            outerRadius: 320,
            labels: false,
            ticks: true,
            tips: function (d) {
                return d.label
            }
        }
    }, [{
        circularType: 'highlight',
        name: 'cytobands',
        // fileUrl: '/dist/line/cytobands.csv',
        fileUrl: './cytobands.csv',
        fileType: 'csv',
        configs: {
            innerRadius: 300,
            outerRadius: 320
        }
    }, {
        circularType: 'line',
        name: 'CHH',
        // fileUrl: '/dist/line/CHH.v3.bed',
        fileUrl: './CHH.v3.bed',
        fileType: 'tsv',
        configs: {
            innerRadius: 0.85,
            outerRadius: 0.95,
            maxGap: 1000000,
            min: 0.02,
            max: 0.04,
            color: '#222222',
            axes: [{
                spacing: 0.01,
                thickness: 1,
                color: '#4caf50'
            }],
            backgrounds: [{
                start: 0.02,
                end: 0.04,
                color: '#b0cde2'
            }]
        }
    }, {
        circularType: 'line',
        name: 'CHG',
        // fileUrl: '/dist/line/CHG.v3.bed',
        fileUrl: './CHG.v3.bed',
        fileType: 'tsv',
        configs: {
            innerRadius: 0.5,
            outerRadius: 0.8,
            maxGap: 1000000,
            min: 0.3,
            max: 0.7,
            color: '#222222',
            axes: [{
                spacing: 0.05,
                thickness: 1,
                color: '#666666'
            }],
            backgrounds: [{
                start: 0.3,
                end: 0.7,
                color: '#ffffd0',
                opacity: 0.5
            }]
        }
    }]);
}