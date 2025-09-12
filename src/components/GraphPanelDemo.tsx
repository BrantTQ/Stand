import GraphPanel from './GraphPanel'

// Sample test data demonstrating the GraphPanel component
const sampleGraphData = {
  nodes: [
    { id: 'n1', label: 'Early Childhood', stage: 'Stage 1', domain: 'Education' },
    { id: 'n2', label: 'Adolescence', stage: 'Stage 2', domain: 'Social' },
    { id: 'n3', label: 'Young Adult', stage: 'Stage 3', domain: 'Career' },
    { id: 'n4', label: 'Middle Age', stage: 'Stage 4', domain: 'Family' },
    { id: 'n5', label: 'Elder Years', stage: 'Stage 5', domain: 'Health' }
  ],
  edges: [
    { source: 'n1', target: 'n2', type: 'progression' },
    { source: 'n2', target: 'n3', type: 'progression' },
    { source: 'n3', target: 'n4', type: 'progression' },
    { source: 'n4', target: 'n5', type: 'progression' },
    { source: 'n2', target: 'n4', type: 'influence' }
  ]
}

// Example component showing how to use GraphPanel
export default function GraphPanelDemo() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Life Stages Graph Visualization</h2>
      <GraphPanel data={sampleGraphData} />
    </div>
  )
}