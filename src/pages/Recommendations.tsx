import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Shield, TrendingUp, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const recommendations = [
  {
    current: { name: "lodash@4.17.20", score: 28, issues: 3 },
    suggested: { name: "lodash@4.17.21", score: 95, issues: 0 },
    reason: "Patches critical Prototype Pollution vulnerability",
    action: "npm install lodash@4.17.21",
  },
  {
    current: { name: "qs@6.11.0", score: 45, issues: 1 },
    suggested: { name: "qs@6.12.0", score: 92, issues: 0 },
    reason: "Fixes DoS vulnerability in query parsing",
    action: "npm install qs@6.12.0",
  },
  {
    current: { name: "express@4.18.2", score: 62, issues: 1 },
    suggested: { name: "express@4.19.2", score: 98, issues: 0 },
    reason: "Resolves open redirect vulnerability",
    action: "npm install express@4.19.2",
  },
  {
    current: { name: "cross-spawn@7.0.3", score: 40, issues: 1 },
    suggested: { name: "cross-spawn@7.0.5", score: 96, issues: 0 },
    reason: "Patches command injection on Windows",
    action: "npm install cross-spawn@7.0.5",
  },
];

const getScoreBg = (s: number) =>
  s >= 80 ? "bg-neon-green/10 text-neon-green border-neon-green/30"
    : s >= 50 ? "bg-neon-yellow/10 text-neon-yellow border-neon-yellow/30"
    : "bg-neon-red/10 text-neon-red border-neon-red/30";

const Recommendations = () => (
  <div className="min-h-screen pt-24 pb-12 cyber-grid">
    <div className="container max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <TrendingUp className="w-6 h-6 text-neon-green" />
          <h1 className="text-2xl font-bold">Recommendations</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">AI-suggested safer alternatives for your vulnerable dependencies.</p>

        <div className="space-y-4">
          {recommendations.map((r, i) => (
            <motion.div key={r.current.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-card/50 border-border/50 hover:border-primary/20 transition-all">
                <CardContent className="p-5">
                  <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                    {/* Current */}
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-neon-red flex-shrink-0" />
                      <div>
                        <code className="text-sm font-mono text-neon-red">{r.current.name}</code>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-[10px] ${getScoreBg(r.current.score)}`}>Score: {r.current.score}</Badge>
                          <span className="text-xs text-muted-foreground">{r.current.issues} issue{r.current.issues > 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-5 h-5 text-primary mx-auto hidden md:block" />

                    {/* Suggested */}
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0" />
                      <div>
                        <code className="text-sm font-mono text-neon-green">{r.suggested.name}</code>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-[10px] ${getScoreBg(r.suggested.score)}`}>Score: {r.suggested.score}</Badge>
                          <span className="text-xs text-neon-green">No issues</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{r.reason}</p>
                    <code className="text-[11px] font-mono bg-muted px-3 py-1 rounded text-primary">{r.action}</code>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Apply all */}
        <div className="mt-8 text-center">
          <Button className="glow-blue gap-2 px-8 h-11">
            <Shield className="w-4 h-4" />
            Apply All Fixes
          </Button>
          <p className="text-xs text-muted-foreground mt-3">Estimated score improvement: 72 → 94</p>
        </div>
      </motion.div>
    </div>
  </div>
);

export default Recommendations;
