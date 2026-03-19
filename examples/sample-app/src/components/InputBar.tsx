import React, { useState, useRef, KeyboardEvent } from 'react'
import { useAGUI } from 'agui-hooks'
import type { ScenarioName } from '../mocks/scenarios'

interface InputBarProps {
  scenario: ScenarioName
}

export function InputBar({ scenario }: InputBarProps) {
  const { sendMessage, stopRun, clearHistory, isRunning } = useAGUI()
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  async function handleSend() {
    const trimmed = text.trim()
    if (!trimmed || isRunning) return
    setText('')
    await sendMessage(trimmed, { scenario })
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  return (
    <div className="border-t border-gray-800 bg-gray-900 px-4 py-3">
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
          disabled={isRunning}
          rows={2}
          className="flex-1 resize-none rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 text-sm px-3 py-2 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
        />
        <div className="flex flex-col gap-1.5">
          {isRunning ? (
            <button
              onClick={stopRun}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              onClick={() => void handleSend()}
              disabled={!text.trim()}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send
            </button>
          )}
          <button
            onClick={clearHistory}
            className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium transition-colors"
            title="Clear history"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
