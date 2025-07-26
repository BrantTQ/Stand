import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import graphData from '../data/graph.json';

const GraphPanel = () => {
  const cyRef = useRef(null);

  useEffect(() => {
    if (cyRef.current) {
      cytoscape({
        container: cyRef.current,
        elements: graphData,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#666',
              'label': 'data(label)'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 3,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle'
            }
          }
        ],
        layout: {
          name: 'grid',
          rows: 1
        }
      });
    }
  }, []);

  return <div ref={cyRef} style={{ width: '100%', height: '400px' }} />;
};

export default GraphPanel;
