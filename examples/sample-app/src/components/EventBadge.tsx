import React from 'react'

const COLOR_MAP: Record<string, string> = {
  RUN_STARTED: 'bg-blue-900 text-blue-300',
  RUN_FINISHED: 'bg-blue-900 text-blue-300',
  RUN_ERROR: 'bg-red-900 text-red-300',
  STEP_STARTED: 'bg-purple-900 text-purple-300',
  STEP_FINISHED: 'bg-purple-900 text-purple-300',
  TEXT_MESSAGE_START: 'bg-emerald-900 text-emerald-300',
  TEXT_MESSAGE_CONTENT: 'bg-emerald-900 text-emerald-300',
  TEXT_MESSAGE_END: 'bg-emerald-900 text-emerald-300',
  TOOL_CALL_START: 'bg-orange-900 text-orange-300',
  TOOL_CALL_ARGS: 'bg-orange-900 text-orange-300',
  TOOL_CALL_END: 'bg-orange-900 text-orange-300',
  TOOL_CALL_RESULT: 'bg-orange-900 text-orange-300',
  STATE_SNAPSHOT: 'bg-teal-900 text-teal-300',
  STATE_DELTA: 'bg-teal-900 text-teal-300',
  MESSAGES_SNAPSHOT: 'bg-teal-900 text-teal-300',
  RAW: 'bg-gray-800 text-gray-400',
  CUSTOM: 'bg-gray-800 text-gray-400',
  // Component custom events (keyed by name, looked up below)
  COMPONENT_DATA_START: 'bg-violet-900 text-violet-300',
  COMPONENT_DATA: 'bg-violet-900 text-violet-300',
  COMPONENT_DATA_END: 'bg-violet-900 text-violet-300',
}

interface EventBadgeProps {
  type: string
  /** For CUSTOM events, pass the `name` to get a more specific color */
  name?: string
}

export function EventBadge({ type, name }: EventBadgeProps) {
  const key = type === 'CUSTOM' && name ? name : type
  const cls = COLOR_MAP[key] ?? 'bg-gray-800 text-gray-400'
  const label = type === 'CUSTOM' && name ? name : type
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${cls}`}>
      {label}
    </span>
  )
}
