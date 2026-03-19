import React, { useState } from 'react'
import { AGUIProvider } from 'agui-hooks'
import type { ScenarioName } from './mocks/scenarios'
import { Header } from './components/Header'
import { ChatPanel } from './components/ChatPanel'
import { EventTimeline } from './components/EventTimeline'

export default function App() {
  const [scenario, setScenario] = useState<ScenarioName>('simple-chat')

  return (
    <AGUIProvider
      endpoint="/api/chat"
      retryConfig={{ maxAttempts: 0 }}
    >
      <div className="h-full flex flex-col bg-gray-950">
        <Header scenario={scenario} onScenarioChange={setScenario} />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ChatPanel scenario={scenario} />
          </div>
          <div className="hidden lg:flex lg:w-[40%] border-l border-gray-800 overflow-hidden">
            <EventTimeline />
          </div>
        </div>
      </div>
    </AGUIProvider>
  )
}
