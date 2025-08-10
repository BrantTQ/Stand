import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import graphData from '../data/graph.json';

interface GraphPanelProps {
  selectedDomain: string | null;
  stageId?: string;
}

const GraphPanel = ({ selectedDomain, stageId }: GraphPanelProps) => {
  const cyRef = useRef<HTMLDivElement | null>(null);
  const [cyInstance, setCyInstance] = useState<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!cyRef.current) return;

    // Filter nodes by selectedDomain and stageId
    let nodes = graphData.nodes;
    if (selectedDomain) {
      nodes = nodes.filter(node => node.domain === selectedDomain);
    }
    if (stageId) {
      nodes = nodes.filter(node => node.stage === stageId);
    }

    const nodeIds = nodes.map(n => n.id);
    const edges = graphData.edges.filter(
      edge => nodeIds.includes(edge.source) && nodeIds.includes(edge.target)
    );

    // Debug: log filtered nodes/edges
    console.log('GraphPanel nodes:', nodes);
    console.log('GraphPanel edges:', edges);

    // Clean up previous instance
    if (cyInstance) {
      cyInstance.destroy();
    }

    // Avoid rendering a lone node as a dangling circle
    if (nodes.length < 2) return;

    const cy = cytoscape({
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
            // Suppress labels on nodes
            'label': ''
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

    setCyInstance(cy);

    return () => {
      cy.destroy();
    };
  }, [selectedDomain, stageId]);

  return (
    
      <div ref={cyRef} style={{ width: '100%', height: '400px' }} />
    
  );
};

export default GraphPanel;
