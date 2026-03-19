import { useEffect, useRef, useState } from 'react'
import { useAGUI } from 'agui-hooks'
import type {
  ToolCallStartEvent,
  ToolCallArgsEvent,
  ToolCallEndEvent,
  ToolCallResultEvent,
  RunStartedEvent,
} from 'agui-hooks'

export interface ToolCallData {
  toolCallId: string
  toolName: string
  args: string
  result?: string
  done: boolean
}

export function useToolCalls(): ToolCallData[] {
  const { on } = useAGUI()
  const mapRef = useRef<Map<string, ToolCallData>>(new Map())
  const [toolCalls, setToolCalls] = useState<ToolCallData[]>([])

  function sync() {
    setToolCalls(Array.from(mapRef.current.values()))
  }

  useEffect(() => {
    const offClear = on<RunStartedEvent>('RUN_STARTED', () => {
      mapRef.current.clear()
      setToolCalls([])
    })

    const offStart = on<ToolCallStartEvent>('TOOL_CALL_START', (e) => {
      mapRef.current.set(e.toolCallId, {
        toolCallId: e.toolCallId,
        toolName: e.toolName,
        args: '',
        done: false,
      })
      sync()
    })

    const offArgs = on<ToolCallArgsEvent>('TOOL_CALL_ARGS', (e) => {
      const existing = mapRef.current.get(e.toolCallId)
      if (existing) {
        mapRef.current.set(e.toolCallId, { ...existing, args: existing.args + e.delta })
        sync()
      }
    })

    const offEnd = on<ToolCallEndEvent>('TOOL_CALL_END', (e) => {
      const existing = mapRef.current.get(e.toolCallId)
      if (existing) {
        mapRef.current.set(e.toolCallId, { ...existing, done: true })
        sync()
      }
    })

    const offResult = on<ToolCallResultEvent>('TOOL_CALL_RESULT', (e) => {
      const existing = mapRef.current.get(e.toolCallId)
      if (existing) {
        mapRef.current.set(e.toolCallId, { ...existing, result: e.result })
        sync()
      }
    })

    return () => {
      offClear()
      offStart()
      offArgs()
      offEnd()
      offResult()
    }
  }, [on])

  return toolCalls
}
