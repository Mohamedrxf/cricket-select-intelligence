import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Search, FileJson, Loader2, CheckCircle, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import cyberBgVideo from "@/assets/cyber-bg-video.mp4";

const Scan = () => {
  const [packageName, setPackageName] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState("");
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();

  const phases = [
    "Resolving dependency tree...",
    "Analyzing package metadata...",
    "Checking CVE databases...",
    "Scanning for malicious patterns...",
    "Calculating security scores...",
    "Generating report...",
  ];

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    setComplete(false);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const p = Math.min((step / phases.length) * 100, 100);
      setProgress(p);
      setScanPhase(phases[Math.min(step - 1, phases.length - 1)]);
      if (step >= phases.length) {
        clearInterval(interval);
        setTimeout(() => {
          setScanning(false);
          setComplete(true);
        }, 500);
      }
    }, 800);
  };

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
      <div className="container max-w-3xl relative z-[3]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Scan Your Project</h1>
            <p className="text-muted-foreground">Upload a manifest file or search a package to begin analysis.</p>
          </div>

          {/* Upload area */}
          <Card className="mb-6 border-dashed border-2 border-border hover:border-primary/40 transition-colors bg-card/50">
            <CardContent className="p-10 text-center">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop <span className="text-primary font-mono">package.json</span>, <span className="text-primary font-mono">requirements.txt</span>, or <span className="text-primary font-mono">go.mod</span>
              </p>
              <p className="text-xs text-muted-foreground">or click to browse</p>
            </CardContent>
          </Card>

          {/* Package search */}
          <Card className="mb-6 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileJson className="w-4 h-4 text-primary" />
                Analyze a Package
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g., lodash, express, requests..."
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="bg-background/50"
                />
                <Button onClick={startScan} disabled={scanning} className="gap-2 glow-blue px-6">
                  {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Scan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scanning progress */}
          <AnimatePresence>
            {scanning && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="bg-card/50 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <Shield className="w-6 h-6 text-primary" />
                        <div className="absolute inset-0 animate-ping">
                          <Shield className="w-6 h-6 text-primary/30" />
                        </div>
                      </div>
                      <span className="font-medium text-primary">Scanning in progress...</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{scanPhase}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Complete */}
          <AnimatePresence>
            {complete && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="bg-card/50 border-neon-green/30 glow-green">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-10 h-10 text-neon-green mx-auto mb-3" />
                    <h3 className="font-semibold text-lg mb-1">Scan Complete!</h3>
                    <p className="text-sm text-muted-foreground mb-4">Found 47 dependencies • 5 vulnerabilities detected</p>
                    <Button onClick={() => navigate("/dashboard")} className="gap-2 glow-blue">
                      View Results <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Scan;
