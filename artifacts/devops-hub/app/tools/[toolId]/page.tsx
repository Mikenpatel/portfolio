"use client";

import { useState, use } from "react";
import { TOOLS } from "@/data/tools";
import { getIconForTool } from "@/components/Sidebar";
import { StatusBadge } from "@/components/StatusBadge";
import { CodeBlock } from "@/components/CodeBlock";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Terminal,
  Clock,
  Box,
  Activity,
  ExternalLink,
  ShieldCheck,
  Database,
  Gauge,
  BarChart3,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ToolDetailPage({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const { toolId } = use(params);
  const tool = TOOLS.find((t) => t.id === toolId);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGuide, setExpandedGuide] = useState<number | null>(0);

  if (!tool) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-2">Tool not found</h2>
        <p className="text-muted-foreground mb-6">
          The tool you are looking for does not exist.
        </p>
        <Link href="/" className="text-primary hover:underline text-sm font-medium">
          Back to overview
        </Link>
      </div>
    );
  }

  const filteredGuides = tool.guides.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
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
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Service Catalog */}
          {tool.serviceCatalog && tool.serviceCatalog.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                Service Catalog
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tool.serviceCatalog.map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-accent/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{item.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </a>
                ))}
              </div>
            </motion.section>
          )}

          {/* How-to Guides */}
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
                  className="pl-9 pr-4 py-1.5 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-56"
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
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          expandedGuide === idx && "rotate-180"
                        )}
                      />
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
                            <p className="text-sm text-muted-foreground mb-4 mt-4">
                              {guide.content}
                            </p>
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
                  No guides found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </motion.section>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Availability */}
          {tool.availability && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Availability
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall uptime</span>
                  <span className="font-semibold text-green-500">{tool.availability.uptime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last 30 days</span>
                  <span className="font-semibold text-green-500">{tool.availability.last30Days}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SLA target</span>
                  <span className="font-medium">{tool.availability.sla}</span>
                </div>
                <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                  Last incident: {tool.availability.lastIncident}
                </div>
              </div>
            </motion.div>
          )}

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
                  <a
                    href={`https://${inst.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    {inst.url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance */}
          {tool.performance && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Gauge className="w-4 h-4 text-primary" />
                Performance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg response</span>
                  <span className="font-medium">{tool.performance.avgResponseTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">p99 response</span>
                  <span className="font-medium">{tool.performance.p99ResponseTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Throughput</span>
                  <span className="font-medium">{tool.performance.throughput}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cache hit ratio</span>
                  <span className="font-semibold text-green-500">{tool.performance.cacheHitRatio}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Usage */}
          {tool.usage && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-primary" />
                Usage
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-medium">{tool.usage.storageUsed} / {tool.usage.storageTotal}</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${tool.usage.storagePercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{tool.usage.storagePercent}% used</div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active users</span>
                  <span className="font-medium">{tool.usage.activeUsers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Downloads (month)</span>
                  <span className="font-medium">{tool.usage.downloadsThisMonth.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uploads (month)</span>
                  <span className="font-medium">{tool.usage.uploadsThisMonth.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Repository Stats */}
          {tool.repositories && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="p-5 rounded-xl border border-border bg-card"
            >
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Database className="w-4 h-4 text-primary" />
                Repositories
              </h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-accent/30 rounded-lg">
                  <div className="text-lg font-bold">{tool.repositories.local}</div>
                  <div className="text-xs text-muted-foreground">Local</div>
                </div>
                <div className="text-center p-2 bg-accent/30 rounded-lg">
                  <div className="text-lg font-bold">{tool.repositories.remote}</div>
                  <div className="text-xs text-muted-foreground">Remote</div>
                </div>
                <div className="text-center p-2 bg-accent/30 rounded-lg">
                  <div className="text-lg font-bold">{tool.repositories.virtual}</div>
                  <div className="text-xs text-muted-foreground">Virtual</div>
                </div>
              </div>
              <div className="space-y-2">
                {tool.repositories.byType.map((r) => (
                  <div key={r.type} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{r.type}</span>
                    <span className="font-medium">{r.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
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

          {/* Tech types / Features */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="p-5 rounded-xl border border-border bg-card text-sm"
          >
            {tool.techTypes && tool.techTypes.length > 0 && (
              <div className="mb-4">
                <span className="font-medium block mb-2">Supported Tech</span>
                <div className="flex flex-wrap gap-1.5">
                  {tool.techTypes.map((t) => (
                    <span key={t} className="px-2 py-1 bg-accent/50 text-muted-foreground rounded text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {tool.features && tool.features.length > 0 && (
              <div className="mb-4">
                <span className="font-medium block mb-2">Key Features</span>
                <ul className="list-disc list-inside text-muted-foreground pl-4 space-y-1">
                  {tool.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
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
