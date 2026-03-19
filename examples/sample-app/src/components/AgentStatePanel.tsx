import React from 'react'
import { useAGUIAgentState } from 'agui-hooks'

export function AgentStatePanel() {
  const state = useAGUIAgentState()
  const entries = Object.entries(state)

  if (entries.length === 0) return null

  return (
    <div className="rounded-lg border border-teal-900 bg-teal-950/30 p-3 mb-3">
      <div className="text-[10px] text-teal-400 uppercase tracking-wider mb-2">Agent State</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {entries.map(([key, value]) => (
          <React.Fragment key={key}>
            <span className="text-xs text-teal-300 font-mono truncate">{key}</span>
            <span className="text-xs text-gray-300 font-mono truncate">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
