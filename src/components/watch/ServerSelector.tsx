import React from "react"
import { Server, Zap, ShieldCheck, Activity } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface ServerOption {
  id: string
  name: string
  type: "fast" | "stable" | "hd" | "normal"
}

interface ServerSelectorProps {
  servers: ServerOption[]
  activeServerId: string
  onSelect: (id: string) => void
}

export function ServerSelector({ servers, activeServerId, onSelect }: ServerSelectorProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "fast": return <Zap className="w-4 h-4 text-warning" />
      case "stable": return <ShieldCheck className="w-4 h-4 text-success" />
      case "hd": return <MonitorPlay className="w-4 h-4 text-crimson" />
      default: return <Activity className="w-4 h-4 text-text-muted" />
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <Server className="w-4 h-4 text-text-muted" />
        <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Servers</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {servers.map(server => {
          const isActive = server.id === activeServerId
          return (
            <button
              key={server.id}
              onClick={() => onSelect(server.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? "bg-surface-elevated border-crimson/50 text-white shadow-[0_0_10px_rgba(217,22,43,0.1)]" 
                  : "bg-surface border-transparent text-text-muted hover:bg-surface-elevated hover:text-platinum"
              } border`}
            >
              {getIcon(server.type)}
              {server.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Ensure MonitorPlay is imported for HD
import { MonitorPlay } from "lucide-react"
