import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Target, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import cricketStadiumVideo from "@/assets/cricket-stadium-video.mp4";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={cricketStadiumVideo} type="video/mp4" />
          </video>
        </div>
        
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-background/60" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        
        {/* Animated accent glow - mimics stadium lights */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-primary/8 rounded-full blur-3xl"
          animate={{ 
            opacity: [0.4, 0.2, 0.4],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Selection Intelligence Platform</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">
              <span className="text-foreground">Cricket scouting,</span>
              <br />
              <span className="text-primary">made defensible.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              PULSE evaluates domestic cricketers through pressure-aware, opposition-adjusted metrics.
              Built for selectors who need to explain their decisions, not just make them.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2 glow-primary">
                <Link to="/explore">
                  Explore Players
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/intelligence">
                  View Methodology
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 border-t border-border">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-xs uppercase tracking-widest text-primary mb-4">Philosophy</p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-16">
              Not another stats dashboard.
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: "Context over aggregates",
                  description: "Raw runs and wickets tell incomplete stories. We evaluate performance within the context of match situations, opposition strength, and pressure moments.",
                },
                {
                  icon: Shield,
                  title: "Pressure handling",
                  description: "How does a batter perform when the team is 80/4? How does a bowler respond in death overs? Pressure-indexed scoring surfaces hidden value.",
                },
                {
                  icon: Scale,
                  title: "Explainable intelligence",
                  description: "Every score can be traced back to contributing factors. No black-box ML. Selections can be justified in any committee room.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Data Source Section */}
      <section className="py-24 border-t border-border bg-card/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-widest text-primary mb-4">Data Foundation</p>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Built on real domestic match data
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              PULSE currently ingests ball-by-ball data from domestic tournaments including Ranji Trophy, 
              Vijay Hazare, and SMAT. Our models are trained on match-specific context, 
              not aggregated career statistics.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex flex-col items-center">
                <span className="font-mono text-2xl text-foreground">14</span>
                <span>Players indexed</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex flex-col items-center">
                <span className="font-mono text-2xl text-foreground">2</span>
                <span>State teams</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex flex-col items-center">
                <span className="font-mono text-2xl text-foreground">4</span>
                <span>Scoring dimensions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="font-mono text-sm font-bold text-primary-foreground">P</span>
              </div>
              <span className="text-sm text-muted-foreground">
                PULSE — Selection Intelligence
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Built for selectors, not spectators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
