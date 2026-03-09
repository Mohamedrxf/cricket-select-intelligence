import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  risk: "safe" | "low" | "medium" | "high" | "critical";
  deps: string[];
}

const riskColors: Record<string, string> = {
  safe: "hsl(145 80% 50%)",
  low: "hsl(195 100% 50%)",
  medium: "hsl(45 100% 55%)",
  high: "hsl(20 85% 50%)",
  critical: "hsl(0 85% 55%)",
};

const nodes: Node[] = [
  { id: "root", label: "my-web-app", x: 400, y: 50, risk: "safe", deps: ["react", "express", "lodash"] },
  { id: "react", label: "react@18.2.0", x: 150, y: 170, risk: "safe", deps: ["react-dom"] },
  { id: "express", label: "express@4.18.2", x: 400, y: 170, risk: "medium", deps: ["body-parser", "qs"] },
  { id: "lodash", label: "lodash@4.17.20", x: 650, y: 170, risk: "critical", deps: [] },
  { id: "react-dom", label: "react-dom@18.2.0", x: 80, y: 300, risk: "safe", deps: [] },
  { id: "body-parser", label: "body-parser@1.20.1", x: 300, y: 300, risk: "low", deps: [] },
  { id: "qs", label: "qs@6.11.0", x: 500, y: 300, risk: "high", deps: [] },
];

const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

const DependencyGraph = () => (
  <div className="min-h-screen pt-24 pb-12 cyber-grid">
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Dependency Graph</h1>
        <p className="text-muted-foreground text-sm mb-8">Interactive visualization of your dependency tree with risk indicators.</p>

        <Card className="bg-card/30 border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <svg width="100%" viewBox="0 0 800 400" className="bg-background/50">
              {/* Connections */}
              {nodes.map((node) =>
                node.deps.map((depId) => {
                  const dep = nodeMap[depId];
                  if (!dep) return null;
                  return (
                    <motion.line
                      key={`${node.id}-${depId}`}
                      x1={node.x} y1={node.y + 20}
                      x2={dep.x} y2={dep.y - 5}
                      stroke={riskColors[dep.risk]}
                      strokeWidth={1.5}
                      strokeOpacity={0.3}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  );
                })
              )}
              {/* Nodes */}
              {nodes.map((node, i) => (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15, type: "spring" }}
                >
                  {/* Glow */}
                  {(node.risk === "critical" || node.risk === "high") && (
                    <circle cx={node.x} cy={node.y} r={25} fill={riskColors[node.risk]} fillOpacity={0.1}>
                      <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="fill-opacity" values="0.1;0.05;0.1" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={node.x} cy={node.y} r={node.id === "root" ? 18 : 14}
                    fill={riskColors[node.risk]}
                    fillOpacity={0.15}
                    stroke={riskColors[node.risk]}
                    strokeWidth={2}
                  />
                  <circle cx={node.x} cy={node.y} r={4} fill={riskColors[node.risk]} />
                  <text
                    x={node.x} y={node.y + (node.id === "root" ? 32 : 28)}
                    textAnchor="middle"
                    fill="hsl(210 40% 93%)"
                    fontSize={10}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {node.label}
                  </text>
                </motion.g>
              ))}
            </svg>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {Object.entries(riskColors).map(([level, color]) => (
            <div key={level} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: color, background: `${color}20` }} />
              <span className="text-muted-foreground capitalize">{level}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default DependencyGraph;
