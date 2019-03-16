export default {
  innerRadius: 250,
  outerRadius: 300,
  cornerRadius: 0,
  gap: 0.04, // in radian
  opacity: 1,
  strokeWidth: 0,
  stroke: '#000000',
  labels: {
    position: 'left',
    display: true,
    size: 15,
    color: '#000',
    radialOffset: 20
  },
  ticks: {
    display: true,
    color: 'grey',
    spacing: 10000000,
    labels: true,
    labelSpacing: 5,
    labelSuffix: '',
    labelDenominator: 1,
    labelDisplay0: false,
    labelSize: 12,
    labelColor: '#000',
    labelFont: 'AvenirNext-Medium, Baskerville, Palatino-Roman, Helvetica, "Times New Roman"',
    majorSpacing: 5,
    size: {
      minor: 2,
      major: 5
    }
  },
  onClick: null,
  onMouseOver: null,
  events: {},
  zIndex: false
}