import CytoscapeComponent from 'react-cytoscapejs'
import type { ElementDefinition } from 'cytoscape'

type RawNode = { id: string; label: string; stage: string; domain: string }
type RawEdge = { source: string; target: string; type: string }
export type GraphData = { nodes: RawNode[]; edges: RawEdge[] }

function toElements(data: GraphData): ElementDefinition[] {
  const nodeEls: ElementDefinition[] = data.nodes.map((n) => ({
    data: { id: n.id, label: n.label, stage: n.stage, domain: n.domain },
  }))
  const edgeEls: ElementDefinition[] = data.edges.map((e, i) => ({
    data: {
      id: `e${i}:${e.source}->${e.target}`,
      source: e.source,
      target: e.target,
      type: e.type,
    },
  }))
  return [...nodeEls, ...edgeEls]
}

export default function GraphPanel(props: { data: GraphData }) {
  const { data } = props
  const elements = toElements(data)

  return (
    <CytoscapeComponent
      elements={elements}
      style={{ width: '100%', height: '400px' }}
      layout={{ name: 'cose' }}
    />
  )
}