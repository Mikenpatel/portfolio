import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { TOOLS, CATEGORIES } from "../data/tools";
import { SiJfrog, SiBitbucket, SiJenkins, SiArgo, SiJetbrains } from "react-icons/si";
import { Shield as SiShield, Server as SiServerless, Layers, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const getIconForTool = (iconName: string, className?: string) => {
  const props = { className: cn("w-4 h-4", className) };
  switch (iconName) {
    case "SiJfrog": return <SiJfrog {...props} />;
    case "SiBitbucket": return <SiBitbucket {...props} />;
    case "SiJenkins": return <SiJenkins {...props} />;
    case "SiArgo": return <SiArgo {...props} />;
    case "SiJetbrains": return <SiJetbrains {...props} />;
    case "SiShield": return <SiShield {...props} />;
    case "SiServerless": return <SiServerless {...props} />;
    default: return <Layers {...props} />;
  }
};

export function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "border-r border-border bg-card flex flex-col h-full overflow-y-auto transition-all duration-300 relative",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-border sticky top-0 bg-card z-10 flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 text-primary font-semibold tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap overflow-hidden">
            <div className="bg-primary/10 p-1.5 rounded-md shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span>DevOps Hub</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto block text-primary hover:opacity-80">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <LayoutGrid className="w-5 h-5" />
            </div>
          </Link>
        )}
      </div>
      
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 -right-3 z-20 bg-border text-muted-foreground hover:text-foreground rounded-full p-1"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      <div className="flex-1 py-4 overflow-x-hidden">
        {CATEGORIES.map(category => {
          const categoryTools = TOOLS.filter(t => t.category === category);
          return (
            <div key={category} className="mb-6 px-3">
              {!collapsed ? (
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 whitespace-nowrap overflow-hidden">
                  {category}
                </h4>
              ) : (
                <div className="h-px bg-border/50 my-4 mx-2" />
              )}
              <div className="space-y-0.5">
                {categoryTools.map(tool => {
                  const isActive = location === `/tools/${tool.id}`;
                  return (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      title={collapsed ? tool.name : undefined}
                      className={cn(
                        "flex items-center gap-3 px-2 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap overflow-hidden",
                        isActive 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                        collapsed && "justify-center"
                      )}
                    >
                      <div className="shrink-0">{getIconForTool(tool.iconName)}</div>
                      {!collapsed && <span>{tool.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
