import {select, event} from 'd3-selection'
// import 'd3-transition'

export function registerTooltip (track, instance, element, trackParams) {
  track.dispatch.on('mouseover', (d) => {
    var tipContent = trackParams.tooltipContent(d);
    var tipStr = '';
    for (var i = 0; i < tipContent.length; i++) {
      var li = document.createElement('li');
      li.style.fontSize = '12px';
      li.style.color = '#ffffff';
      li.style.listStyle = 'none';
      var title = tipContent[i].title;
      var value = tipContent[i].value;
      var titleNode = document.createElement('span');
      titleNode.style.color = '#dddddd';
      titleNode.innerText = title + ': ';
      li.appendChild(titleNode);
      var valueNode = document.createTextNode(value);
      li.appendChild(valueNode);
      var serializer = new XMLSerializer();
      tipStr += serializer.serializeToString(li);
    }
    instance.tipContent
      .html(tipStr)
      // .transition()
    instance.tip.style('opacity', 0.9)
      .style('left', (event.data.originalEvent.clientX) + 'px')
      .style('top', (event.data.originalEvent.clientY - instance.tip.node().clientHeight - 20) + 'px')
  })

  track.dispatch.on('mouseout', (d) => {
    instance.tip
      // .transition()
      // .duration(500)
      .style('opacity', 0)
  })
}
