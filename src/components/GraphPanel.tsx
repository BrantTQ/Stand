import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import graphData from '../data/graph.json';

interface GraphPanelProps {
  selectedDomain: string | null;
  stageId?: string; // Optional, if you want to filter by stage too
}

const GraphPanel = ({ selectedDomain, stageId }: GraphPanelProps) => {
  const cyRef = useRef(null);

  useEffect(() => {
    if (cyRef.current) {
      // Filter nodes by selectedDomain (and stage if provided)
      let nodes = graphData.nodes;
      if (selectedDomain) {
        nodes = nodes.filter(
          node => node.domain === selectedDomain
        );
      }
      if (stageId) {
        nodes = nodes.filter(
          node => node.stage === stageId
        );
      }

      // Only include edges that connect filtered nodes
      const nodeIds = nodes.map(n => n.id);
      const edges = graphData.edges.filter(
        edge => nodeIds.includes(edge.source) && nodeIds.includes(edge.target)
      );

      cytoscape({
        container: cyRef.current,
        elements: [
          ...nodes.map(n => ({ data: n })),
          ...edges.map(e => ({ data: e }))
        ],
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
  }, [selectedDomain, stageId]);

  return <div ref={cyRef} style={{ width: '100%', height: '400px' }} />;
};

export default GraphPanel;
