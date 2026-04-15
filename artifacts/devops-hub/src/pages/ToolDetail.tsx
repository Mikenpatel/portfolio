import React, { useState } from "react";
import { useParams } from "wouter";
import { TOOLS } from "../data/tools";
import NotFound from "./not-found";
import { getIconForTool } from "../components/Sidebar";
import { StatusBadge } from "../components/StatusBadge";
import { CodeBlock } from "../components/CodeBlock";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Terminal, Clock, Box, Activity, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ToolDetail() {
  const { toolId } = useParams();
  const tool = TOOLS.find(t => t.id === toolId);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGuide, setExpandedGuide] = useState<number | null>(0);

  if (!tool) return <NotFound />;

  const filteredGuides = tool.guides.filter(
    g => g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         g.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-start justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl text-primary">
            {getIconForTool(tool.iconName, "w-10 h-10")}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
              <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                {tool.category}
              </span>
            </div>
            <p className="text-muted-foreground text-lg">{tool.description}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Guides Section */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                How-to Guides
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredGuides.length > 0 ? (
                filteredGuides.map((guide, idx) => (
                  <div key={idx} className="border border-border rounded-lg bg-card overflow-hidden">
                    <button
                      onClick={() => setExpandedGuide(expandedGuide === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors"
                    >
                      <span className="font-medium">{guide.title}</span>
                      <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedGuide === idx && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {expandedGuide === idx && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 border-t border-border/50">
                            <p className="text-sm text-muted-foreground mb-4 mt-4">{guide.content}</p>
                            {guide.codeSnippet && (
                              <CodeBlock code={guide.codeSnippet} language={guide.language} />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-lg">
                  No guides found matching "{searchQuery}"
                </div>
              )}
            </div>
          </motion.section>

        </div>

        <div className="space-y-6">
          {/* Instances */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-xl border border-border bg-card"
          >
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Box className="w-4 h-4 text-primary" />
              Instances
            </h3>
            <div className="space-y-3">
              {tool.instances.map((inst, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 bg-accent/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{inst.name}</span>
                    <StatusBadge status={inst.status} />
                  </div>
                  <a href={`https://${inst.url}`} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors">
                    {inst.url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Metrics */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-xl border border-border bg-card"
          >
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-primary" />
              Metrics
            </h3>
            <div className="space-y-4">
              {tool.metrics.map((metric, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-foreground mb-1">{metric.count}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info bits */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-5 rounded-xl border border-border bg-card text-sm"
          >
            {tool.techTypes && tool.techTypes.length > 0 && (
              <div className="mb-4">
                <span className="font-medium block mb-2">Supported Tech</span>
                <div className="flex flex-wrap gap-1.5">
                  {tool.techTypes.map(t => (
                    <span key={t} className="px-2 py-1 bg-accent/50 text-muted-foreground rounded text-xs">{t}</span>
                  ))}
                </div>
              </div>
            )}
            
            {tool.features && tool.features.length > 0 && (
              <div className="mb-4">
                <span className="font-medium block mb-2">Key Features</span>
                <ul className="list-disc list-inside text-muted-foreground pl-4 space-y-1">
                  {tool.features.map(f => <li key={f}>{f}</li>)}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-border flex items-center gap-2 text-muted-foreground text-xs">
              <Clock className="w-3.5 h-3.5" />
              Last updated: {tool.lastUpdated}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
