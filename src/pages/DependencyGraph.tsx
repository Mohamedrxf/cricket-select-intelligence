import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Network, ZapOff, Expand, Shield, Layers, GitBranch, Eye, EyeOff } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import cyberBgVideo from "@/assets/cyber-bg-video.mp4";

interface GraphNode {
  id: string;
  type: string;
  x?: number;
  y?: number;
  depth?: number; // 0 = root, 1 = direct dep, 2+ = expanded
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
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [expandedFromSet, setExpandedFromSet] = useState<Set<string>>(new Set());

  const activeNode = selectedNode || hoveredNode;

  // Connected nodes for dimming - must be before early return
  const connectedNodeIds = useMemo(() => {
    if (!activeNode) return null;
    const set = new Set<string>([activeNode]);
    graph.edges.forEach(e => {
      if (e.source === activeNode) set.add(e.target);
      if (e.target === activeNode) set.add(e.source);
    });
    return set;
  }, [activeNode, graph.edges]);

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
  const rowSpacing = 160;
  const colSpacing = width / (perRow + 1);
  const totalRows = Math.ceil((nodes.length - 1) / perRow);
  const svgHeight = 300 + totalRows * rowSpacing + 120;

  const positionedNodes: GraphNode[] = nodes.map((node, i) => {
    const isRoot = i === 0 || node.type === "root";
    const isExpanded = expandedFromSet.has(node.id);
    const depth = isRoot ? 0 : isExpanded ? 2 : 1;

    if (i === 0) return { ...node, x: width / 2, y: 90, depth: 0 };
    const row = Math.floor((i - 1) / perRow);
    const col = (i - 1) % perRow;
    return { ...node, x: colSpacing * (col + 1), y: 280 + row * rowSpacing, depth };
  });

  const findNode = (id: string) => positionedNodes.find(n => n.id === id);

  // Attack path edge set
  const attackEdgeSet = new Set<string>();
  attackPaths.forEach(path => {
    for (let i = 0; i < path.length - 1; i++) {
      attackEdgeSet.add(`${path[i]}->${path[i + 1]}`);
    }
  });

  // Edges connected to hovered/selected node
  const getConnectedEdges = (nodeId: string | null) => {
    if (!nodeId) return new Set<number>();
    const set = new Set<number>();
    edges.forEach((e, i) => {
      if (e.source === nodeId || e.target === nodeId) set.add(i);
    });
    return set;
  };
  const connectedEdges = getConnectedEdges(activeNode);

