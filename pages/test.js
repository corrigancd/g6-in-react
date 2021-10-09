import React, { useEffect } from 'react'
import G6 from '@antv/g6';
import Grid from './plugins/grid';

const data = {
  nodes: [
    { id: 'node0', size: 50, label: 'mylabel0' },
    { id: 'node1', size: 30, label: 'mylabel1' },
    { id: 'node2', size: 30, label: 'mylabel2' },
    { id: 'node3', size: 30, label: 'mylabel3' },
    { id: 'node4', size: 30, label: 'mylabel4' },
    { id: 'node5', size: 30, label: 'mylabel5' },
    { id: 'node6', size: 15, label: 'mylabel6' },
    { id: 'node7', size: 15, label: 'mylabel7' },
    { id: 'node8', size: 15, label: 'mylabel8' },
    { id: 'node9', size: 15, label: 'mylabel9' },
    { id: 'node10', size: 15, label: 'mylabel10' },
    { id: 'node11', size: 15, label: 'mylabel11' },
    { id: 'node12', size: 15, label: 'mylabel12' },
    { id: 'node13', size: 15, label: 'mylabel13' },
    { id: 'node14', size: 15, label: 'mylabel14' },
    { id: 'node15', size: 15, label: 'mylabel15' },
    { id: 'node16', size: 15, label: 'mylabel16' },
  ],
  edges: [
    { source: 'node0', target: 'node1' },
    { source: 'node0', target: 'node2' },
    { source: 'node0', target: 'node3' },
    { source: 'node0', target: 'node4' },
    { source: 'node0', target: 'node5' },
    { source: 'node1', target: 'node6' },
    { source: 'node1', target: 'node7' },
    { source: 'node2', target: 'node8' },
    { source: 'node2', target: 'node9' },
    { source: 'node2', target: 'node10' },
    { source: 'node2', target: 'node11' },
    { source: 'node2', target: 'node12' },
    { source: 'node2', target: 'node13' },
    { source: 'node3', target: 'node14' },
    { source: 'node3', target: 'node15' },
    { source: 'node3', target: 'node16' },
  ],
};

const specs = {
  width: 900,
  height: 600
}

const Test = () => {
  const ref = React.useRef(null)
  let graph = null

  const grid = new Grid(specs);
  useEffect(() => {
    if (!graph) {
      // 实例化 Minimap
      const minimap = new G6.Minimap();

      // 实例化 Graph
      graph = new G6.Graph({
        container: ref.current,
        width: specs.width,
        height: specs.height,
        plugins: [minimap],
        modes: {
          default: [
            'drag-canvas',
            'zoom-canvas',
            {
              type: 'tooltip', // Tooltip
              formatText(model) {
                // The content of tooltip
                const text = 'label: ' + model.label + '<br/> id: ' + model.id;
                return text;
              },
            },
            {
              type: 'edge-tooltip', // Edge tooltip
              formatText(model) {
                // The content of the edge tooltip
                const text =
                  'source: ' +
                  model.source +
                  '<br/> target: ' +
                  model.target;
                return text;
              },
            },
          ],
          edit: ['click-select']
        },
        defaultNode: {
          type: 'circle',
          labelCfg: {
            style: {
              fill: '#000000A6',
              fontSize: 10
            }
          },
          style: {
            stroke: '#72CC4A',
            width: 150
          }
        },
        defaultEdge: {
          type: 'line'
        },
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: d => {
            if (d.source.id === 'node0') {
              return 100;
            }
            return 30;
          },
        },
        nodeStateStyles: {
          hover: {
            stroke: 'red',
            lineWidth: 3
          }
        },
        edgeStateStyles: {
          hover: {
            stroke: 'blue',
            lineWidth: 3
          }
        }
      })
    }

    graph.data(data)
    graph.render()

    graph.addPlugin(grid);


    graph.on('node:mouseenter', evt => {
      graph.setItemState(evt.item, 'hover', true)
    })

    graph.on('node:mouseleave', evt => {
      graph.setItemState(evt.item, 'hover', false)
    })

    graph.on('edge:mouseenter', evt => {
      graph.setItemState(evt.item, 'hover', true)
    })

    graph.on('edge:mouseleave', evt => {
      graph.setItemState(evt.item, 'hover', false)
    })

  }, [])

  return <div ref={ref}></div>
}

export { Test };
