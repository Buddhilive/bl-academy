"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controls, Handle, MiniMap, Position, type Edge as FlowEdge, type Node as FlowNode, type NodeProps } from "@xyflow/react";
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from "d3-force";

import { Canvas } from "@/components/ai-elements/canvas";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { GraphEdge, GraphNode } from "@/lib/knowledge/types";

const TYPE_COLORS: Record<string, string> = {
  Document: "border-blue-500",
  Definition: "border-emerald-500",
  Procedure: "border-amber-500",
  Topic: "border-violet-500",
  Table: "border-cyan-500",
  Reference: "border-rose-500",
  Section: "border-muted-foreground",
};

function borderColorForType(type: string): string {
  return TYPE_COLORS[type] ?? "border-slate-400";
}

// Centered, invisible handles so straight edges connect node centers regardless
// of relative position — this is an omnidirectional knowledge graph, not a
// left-to-right flow diagram, so fixed left/right handles would look wrong.
const CENTER_HANDLE_STYLE: React.CSSProperties = {
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  opacity: 0,
  pointerEvents: "none",
};

function ConceptNode({ data }: NodeProps) {
  const title = typeof data.title === "string" ? data.title : "";
  const type = typeof data.type === "string" ? data.type : "Section";
  const description = typeof data.description === "string" ? data.description : "";
  const isIsolated = data.isIsolated === true;
  const card = (
    <div
      className={cn(
        "w-40 rounded-md border-2 bg-card px-2 py-1.5 text-xs shadow-sm",
        borderColorForType(type),
        isIsolated && "border-dashed opacity-70"
      )}
    >
      <Handle type="target" position={Position.Top} style={CENTER_HANDLE_STYLE} />
      <div className="line-clamp-2 font-medium">{title}</div>
      <div className="text-[10px] text-muted-foreground">{type}</div>
      <Handle type="source" position={Position.Bottom} style={CENTER_HANDLE_STYLE} />
    </div>
  );
  if (!description) return card;
  return (
    <Tooltip>
      <TooltipTrigger render={card} />
      <TooltipContent side="top">{description}</TooltipContent>
    </Tooltip>
  );
}

const nodeTypes = { concept: ConceptNode };

interface SimNode {
  id: string;
  sourceSlug: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

function computeLayout(nodes: GraphNode[], edges: GraphEdge[]): { flowNodes: FlowNode[]; flowEdges: FlowEdge[] } {
  if (nodes.length === 0) return { flowNodes: [], flowEdges: [] };

  // Cluster nodes loosely by source document — a grid of weak per-cluster
  // centroids that d3-force gently pulls each source's nodes toward, on top
  // of the usual charge/link/collide forces doing the real layout work.
  const sourceSlugs = Array.from(new Set(nodes.map((n) => n.sourceSlug)));
  const cols = Math.max(1, Math.ceil(Math.sqrt(sourceSlugs.length)));
  const clusterSpacing = 420;
  const clusterCenters = new Map<string, { x: number; y: number }>();
  sourceSlugs.forEach((slug, i) => {
    clusterCenters.set(slug, { x: (i % cols) * clusterSpacing, y: Math.floor(i / cols) * clusterSpacing });
  });

  const simNodes: SimNode[] = nodes.map((n) => ({ id: n.id, sourceSlug: n.sourceSlug }));
  const simEdges = edges.map((e) => ({ source: e.from, target: e.to }));

  const simulation = forceSimulation(simNodes)
    .force("charge", forceManyBody().strength(-250))
    .force(
      "link",
      forceLink(simEdges as never[])
        .id((d) => (d as unknown as SimNode).id)
        .distance(110)
    )
    .force("collide", forceCollide(70))
    .force(
      "x",
      forceX<SimNode>((d) => clusterCenters.get(d.sourceSlug)?.x ?? 0).strength(0.08)
    )
    .force(
      "y",
      forceY<SimNode>((d) => clusterCenters.get(d.sourceSlug)?.y ?? 0).strength(0.08)
    )
    .stop();

  for (let i = 0; i < 300; i++) simulation.tick();

  const positioned = new Map(simNodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }]));

  const flowNodes: FlowNode[] = nodes.map((n) => ({
    id: n.id,
    type: "concept",
    position: positioned.get(n.id) ?? { x: 0, y: 0 },
    data: { title: n.title, type: n.type, description: n.description, isIsolated: n.isIsolated },
  }));

  const flowEdges: FlowEdge[] = edges.map((e, i) => ({
    id: `e${i}-${e.from}-${e.to}`,
    source: e.from,
    target: e.to,
    type: "straight",
  }));

  return { flowNodes, flowEdges };
}

export function GraphCanvas({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const router = useRouter();
  const { flowNodes, flowEdges } = React.useMemo(() => computeLayout(nodes, edges), [nodes, edges]);
  const nodesBySlug = React.useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <div className="h-[70vh] w-full overflow-hidden rounded-lg border">
      <Canvas
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        panOnDrag
        selectionOnDrag={false}
        zoomOnDoubleClick
        onNodeClick={(_, node) => {
          const gn = nodesBySlug.get(node.id);
          if (gn) router.push(`/knowledge-viewer/${gn.sourceSlug}/${gn.conceptSlug}`);
        }}
      >
        <Controls />
        <MiniMap pannable zoomable />
      </Canvas>
    </div>
  );
}
