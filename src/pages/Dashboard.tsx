import { motion } from "framer-motion";
import { Shield, Package, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import cyberBgVideo from "@/assets/cyber-bg-video.mp4";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const score = 72;
const getScoreColor = (s: number) => s >= 80 ? "hsl(145 80% 50%)" : s >= 60 ? "hsl(45 100% 55%)" : s >= 40 ? "hsl(20 85% 50%)" : "hsl(0 85% 55%)";
const scoreColor = getScoreColor(score);

const stats = [
  { label: "Total Dependencies", value: 47, icon: Package, color: "text-primary" },
  { label: "Safe Packages", value: 38, icon: CheckCircle, color: "text-neon-green" },
  { label: "Vulnerable", value: 5, icon: AlertTriangle, color: "text-neon-yellow" },
  { label: "High Risk", value: 4, icon: XCircle, color: "text-neon-red" },
];

const pieData = [
  { name: "Safe", value: 38, color: "hsl(145 80% 50%)" },
  { name: "Low Risk", value: 5, color: "hsl(45 100% 55%)" },
  { name: "Medium", value: 3, color: "hsl(20 85% 50%)" },
  { name: "Critical", value: 1, color: "hsl(0 85% 55%)" },
];

const severityData = [
  { name: "Critical", count: 1, fill: "hsl(0 85% 55%)" },
  { name: "High", count: 3, fill: "hsl(20 85% 50%)" },
  { name: "Medium", count: 5, fill: "hsl(45 100% 55%)" },
  { name: "Low", count: 2, fill: "hsl(195 100% 50%)" },
];

const Dashboard = () => {
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={cyberBgVideo}
      />
      <div className="absolute inset-0 bg-background/80 z-[1]" />
      <div className="absolute inset-0 cyber-grid z-[2]" />
      <div className="container relative z-[3]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-1">Security Score Dashboard</h1>
          <p className="text-muted-foreground text-sm mb-8">Project analysis results for <span className="text-primary font-mono">my-web-app</span></p>

          {/* Score gauge + Stats */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Gauge */}
            <Card className="lg:col-span-1 bg-card/50 border-border/50">
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(222 30% 12%)" strokeWidth="12" />
                    <motion.circle
                      cx="100" cy="100" r="80" fill="none"
                      stroke={scoreColor}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: offset }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ filter: `drop-shadow(0 0 8px ${scoreColor})` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black font-mono" style={{ color: scoreColor }}>{score}</span>
                    <span className="text-xs text-muted-foreground mt-1">/ 100</span>
                  </div>
                </div>
                <Badge className="mt-4 bg-neon-yellow/10 text-neon-yellow border-neon-yellow/30">
                  Moderate Risk
                </Badge>
              </CardContent>
            </Card>

            {/* Stat cards */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <Card className="bg-card/50 border-border/50 hover:border-primary/20 transition-colors">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center">
                        <s.icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-mono">{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Dependency Health</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" strokeWidth={0}>
                      {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-4 mt-2">
                  {pieData.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Vulnerability Severity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={severityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 25% 16%)" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 50%)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(215 20% 50%)", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "hsl(222 44% 8%)", border: "1px solid hsl(222 25% 16%)", borderRadius: 8, color: "hsl(210 40% 93%)" }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {severityData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
