import React, { useEffect, useRef } from 'react'
import { useAGUIMessages, useAGUI } from 'agui-hooks'
import type { ScenarioName } from '../mocks/scenarios'
import { MessageBubble } from './MessageBubble'
import { ToolCallCard } from './ToolCallCard'
import { ComponentRenderer } from './ComponentRenderer'
import { AgentStatePanel } from './AgentStatePanel'
import { InputBar } from './InputBar'
import { useToolCalls } from '../hooks/useToolCalls'
import { useComponentStream } from '../hooks/useComponentStream'

interface ChatPanelProps {
  scenario: ScenarioName
}

export function ChatPanel({ scenario }: ChatPanelProps) {
  const messages = useAGUIMessages()
  const { error } = useAGUI()
  const toolCalls = useToolCalls()
  const components = useComponentStream()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, toolCalls, components])

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && toolCalls.length === 0 && components.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-600 text-sm">
            Send a message to start the demo
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {toolCalls.map((tc) => (
          <ToolCallCard key={tc.toolCallId} toolCall={tc} />
        ))}

        {components.map((c) => (
          <ComponentRenderer key={c.componentId} component={c} />
        ))}

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm">
            <div className="text-red-400 font-semibold mb-0.5">Run Error</div>
            <div className="text-red-200">{error.message}</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-4">
        <AgentStatePanel />
      </div>

      <InputBar scenario={scenario} />
    </div>
  )
}
