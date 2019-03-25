import chart from './Renderer/ChartRenderer';
import circular from './Renderer/CircularRenderer';
const Plot = window.Plot || {};
Plot.chart = chart;
Plot.circular = circular;
export default Plot;