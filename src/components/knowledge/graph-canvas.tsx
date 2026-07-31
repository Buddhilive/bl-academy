"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import cytoscape, { type Core, type ElementDefinition, type NodeSingular, type StylesheetJson } from "cytoscape";
import fcose from "cytoscape-fcose";
import { MaximizeIcon, MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { GraphEdge, GraphNode, TrustTier } from "@/lib/knowledge/types";

if (!cytoscape("core", "fcose")) {
  cytoscape.use(fcose);
}

const TYPE_COLORS: Record<string, string> = {
  Document: "#3b82f6", // blue-500
  Definition: "#10b981", // emerald-500
  Procedure: "#f59e0b", // amber-500
  Topic: "#8b5cf6", // violet-500
  Table: "#06b6d4", // cyan-500
  Reference: "#f43f5e", // rose-500
  Section: "#71717a", // zinc-500, stands in for muted-foreground
};
const FALLBACK_TYPE_COLOR = "#94a3b8"; // slate-400

function colorForType(type: string): string {
  return TYPE_COLORS[type] ?? FALLBACK_TYPE_COLOR;
}

const TRUST_BORDER_WIDTH: Record<TrustTier, number> = {
  unverified: 1,
  "machine-confirmed": 2,
  "human-reviewed": 3,
};

const PALETTE = {
  light: { bg: "#ffffff", text: "#0f172a", compound: "#f1f5f9", compoundBorder: "#e2e8f0", edge: "#cbd5e1" },
  dark: { bg: "#1e293b", text: "#f1f5f9", compound: "#0f172a", compoundBorder: "#334155", edge: "#475569" },
};

function buildStylesheet(theme: "light" | "dark"): StylesheetJson {
  const p = PALETTE[theme];
  return [
    {
      selector: "node.concept",
      style: {
        shape: "round-rectangle",
        width: 140,
        height: 46,
        "background-color": p.bg,
        "border-color": (ele: NodeSingular) => colorForType(ele.data("type")),
        "border-width": (ele: NodeSingular) => TRUST_BORDER_WIDTH[ele.data("trustTier") as TrustTier] ?? 1,
        "border-style": (ele: NodeSingular) => (ele.data("isIsolated") ? "dashed" : "solid"),
        opacity: (ele: NodeSingular) => (ele.data("isIsolated") ? 0.7 : 1),
        label: "data(title)",
        "font-size": 10,
        "text-wrap": "ellipsis",
        "text-max-width": "126px",
        "text-valign": "center",
        "text-halign": "center",
        color: p.text,
      },
    },
    {
      selector: "node.concept:selected",
      style: { "border-width": 4 },
    },
    {
      selector: "node.source-cluster",
      style: {
        shape: "round-rectangle",
        "background-color": p.compound,
        "background-opacity": 1,
        "border-color": p.compoundBorder,
        "border-width": 1,
        label: "data(label)",
        "font-size": 11,
        "font-weight": 600,
        color: p.text,
        "text-valign": "top",
        "text-halign": "center",
        "text-margin-y": -6,
        padding: "24px",
      },
    },
    {
      selector: "edge",
      style: {
        width: 1.5,
        "line-color": p.edge,
        "curve-style": "bezier",
        "target-arrow-shape": "none",
      },
    },
  ];
}

function toCyElements(nodes: GraphNode[], edges: GraphEdge[]): ElementDefinition[] {
  const sourceSlugs = Array.from(new Set(nodes.map((n) => n.sourceSlug)));
  const clusters: ElementDefinition[] = sourceSlugs.map((slug) => ({
    data: { id: `cluster:${slug}`, label: slug },
    classes: "source-cluster",
  }));
  const conceptNodes: ElementDefinition[] = nodes.map((n) => ({
    data: {
      id: n.id,
      parent: `cluster:${n.sourceSlug}`,
      sourceSlug: n.sourceSlug,
      conceptSlug: n.conceptSlug,
      title: n.title,
      type: n.type,
      trustTier: n.trustTier,
      description: n.description ?? "",
      isIsolated: n.isIsolated,
    },
    classes: "concept",
  }));
  const cyEdges: ElementDefinition[] = edges.map((e) => ({
    data: { id: `${e.from}->${e.to}`, source: e.from, target: e.to },
  }));
  return [...clusters, ...conceptNodes, ...cyEdges];
}

export function GraphCanvas({ nodes, edges }: { nodes: GraphNode[]; edges: GraphEdge[] }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const cyRef = React.useRef<Core | null>(null);
  const routerRef = React.useRef(router);
  const nodesRef = React.useRef(nodes);
  React.useEffect(() => {
    routerRef.current = router;
    nodesRef.current = nodes;
  }, [router, nodes]);

  const [tooltip, setTooltip] = React.useState<{ x: number; y: number; title: string; description: string } | null>(
    null
  );

  // Mount/unmount only: create and destroy the cytoscape instance once.
  React.useEffect(() => {
    if (!containerRef.current) return;
    const cy = cytoscape({
      container: containerRef.current,
      elements: [],
      style: buildStylesheet(theme),
      wheelSensitivity: 0.2,
      minZoom: 0.2,
      maxZoom: 3,
    });
    cyRef.current = cy;

    cy.on("tap", "node.concept", (evt) => {
      const gn = nodesRef.current.find((n) => n.id === evt.target.id());
      if (gn) routerRef.current.push(`/knowledge-viewer/${gn.sourceSlug}/${gn.conceptSlug}`);
    });

    cy.on("mouseover", "node.concept", (evt) => {
      const node = evt.target;
      const description = node.data("description") as string;
      if (!description) return;
      const pos = node.renderedPosition();
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setTooltip({
        x: rect.left + pos.x,
        y: rect.top + pos.y,
        title: node.data("title") as string,
        description,
      });
      container.style.cursor = "pointer";
    });
    cy.on("mouseout", "node.concept", () => {
      setTooltip(null);
      if (containerRef.current) containerRef.current.style.cursor = "";
    });

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-apply the stylesheet when the theme flips, without rebuilding elements.
  React.useEffect(() => {
    cyRef.current?.style(buildStylesheet(theme));
  }, [theme]);

  // Rebuild elements + re-layout whenever the graph data changes.
  React.useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().remove();
    cy.add(toCyElements(nodes, edges));
    cy.layout({
      name: "fcose",
      quality: "default",
      animate: false,
      nodeSeparation: 90,
      idealEdgeLength: 110,
      nestingFactor: 0.5,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any).run();
  }, [nodes, edges]);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden rounded-lg border">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute right-2 top-2 flex flex-col gap-1">
        <Button size="icon" variant="outline" onClick={() => cyRef.current?.zoom(cyRef.current.zoom() * 1.2)}>
          <PlusIcon />
        </Button>
        <Button size="icon" variant="outline" onClick={() => cyRef.current?.zoom(cyRef.current.zoom() / 1.2)}>
          <MinusIcon />
        </Button>
        <Button size="icon" variant="outline" onClick={() => cyRef.current?.fit(undefined, 40)}>
          <MaximizeIcon />
        </Button>
      </div>
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 max-w-56 -translate-x-1/2 -translate-y-full rounded-md border bg-popover px-2 py-1.5 text-xs text-popover-foreground shadow-md"
          style={{ left: tooltip.x, top: tooltip.y - 12 }}
        >
          <div className="font-medium">{tooltip.title}</div>
          <div className="text-muted-foreground">{tooltip.description}</div>
        </div>
      )}
    </div>
  );
}
