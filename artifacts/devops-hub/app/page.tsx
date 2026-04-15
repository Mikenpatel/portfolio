"use client";

import Link from "next/link";
import { TOOLS } from "@/data/tools";
import { StatusBadge } from "@/components/StatusBadge";
import { getIconForTool } from "@/components/Sidebar";
import { motion } from "framer-motion";
import { Activity, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Home() {
  const totalIncidents = TOOLS.reduce(
    (acc, t) =>
      acc +
      t.metrics
        .filter((m) => m.label.toLowerCase().includes("incident"))
        .reduce((sum, m) => sum + m.count, 0),
    0
  );

  const totalRITMs = TOOLS.reduce(
    (acc, t) =>
      acc +
      t.metrics
        .filter((m) => m.label.toLowerCase().includes("ritm"))
        .reduce((sum, m) => sum + m.count, 0),
    0
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Systems Overview
        </h1>
        <p className="text-muted-foreground">
          Monitor and manage internal DevOps infrastructure and tools.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-border bg-card/50 flex flex-col">
          <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            System Status
          </span>
          <span className="text-2xl font-bold">All Operational</span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/50 flex flex-col">
          <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            Active Incidents
          </span>
          <span className="text-2xl font-bold">{totalIncidents}</span>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/50 flex flex-col">
          <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            Open RITMs
          </span>
          <span className="text-2xl font-bold">{totalRITMs}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {TOOLS.map((tool, i) => (
          <motion.div
            key={tool.id}
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
          >
            <Link
              href={`/tools/${tool.id}`}
              className="block h-full p-5 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all hover:border-primary/50 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:scale-110 transition-transform">
                    {getIconForTool(tool.iconName, "w-6 h-6")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground">{tool.category}</p>
                  </div>
                </div>
                <StatusBadge status={tool.instances[0]?.status || "Operational"} />
              </div>

              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                {tool.description}
              </p>

              <div className="flex items-center justify-between text-xs pt-4 border-t border-border">
                <span className="text-muted-foreground">
                  {tool.instances.length} Instance{tool.instances.length !== 1 && "s"}
                </span>
                <span className="font-medium text-primary flex items-center gap-1">
                  View details &rarr;
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
