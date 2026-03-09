import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Scan, Network, Bot, Lock, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import cyberBgVideo from "@/assets/cyber-bg-video.mp4";

/* Animated dependency network node */
const NetworkNode = ({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) => (
  <motion.div
    className="absolute rounded-full border"
    style={{ left: x, top: y, width: size, height: size, borderColor: color, background: `${color}15` }}
    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 3, repeat: Infinity, delay }}
  />
);

/* Animated connection line */
const ConnectionLine = ({ x1, y1, x2, y2, delay }: { x1: string; y1: string; x2: string; y2: string; delay: number }) => (
  <motion.div
    className="absolute h-px bg-gradient-to-r from-primary/40 to-accent/40"
    style={{
      left: x1, top: y1,
      width: `calc(${x2} - ${x1})`,
      transformOrigin: "left",
    }}
    animate={{ opacity: [0.2, 0.6, 0.2] }}
    transition={{ duration: 2.5, repeat: Infinity, delay }}
  />
);

const Landing = () => {
  const features = [
    { icon: Scan, title: "Deep Dependency Scanning", desc: "Analyze package.json, requirements.txt, and more. Detect vulnerabilities in every layer of your supply chain." },
    { icon: Shield, title: "Security Score (0–100)", desc: "Get a comprehensive security score for your project based on vulnerability severity, dependency health, and risk factors." },
    { icon: Network, title: "Dependency Graph", desc: "Visualize your entire dependency tree with risk-coded nodes. See exactly where vulnerabilities hide." },
    { icon: Bot, title: "AI Security Copilot", desc: "Ask questions about risky packages, get safer alternatives, and understand CVEs in plain English." },
    { icon: Eye, title: "CVE Intelligence", desc: "Real-time vulnerability insights with CVE IDs, severity levels, affected versions, and suggested fixes." },
    { icon: Lock, title: "Supply Chain Protection", desc: "Detect malicious packages, typosquatting, and dependency confusion attacks before they hit production." },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-grid">
        {/* Ambient glows */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, hsl(195 100% 50% / 0.15), transparent)" }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, hsl(265 80% 60% / 0.12), transparent)" }}
          animate={{ opacity: [0.4, 0.2, 0.4], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />

        {/* Network illustration - floating nodes */}
        <div className="absolute inset-0 pointer-events-none">
          <NetworkNode x="15%" y="20%" size={12} delay={0} color="hsl(195 100% 50%)" />
          <NetworkNode x="25%" y="35%" size={8} delay={0.5} color="hsl(145 80% 50%)" />
          <NetworkNode x="10%" y="55%" size={10} delay={1} color="hsl(195 100% 50%)" />
          <NetworkNode x="75%" y="25%" size={14} delay={0.3} color="hsl(0 85% 55%)" />
          <NetworkNode x="80%" y="45%" size={8} delay={0.8} color="hsl(265 80% 60%)" />
          <NetworkNode x="85%" y="65%" size={10} delay={1.2} color="hsl(145 80% 50%)" />
          <NetworkNode x="70%" y="70%" size={6} delay={0.6} color="hsl(45 100% 55%)" />
          <NetworkNode x="20%" y="70%" size={8} delay={1.5} color="hsl(195 100% 50%)" />
          <NetworkNode x="60%" y="15%" size={10} delay={0.9} color="hsl(195 100% 50%)" />
          <NetworkNode x="40%" y="80%" size={6} delay={1.8} color="hsl(265 80% 60%)" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-xs font-medium text-primary">AI-Powered Supply Chain Security</span>
            </motion.div>

            {/* Shield icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mx-auto mb-8 relative"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-blue">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl animate-ping bg-primary/5" />
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4">
              <span className="text-foreground">OS</span>
              <span className="text-primary">³</span>
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-foreground/80 mb-2">
              Open Source Security Score
            </p>
            <p className="text-lg md:text-xl text-primary font-medium mb-6">
              AI Copilot for Dependency Security
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Scan your open-source dependencies, detect vulnerabilities and malicious packages,
              and get AI-powered recommendations — all in one platform built for DevSecOps teams.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2 glow-blue text-base px-8 h-12">
                <Link to="/scan">
                  <Scan className="w-4 h-4" />
                  Scan Project
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 border-accent/40 text-accent hover:bg-accent/10 text-base px-8 h-12">
                <Link to="/dashboard">
                  Try Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-8 mt-16 text-sm"
            >
              {[
                { val: "50K+", label: "Packages Scanned" },
                { val: "12K+", label: "CVEs Detected" },
                { val: "99.2%", label: "Accuracy" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <span className="font-mono text-2xl font-bold text-primary">{s.val}</span>
                  <span className="text-muted-foreground text-xs">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-primary mb-3 font-semibold">Platform Features</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Security Intelligence</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to secure your open-source supply chain, from scanning to remediation.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-xl border border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card transition-all"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:glow-blue transition-all">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <Zap className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Dependencies?</h2>
            <p className="text-muted-foreground mb-8">Start scanning your project in seconds. No setup required.</p>
            <Button asChild size="lg" className="glow-blue px-8 h-12">
              <Link to="/scan">
                Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">OS³ — Open Source Security Score</span>
          </div>
          <p className="text-xs text-muted-foreground">Securing the open-source supply chain.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