  const expandNode = async (nodeId: string) => {
    setExpandingNode(nodeId);
    setSelectedNode(nodeId);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/expand-node?package=${nodeId}`);
      const data = await res.json();
      const newNodes = data.nodes.filter((n: GraphNode) => !graph.nodes.some(existing => existing.id === n.id));
      const newEdges = data.edges.filter((e: GraphEdge) => !graph.edges.some(existing => existing.source === e.source && existing.target === e.target));
      if (newNodes.length > 0) {
        const newExpandedIds = new Set(expandedFromSet);
        newNodes.forEach((n: GraphNode) => newExpandedIds.add(n.id));
        setExpandedFromSet(newExpandedIds);
        setGraph({ nodes: [...graph.nodes, ...newNodes], edges: [...graph.edges, ...newEdges] });
      }
    } catch (err) {
      console.error("Expansion error:", err);
    } finally {
      setExpandingNode(null);
    }
  };

  // Node color logic based on depth
  const getNodeGradient = (node: GraphNode, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) return "url(#node-gradient-selected)";
    if (isHovered) return "url(#node-gradient-hover)";
    if (node.depth === 0 || node.type === "root") return "url(#node-gradient-root)";
    if (node.depth === 2) return "url(#node-gradient-expanded)";
    return "url(#node-gradient-dep)";
  };

  const getNodeGlowColor = (node: GraphNode, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) return "#f59e0b";
    if (isHovered) return "#a78bfa";
    if (node.depth === 0 || node.type === "root") return "#00e5ff";
    if (node.depth === 2) return "#10b981";
    return "#38bdf8";
  };

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" src={cyberBgVideo} />
        <div className="absolute inset-0 bg-background/85 z-[1]" />
        <div className="absolute inset-0 cyber-grid z-[2]" />

        <div className="container relative z-[3] pt-24 pb-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
                <Network className="w-7 h-7 text-primary drop-shadow-[0_0_10px_hsl(var(--primary)/0.8)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground drop-shadow-lg tracking-tight">
                  Dependency Graph
                </h1>
                <p className="text-sm text-muted-foreground font-mono">
                  {nodes.length} packages · {edges.length} connections · depth {Math.max(...positionedNodes.map(n => n.depth ?? 0))} levels
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLabels(!showLabels)}
                className="gap-1.5 border-border/50 text-muted-foreground hover:text-foreground"
              >
                {showLabels ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                Labels
              </Button>
              {selectedNode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                  className="gap-1.5 border-border/50 text-muted-foreground hover:text-foreground"
                >
                  Clear Selection
                </Button>
              )}
              {attackPaths.length > 0 && (
                <Button
                  variant={showAttackPaths ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setShowAttackPaths(!showAttackPaths)}
                  className="gap-1.5"
                >
                  {showAttackPaths ? <ZapOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                  {showAttackPaths ? "Hide Attacks" : "Attack Paths"}
                </Button>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-5 mb-5 text-xs text-muted-foreground px-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full shadow-[0_0_10px_#00e5ff80]" style={{ background: "linear-gradient(135deg, #00e5ff, #0097a7)" }} />
              <span>Root Package</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full shadow-[0_0_8px_#38bdf880]" style={{ background: "linear-gradient(135deg, #60a5fa, #2563eb)" }} />
              <span>Direct Dependency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-[0_0_8px_#10b98180]" style={{ background: "linear-gradient(135deg, #34d399, #059669)" }} />
              <span>Expanded Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full shadow-[0_0_8px_#f59e0b80]" style={{ background: "linear-gradient(135deg, #fbbf24, #d97706)" }} />
              <span>Selected</span>
            </div>
            {attackPaths.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 rounded shadow-[0_0_6px_#ef444480]" style={{ background: "#ef4444" }} />
                <span>Attack Path</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Expand className="w-3 h-3" />
              <span>Click to expand</span>
            </div>
          </div>

          {/* Graph Card */}
          <Card className="bg-card/20 backdrop-blur-xl border-border/30 overflow-hidden shadow-[0_0_40px_hsl(var(--primary)/0.05)]">
            <CardContent className="p-3">
              <div className="overflow-x-auto">
                <svg
                  width={width}
                  height={svgHeight}
                  className="mx-auto"
                  style={{ minWidth: width }}
                  onClick={(e) => {
                    if ((e.target as SVGElement).tagName === 'svg') setSelectedNode(null);
                  }}
                >
                  {/* Enhanced SVG Definitions */}
                  <defs>
                    {/* Glow filters */}
                    <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="shadow-soft" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
                    </filter>

                    {/* Root node - Vibrant Cyan/Teal */}
                    <radialGradient id="node-gradient-root" cx="35%" cy="30%">
                      <stop offset="0%" stopColor="#00e5ff" />
                      <stop offset="60%" stopColor="#00bcd4" />
                      <stop offset="100%" stopColor="#0097a7" />
                    </radialGradient>

                    {/* Direct dependency - Electric Blue */}
                    <radialGradient id="node-gradient-dep" cx="35%" cy="30%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="60%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </radialGradient>

                    {/* Expanded child nodes - Emerald Green */}
                    <radialGradient id="node-gradient-expanded" cx="35%" cy="30%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="60%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </radialGradient>

                    {/* Hover - Vivid Purple */}
                    <radialGradient id="node-gradient-hover" cx="35%" cy="30%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="60%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </radialGradient>

                    {/* Selected - Amber/Gold */}
                    <radialGradient id="node-gradient-selected" cx="35%" cy="30%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="60%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </radialGradient>

                    {/* Edge gradients */}
                    <linearGradient id="edge-gradient-default" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.15" />
                    </linearGradient>
                    <linearGradient id="edge-gradient-expanded" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="edge-gradient-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.4" />
                    </linearGradient>

                    {/* Animated dash pattern */}
                    <pattern id="dash-pattern" patternUnits="userSpaceOnUse" width="12" height="1">
                      <line x1="0" y1="0" x2="6" y2="0" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>

                  {/* Background subtle radial */}
                  <circle cx={width / 2} cy={90} r="300" fill="url(#node-gradient-root)" fillOpacity="0.02" />

                  {/* EDGES */}
                  {edges.map((edge, i) => {
                    const source = findNode(edge.source);
                    const target = findNode(edge.target);
                    if (!source || !target) return null;

                    const key = `${edge.source}->${edge.target}`;
                    const isAttack = showAttackPaths && attackEdgeSet.has(key);
                    const isHighlighted = connectedEdges.has(i);
                    const isTargetExpanded = expandedFromSet.has(edge.target);
                    const isDimmed = connectedNodeIds && !connectedNodeIds.has(edge.source) && !connectedNodeIds.has(edge.target);

                    const midY = ((source.y ?? 0) + (target.y ?? 0)) / 2;
                    const dx = (target.x ?? 0) - (source.x ?? 0);
                    const curveOffset = dx * 0.18;
                    const d = `M ${source.x} ${source.y} C ${(source.x ?? 0) + curveOffset} ${midY}, ${(target.x ?? 0) - curveOffset} ${midY}, ${target.x} ${target.y}`;

                    let stroke = "url(#edge-gradient-default)";
                    let strokeWidth = 1;
                    let opacity = 0.35;

                    if (isAttack) {
                      stroke = "#ef4444";
                      strokeWidth = 2.5;
                      opacity = 0.9;
                    } else if (isHighlighted) {
                      stroke = "url(#edge-gradient-highlight)";
                      strokeWidth = 2.5;
                      opacity = 0.9;
                    } else if (isTargetExpanded) {
                      stroke = "url(#edge-gradient-expanded)";
                      strokeWidth = 1.5;
                      opacity = 0.5;
                    }

                    if (isDimmed) opacity = 0.08;

                    return (
                      <motion.path
                        key={i}
                        d={d}
                        fill="none"
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        strokeOpacity={opacity}
                        strokeDasharray={isAttack ? "6 3" : undefined}
                        filter={isAttack ? "url(#glow-red)" : isHighlighted ? "url(#glow-amber)" : undefined}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.008 }}
                      />
                    );
                  })}

                  {/* NODES */}
                  {positionedNodes.map((node, i) => {
                    const isRoot = node.depth === 0 || node.type === "root";
                    const isHovered = hoveredNode === node.id;
                    const isSelected = selectedNode === node.id;
                    const isExpanding = expandingNode === node.id;
                    const isExpanded = expandedFromSet.has(node.id);
                    const isDimmed = connectedNodeIds && !connectedNodeIds.has(node.id);

                    const baseRadius = isRoot ? 24 : isExpanded ? 10 : 12;
                    const radius = isSelected ? baseRadius + 3 : isHovered ? baseRadius + 2 : baseRadius;
                    const glowColor = getNodeGlowColor(node, isHovered, isSelected);

                    return (
                      <motion.g
                        key={node.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: isDimmed ? 0.25 : 1,
                          scale: 1,
                        }}
                        transition={{ delay: i * 0.02, type: "spring", stiffness: 280, damping: 22 }}
                        onClick={(e) => { e.stopPropagation(); expandNode(node.id); }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Outer orbit ring for root */}
                        {isRoot && (
                          <>
                            <motion.circle
                              cx={node.x}
                              cy={node.y}
                              r={radius + 14}
                              fill="none"
                              stroke="#00e5ff"
                              strokeWidth="0.5"
                              strokeOpacity={0.2}
                              strokeDasharray="4 4"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                            />
                            <motion.circle
                              cx={node.x}
                              cy={node.y}
                              r={radius + 8}
                              fill="none"
                              stroke="#00e5ff"
                              strokeWidth="0.8"
                              strokeOpacity={0.15}
                            />
                          </>
                        )}

                        {/* Glow ring on hover/select */}
                        {(isHovered || isSelected) && (
                          <motion.circle
                            cx={node.x}
                            cy={node.y}
                            r={radius + 6}
                            fill="none"
                            stroke={glowColor}
                            strokeWidth="1.5"
                            strokeOpacity={0.5}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            filter={isSelected ? "url(#glow-amber)" : "url(#glow-cyan)"}
                            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                          />
                        )}

                        {/* Expanding pulse rings */}
                        {isExpanding && (
                          <>
                            <motion.circle
                              cx={node.x} cy={node.y} r={radius}
                              fill="none" stroke={glowColor} strokeWidth="2"
                              initial={{ r: radius, opacity: 1 }}
                              animate={{ r: radius + 30, opacity: 0 }}
                              transition={{ duration: 1.2, repeat: Infinity }}
                            />
                            <motion.circle
                              cx={node.x} cy={node.y} r={radius}
                              fill="none" stroke={glowColor} strokeWidth="1.5"
                              initial={{ r: radius, opacity: 0.8 }}
                              animate={{ r: radius + 20, opacity: 0 }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                            />
                          </>
                        )}

                        {/* Main node circle */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius}
                          fill={getNodeGradient(node, isHovered, isSelected)}
                          filter="url(#shadow-soft)"
                          className="transition-all duration-200"
                        />

                        {/* Inner specular highlight */}
                        <ellipse
                          cx={(node.x ?? 0) - radius * 0.15}
                          cy={(node.y ?? 0) - radius * 0.2}
                          rx={radius * 0.4}
                          ry={radius * 0.25}
                          fill="white"
                          fillOpacity={0.2}
                        />

                        {/* Node type icon indicator for root */}
                        {isRoot && (
                          <text
                            x={node.x}
                            y={(node.y ?? 0) + 5}
                            textAnchor="middle"
                            fill="hsl(var(--primary-foreground))"
                            fontSize="14"
                            fontWeight="700"
                            fontFamily="'JetBrains Mono', monospace"
                          >
                            ⬡
                          </text>
                        )}

                        {/* Label */}
                        {showLabels && (
                          <text
                            x={node.x}
                            y={(node.y ?? 0) + radius + 18}
                            textAnchor="middle"
                            fill={
                              isSelected ? "#fbbf24" :
                              isHovered ? "hsl(var(--foreground))" :
                              isExpanded ? "#34d399" :
                              isRoot ? "#00e5ff" :
                              "hsl(var(--muted-foreground))"
                            }
                            fontSize={isRoot ? "12" : "10"}
                            fontWeight={isRoot || isSelected ? "600" : "400"}
                            fontFamily="'JetBrains Mono', monospace"
                            className="transition-all duration-200"
                          >
                            {node.id}
                          </text>
                        )}

                        {/* Depth badge for expanded nodes */}
                        {isExpanded && !isRoot && (
                          <g>
                            <circle
                              cx={(node.x ?? 0) + radius - 2}
                              cy={(node.y ?? 0) - radius + 2}
                              r="6"
                              fill="#059669"
                              stroke="#0d1117"
                              strokeWidth="1.5"
                            />
                            <text
                              x={(node.x ?? 0) + radius - 2}
                              y={(node.y ?? 0) - radius + 5}
                              textAnchor="middle"
                              fill="white"
                              fontSize="7"
                              fontWeight="700"
                              fontFamily="'JetBrains Mono', monospace"
                            >
                              +
                            </text>
                          </g>
                        )}
                      </motion.g>
                    );
                  })}
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Selected Node Info Panel */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4"
              >
                <Card className="bg-card/30 backdrop-blur-xl border-border/30 shadow-[0_0_20px_hsl(var(--primary)/0.08)]">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2.5 rounded-lg shadow-[0_0_12px_#f59e0b40]" style={{ background: "linear-gradient(135deg, #fbbf24, #d97706)" }}>
                      <GitBranch className="w-5 h-5 text-background" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold font-mono" style={{ color: "#fbbf24" }}>{selectedNode}</p>
                      <p className="text-xs text-muted-foreground">
                        {edges.filter(e => e.source === selectedNode).length} dependencies ·
                        {edges.filter(e => e.target === selectedNode).length} dependents ·
                        {expandedFromSet.has(selectedNode) ? " Expanded child" : findNode(selectedNode)?.type === "root" ? " Root package" : " Direct dependency"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedNode(null)}
                      className="text-muted-foreground"
                    >
                      Dismiss
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            <Card className="bg-card/25 backdrop-blur-sm border-border/30">
              <CardContent className="p-3.5 flex items-center gap-3">
                <div className="p-2 rounded-lg shadow-[0_0_10px_#00e5ff30]" style={{ background: "linear-gradient(135deg, #00e5ff20, #0097a720)" }}>
                  <Network className="w-4 h-4" style={{ color: "#00e5ff" }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Packages</p>
                  <p className="text-lg font-bold font-mono text-foreground">{nodes.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/25 backdrop-blur-sm border-border/30">
              <CardContent className="p-3.5 flex items-center gap-3">
                <div className="p-2 rounded-lg shadow-[0_0_10px_#3b82f630]" style={{ background: "linear-gradient(135deg, #3b82f620, #2563eb20)" }}>
                  <Layers className="w-4 h-4" style={{ color: "#60a5fa" }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Connections</p>
                  <p className="text-lg font-bold font-mono text-foreground">{edges.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/25 backdrop-blur-sm border-border/30">
              <CardContent className="p-3.5 flex items-center gap-3">
                <div className="p-2 rounded-lg shadow-[0_0_10px_#10b98130]" style={{ background: "linear-gradient(135deg, #10b98120, #05966920)" }}>
                  <Expand className="w-4 h-4" style={{ color: "#34d399" }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Expanded</p>
                  <p className="text-lg font-bold font-mono text-foreground">{expandedFromSet.size}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card/25 backdrop-blur-sm border-border/30">
              <CardContent className="p-3.5 flex items-center gap-3">
                <div className="p-2 rounded-lg shadow-[0_0_10px_#ef444430]" style={{ background: "linear-gradient(135deg, #ef444420, #dc262620)" }}>
                  <Shield className="w-4 h-4" style={{ color: "#f87171" }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Attack Paths</p>
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
