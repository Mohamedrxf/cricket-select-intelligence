import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import cyberBgVideo from "@/assets/cyber-bg-video.mp4";

const vulns = [
  { cve: "CVE-2024-48999", pkg: "lodash@4.17.20", severity: "Critical", score: 9.8, desc: "Prototype Pollution in lodash allows remote attackers to manipulate object prototypes.", fix: "Upgrade to lodash@4.17.21" },
  { cve: "CVE-2024-33883", pkg: "qs@6.11.0", severity: "High", score: 7.5, desc: "Query string parsing vulnerability allows denial of service via crafted input.", fix: "Upgrade to qs@6.12.0" },
  { cve: "CVE-2024-29041", pkg: "express@4.18.2", severity: "Medium", score: 5.3, desc: "Open redirect vulnerability in express allows URL manipulation.", fix: "Upgrade to express@4.19.2" },
  { cve: "CVE-2024-21538", pkg: "cross-spawn@7.0.3", severity: "High", score: 7.8, desc: "Command injection vulnerability in cross-spawn on Windows.", fix: "Upgrade to cross-spawn@7.0.5" },
  { cve: "CVE-2024-28849", pkg: "follow-redirects@1.15.4", severity: "Medium", score: 6.5, desc: "Authorization header leak on cross-origin redirect.", fix: "Upgrade to follow-redirects@1.15.6" },
];

const severityColor: Record<string, string> = {
  Critical: "bg-neon-red/10 text-neon-red border-neon-red/30",
  High: "bg-neon-yellow/10 text-neon-yellow border-neon-yellow/30",
  Medium: "bg-primary/10 text-primary border-primary/30",
  Low: "bg-neon-green/10 text-neon-green border-neon-green/30",
};

const Vulnerabilities = () => (
  <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" src={cyberBgVideo} />
    <div className="absolute inset-0 bg-background/80 z-[1]" />
    <div className="absolute inset-0 cyber-grid z-[2]" />
    <div className="container relative z-[3]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <ShieldAlert className="w-6 h-6 text-neon-red" />
          <h1 className="text-2xl font-bold">Vulnerability Insights</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Detected {vulns.length} vulnerabilities across your dependency tree.</p>

        <div className="space-y-4">
          {vulns.map((v, i) => (
            <motion.div key={v.cve} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-card/50 border-border/50 hover:border-primary/20 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-sm font-mono text-primary">{v.cve}</code>
                        <Badge className={`${severityColor[v.severity]} text-xs`}>{v.severity}</Badge>
                        <span className="text-xs font-mono text-muted-foreground">CVSS {v.score}</span>
                      </div>
                      <p className="text-sm font-medium mb-1">
                        <span className="text-neon-yellow font-mono">{v.pkg}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">{v.desc}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-neon-green" />
                        <span className="text-neon-green font-medium">Fix:</span>
                        <code className="text-foreground font-mono bg-muted px-2 py-0.5 rounded">{v.fix}</code>
                      </div>
                    </div>
                    <a href={`https://nvd.nist.gov/vuln/detail/${v.cve}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export default Vulnerabilities;
