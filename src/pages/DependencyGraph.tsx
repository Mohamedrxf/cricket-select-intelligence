import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, ZapOff, Expand, Shield } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import cyberBgVideo from "@/assets/cyber-bg-video.mp4";

interface GraphNode {
  id: string;
  type: string;
  x?: number;
  y?: number;
}

interface GraphEdge {
  source: string;
  target: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const DependencyGraph = () => {
  const location = useLocation();
  const initialGraph: GraphData = location.state?.graph ?? { nodes: [], edges: [] };
  const attackPaths: string[][] = location.state?.attackPaths ?? [];

  const [graph, setGraph] = useState(initialGraph);
  const [showAttackPaths, setShowAttackPaths] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [expandingNode, setExpandingNode] = useState<string | null>(null);

  if (!graph.nodes.length) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" src={cyberBgVideo} />
          <div className="absolute inset-0 bg-background/80 z-[1]" />
          <div className="absolute inset-0 cyber-grid z-[2]" />
          <div className="container relative z-[3] pt-24 flex flex-col items-center justify-center min-h-[60vh]">
            <Network className="w-16 h-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground drop-shadow-lg">No dependency graph available</h1>
            <p className="text-muted-foreground mt-2">Run a scan first to generate the dependency graph.</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const nodes = graph.nodes;
  const edges = graph.edges;

  const width = 1100;
  const perRow = 8;
  const rowSpacing = 150;
  const colSpacing = width / (perRow + 1);
  const totalRows = Math.ceil((nodes.length - 1) / perRow);
  const svgHeight = 280 + totalRows * rowSpacing + 100;

  const positionedNodes: GraphNode[] = nodes.map((node, i) => {
    if (i === 0) return { ...node, x: width / 2, y: 80 };
    const row = Math.floor((i - 1) / perRow);
    const col = (i - 1) % perRow;
    return { ...node, x: colSpacing * (col + 1), y: 260 + row * rowSpacing };
  });

  const findNode = (id: string) => positionedNodes.find(n => n.id === id);

  // Attack path edge set
  const attackEdgeSet = new Set<string>();
  attackPaths.forEach(path => {
    for (let i = 0; i < path.length - 1; i++) {
      attackEdgeSet.add(`${path[i]}->${path[i + 1]}`);
    }
  });

  // Edges connected to hovered node
  const getConnectedEdges = (nodeId: string | null) => {
    if (!nodeId) return new Set<number>();
    const set = new Set<number>();
    edges.forEach((e, i) => {
      if (e.source === nodeId || e.target === nodeId) set.add(i);
    });
    return set;
  };
  const connectedEdges = getConnectedEdges(hoveredNode);

  const expandNode = async (nodeId: string) => {
    setExpandingNode(nodeId);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/expand-node?package=${nodeId}`);
      const data = await res.json();
      const newNodes = data.nodes.filter((n: GraphNode) => !graph.nodes.some(existing => existing.id === n.id));
      const newEdges = data.edges.filter((e: GraphEdge) => !graph.edges.some(existing => existing.source === e.source && existing.target === e.target));
      if (newNodes.length > 0) {
        setGraph({ nodes: [...graph.nodes, ...newNodes], edges: [...graph.edges, ...newEdges] });
      }
    } catch (err) {
      console.error("Expansion error:", err);
    } finally {
      setExpandingNode(null);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" src={cyberBgVideo} />
        <div className="absolute inset-0 bg-background/85 z-[1]" />
        <div className="absolute inset-0 cyber-grid z-[2]" />

        <div className="container relative z-[3] pt-24 pb-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                <Network className="w-6 h-6 text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground drop-shadow-lg">Dependency Graph</h1>
                <p className="text-sm text-muted-foreground">
                  {nodes.length} packages · {edges.length} connections
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {attackPaths.length > 0 && (
                <Button
                  variant={showAttackPaths ? "destructive" : "outline"}
                  onClick={() => setShowAttackPaths(!showAttackPaths)}
                  className="gap-2"
                >
                  {showAttackPaths ? <ZapOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  {showAttackPaths ? "Hide Attack Paths" : "Show Attack Paths"}
                </Button>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mb-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
              <span>Root Package</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: "hsl(var(--neon-blue))" }} />
              <span>Dependency</span>
            </div>
            {attackPaths.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 rounded" style={{ background: "hsl(var(--neon-red))" }} />
                <span>Attack Path</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Expand className="w-3 h-3" />
              <span>Click node to expand</span>
            </div>
          </div>

          {/* Graph Card */}
          <Card className="bg-card/30 backdrop-blur-md border-border/40 overflow-hidden">
            <CardContent className="p-2">
              <div className="overflow-x-auto">
                <svg
                  width={width}
                  height={svgHeight}
                  className="mx-auto"
                  style={{ minWidth: width }}
                >
                  {/* Glow filter definitions */}
                  <defs>
                    <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <radialGradient id="node-gradient-root" cx="40%" cy="35%">
                      <stop offset="0%" stopColor="#67e8f9" />
                      <stop offset="100%" stopColor="#00bcd4" />
                    </radialGradient>
                    <radialGradient id="node-gradient-dep" cx="40%" cy="35%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </radialGradient>
                    <radialGradient id="node-gradient-hover" cx="40%" cy="35%">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </radialGradient>
                  </defs>

                  {/* EDGES */}
                  {edges.map((edge, i) => {
                    const source = findNode(edge.source);
                    const target = findNode(edge.target);
                    if (!source || !target) return null;

                    const key = `${edge.source}->${edge.target}`;
                    const isAttack = showAttackPaths && attackEdgeSet.has(key);
                    const isHighlighted = connectedEdges.has(i);

                    // Curved path
                    const midY = ((source.y ?? 0) + (target.y ?? 0)) / 2;
                    const dx = (target.x ?? 0) - (source.x ?? 0);
                    const curveOffset = dx * 0.15;
                    const d = `M ${source.x} ${source.y} C ${(source.x ?? 0) + curveOffset} ${midY}, ${(target.x ?? 0) - curveOffset} ${midY}, ${target.x} ${target.y}`;

                    return (
                      <motion.path
                        key={i}
                        d={d}
                        fill="none"
                        stroke={isAttack ? "hsl(var(--neon-red))" : isHighlighted ? "hsl(var(--neon-purple))" : "hsl(var(--border))"}
                        strokeWidth={isAttack ? 2.5 : isHighlighted ? 2 : 1}
                        strokeOpacity={isAttack ? 0.9 : isHighlighted ? 0.8 : 0.3}
                        filter={isAttack ? "url(#glow-red)" : undefined}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: i * 0.01 }}
                      />
                    );
                  })}

                  {/* NODES */}
                  {positionedNodes.map((node, i) => {
                    const isRoot = node.type === "root";
                    const isHovered = hoveredNode === node.id;
                    const isExpanding = expandingNode === node.id;
                    const radius = isRoot ? 20 : isHovered ? 14 : 11;

                    return (
                      <motion.g
                        key={node.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.025, type: "spring", stiffness: 300, damping: 20 }}
                        onClick={() => expandNode(node.id)}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Outer glow ring */}
                        {(isRoot || isHovered) && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={radius + 6}
                            fill="none"
                            stroke={isRoot ? "hsl(var(--primary))" : "hsl(var(--neon-purple))"}
                            strokeWidth="1"
                            strokeOpacity={0.4}
                            filter="url(#glow-cyan)"
                          />
                        )}

                        {/* Expanding pulse */}
                        {isExpanding && (
                          <motion.circle
                            cx={node.x}
                            cy={node.y}
                            r={radius}
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            initial={{ r: radius, opacity: 1 }}
                            animate={{ r: radius + 20, opacity: 0 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}

                        {/* Main node */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius}
                          fill={isRoot ? "url(#node-gradient-root)" : isHovered ? "url(#node-gradient-hover)" : "url(#node-gradient-dep)"}
                          filter={isRoot ? "url(#glow-cyan)" : undefined}
                          className="transition-all duration-200"
                        />

                        {/* Inner highlight */}
                        <circle
                          cx={(node.x ?? 0) - radius * 0.2}
                          cy={(node.y ?? 0) - radius * 0.25}
                          r={radius * 0.35}
                          fill="white"
                          fillOpacity={0.25}
                        />

                        {/* Label */}
                        <text
                          x={node.x}
                          y={(node.y ?? 0) + radius + 16}
                          textAnchor="middle"
                          fill={isHovered ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
                          fontSize={isRoot ? "13" : "11"}
                          fontWeight={isRoot ? "600" : "400"}
                          fontFamily="'JetBrains Mono', monospace"
                          className="transition-all duration-200"
                        >
                          {node.id}
                        </text>
                      </motion.g>
                    );
                  })}
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card className="bg-card/30 backdrop-blur-sm border-border/40">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <Network className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Packages</p>
                  <p className="text-lg font-bold font-mono text-foreground">{nodes.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/30 backdrop-blur-sm border-border/40">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-md bg-neon-purple/10">
                  <Expand className="w-4 h-4 text-neon-purple" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Connections</p>
                  <p className="text-lg font-bold font-mono text-foreground">{edges.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/30 backdrop-blur-sm border-border/40">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-md bg-neon-red/10">
                  <Shield className="w-4 h-4 text-neon-red" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Attack Paths</p>
                  <p className="text-lg font-bold font-mono text-foreground">{attackPaths.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default DependencyGraph;
