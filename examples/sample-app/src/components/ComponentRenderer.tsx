import React from 'react'
import type { ComponentStreamData } from '../hooks/useComponentStream'
import { PollComponent } from './PollComponent'
import type { PollData } from './PollComponent'

interface ComponentRendererProps {
  component: ComponentStreamData
}

export function ComponentRenderer({ component }: ComponentRendererProps) {
  const { componentType, raw, done } = component

  return (
    <div className="rounded-xl border border-violet-800/60 bg-violet-950/20 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-violet-900/50 bg-violet-950/30">
        <div className="flex items-center gap-2">
          <span className="text-violet-400 text-xs font-mono">⬡</span>
          <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
            {componentType}
          </span>
        </div>
        {!done && (
          <span className="text-[10px] text-violet-500 animate-pulse">streaming…</span>
        )}
      </div>

      <div className="px-3 py-3">
        {!done ? (
          <Skeleton />
        ) : (
          <ComponentBody type={componentType} raw={raw} />
        )}
      </div>
    </div>
  )
}

function ComponentBody({ type, raw }: { type: string; raw: string }) {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return (
      <pre className="text-xs text-red-400 whitespace-pre-wrap break-all">
        Failed to parse component data:{'\n'}{raw}
      </pre>
    )
  }

  if (type === 'poll') {
    return <PollComponent data={parsed as PollData} />
  }

  // Fallback: pretty-print JSON for unknown component types
  return (
    <pre className="text-xs text-gray-300 bg-gray-900 rounded p-2 overflow-x-auto">
      {JSON.stringify(parsed, null, 2)}
    </pre>
  )
}

function Skeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="h-3 bg-violet-900/50 rounded w-3/4" />
      <div className="h-8 bg-violet-900/30 rounded" />
      <div className="h-8 bg-violet-900/30 rounded" />
      <div className="h-8 bg-violet-900/30 rounded" />
      <div className="h-8 bg-violet-600/20 rounded w-full mt-1" />
    </div>
  )
}
