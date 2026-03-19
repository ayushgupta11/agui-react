import React from 'react'
import type { Message } from 'agui-hooks'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-gray-800 text-gray-100 rounded-bl-sm'
        }`}
      >
        {message.content}
        {message.isStreaming && (
          <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle animate-cursor-blink" />
        )}
      </div>
    </div>
  )
}
