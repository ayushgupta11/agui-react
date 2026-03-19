import React, { useState } from 'react'
import type { ToolCallData } from '../hooks/useToolCalls'

interface ToolCallCardProps {
  toolCall: ToolCallData
}

export function ToolCallCard({ toolCall }: ToolCallCardProps) {
  const [expanded, setExpanded] = useState(false)

  let formattedArgs = toolCall.args
  try {
    formattedArgs = JSON.stringify(JSON.parse(toolCall.args), null, 2)
  } catch {
    // keep raw
  }

  return (
    <div className="rounded-lg border border-orange-900 bg-orange-950/30 text-sm overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-orange-950/50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <span className="text-orange-400 font-mono text-xs">⚙</span>
          <span className="text-orange-200 font-medium">{toolCall.toolName}</span>
          {toolCall.done && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 font-semibold">done</span>
          )}
        </div>
        <span className="text-gray-500 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-orange-900/50">
          {toolCall.args && (
            <div>
              <div className="text-[10px] text-orange-400 uppercase tracking-wider mt-2 mb-1">Args</div>
              <pre className="text-xs text-gray-300 bg-gray-900 rounded p-2 overflow-x-auto">
                {formattedArgs}
              </pre>
            </div>
          )}
          {toolCall.result !== undefined && (
            <div>
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Result</div>
              <pre className="text-xs text-gray-300 bg-gray-900 rounded p-2 overflow-x-auto">
                {toolCall.result}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
