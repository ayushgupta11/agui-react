import React, { useState } from 'react'
import { useAGUIEventHistory } from 'agui-hooks'
import type { AGUIEvent } from 'agui-hooks'
import { EventBadge } from './EventBadge'

function formatTime(ts?: number): string {
  const d = new Date(ts ?? Date.now())
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  const ms = String(d.getMilliseconds()).padStart(3, '0')
  return `${hh}:${mm}:${ss}.${ms}`
}

function summarize(event: AGUIEvent): string {
  switch (event.type) {
    case 'RUN_STARTED': return `run: ${event.runId.slice(0, 6)}`
    case 'RUN_FINISHED': return `run: ${event.runId.slice(0, 6)}`
    case 'RUN_ERROR': return event.message.slice(0, 40)
    case 'STEP_STARTED': return event.stepName
    case 'STEP_FINISHED': return event.stepName
    case 'TEXT_MESSAGE_START': return `msg: ${event.messageId.slice(0, 6)} [${event.role}]`
    case 'TEXT_MESSAGE_CONTENT': return `"${event.delta.slice(0, 20)}"`
    case 'TEXT_MESSAGE_END': return `msg: ${event.messageId.slice(0, 6)}`
    case 'TOOL_CALL_START': return event.toolName
    case 'TOOL_CALL_ARGS': return `"${event.delta.slice(0, 20)}"`
    case 'TOOL_CALL_END': return event.toolCallId.slice(0, 6)
    case 'TOOL_CALL_RESULT': return event.result.slice(0, 30)
    case 'STATE_SNAPSHOT': return `${Object.keys(event.snapshot).length} keys`
    case 'STATE_DELTA': return `${event.delta.length} ops`
    case 'MESSAGES_SNAPSHOT': return `${event.messages.length} messages`
    case 'RAW': return event.event.slice(0, 30)
    case 'CUSTOM': {
      const v = event.value as Record<string, string> | undefined
      if (event.name === 'COMPONENT_DATA_START') return `[${v?.componentType}] id:${String(v?.componentId ?? '').slice(0, 6)}`
      if (event.name === 'COMPONENT_DATA') return `"${String(v?.delta ?? '').slice(0, 20)}"`
      if (event.name === 'COMPONENT_DATA_END') return `id:${String(v?.componentId ?? '').slice(0, 6)}`
      return event.name
    }
    default: return ''
  }
}

interface EventRowProps {
  index: number
  event: AGUIEvent
}

function EventRow({ index, event }: EventRowProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="border-b border-gray-800 last:border-0 cursor-pointer hover:bg-gray-900/50 transition-colors"
      onClick={() => setOpen((v) => !v)}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="text-[10px] text-gray-600 w-5 shrink-0 text-right">{index + 1}</span>
        <EventBadge type={event.type} name={event.type === 'CUSTOM' ? (event as { name?: string }).name : undefined} />
        <span className="text-xs text-gray-400 flex-1 truncate min-w-0">{summarize(event)}</span>
        <span className="text-[10px] text-gray-600 shrink-0 font-mono">{formatTime(event.timestamp)}</span>
      </div>
      {open && (
        <div className="px-3 pb-3">
          <pre className="text-[11px] text-gray-300 bg-gray-900 rounded p-2 overflow-x-auto">
            {JSON.stringify(event, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export function EventTimeline() {
  const events = useAGUIEventHistory()

  return (
    <div className="w-full flex flex-col h-full">
      <div className="px-3 py-2 border-b border-gray-800 bg-gray-900 shrink-0">
        <span className="text-xs font-semibold text-gray-400">Event Timeline</span>
        <span className="ml-2 text-[10px] text-gray-600">{events.length} events</span>
      </div>
      <div className="flex-1 overflow-y-auto text-sm">
        {events.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-700 text-xs">
            Events will appear here
          </div>
        ) : (
          events.map((event, i) => (
            <EventRow key={i} index={i} event={event} />
          ))
        )}
      </div>
    </div>
  )
}
