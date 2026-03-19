// ─── Types ────────────────────────────────────────────────────────────────────

export type ScenarioName = 'simple-chat' | 'tool-use' | 'multi-step' | 'error' | 'component-demo'

export interface ScheduledEvent {
  delay: number // absolute ms from stream start
  event: Record<string, unknown>
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function id() {
  return Math.random().toString(36).slice(2, 10)
}

// ─── Scenario builders ────────────────────────────────────────────────────────

export function buildSimpleChat(): ScheduledEvent[] {
  const threadId = id()
  const runId = id()
  const msgId = id()
  const words = [
    'Hello!', ' I', "'m", ' an', ' AI', ' assistant', ' powered', ' by',
    ' the', ' AG-UI', ' protocol.', ' I', ' can', ' stream', ' responses',
    ' token', ' by', ' token', ' in', ' real', ' time.', ' This', ' is',
    ' the', ' simple', ' chat', ' scenario', ' —', ' no', ' tools,', ' just',
    ' plain', ' streaming', ' text.',
  ]

  const events: ScheduledEvent[] = [
    { delay: 0, event: { type: 'RUN_STARTED', threadId, runId } },
    { delay: 50, event: { type: 'TEXT_MESSAGE_START', messageId: msgId, role: 'assistant' } },
  ]

  words.forEach((word, i) => {
    events.push({
      delay: 100 + i * 60,
      event: { type: 'TEXT_MESSAGE_CONTENT', messageId: msgId, delta: word },
    })
  })

  const endDelay = 100 + words.length * 60 + 100

  events.push({ delay: endDelay, event: { type: 'TEXT_MESSAGE_END', messageId: msgId } })
  events.push({ delay: endDelay + 50, event: { type: 'RUN_FINISHED', threadId, runId } })

  return events
}

export function buildToolUse(): ScheduledEvent[] {
  const threadId = id()
  const runId = id()
  const stepId = id()
  const toolCallId = id()
  const msgId = id()
  const words = ['The', ' weather', ' in', ' San', ' Francisco', ' is', ' currently', ' 68°F', ' and', ' sunny', ' with', ' a', ' light', ' breeze.']

  return [
    { delay: 0, event: { type: 'RUN_STARTED', threadId, runId } },
    { delay: 80, event: { type: 'STEP_STARTED', stepName: 'lookup-weather', stepId } },
    { delay: 160, event: { type: 'TOOL_CALL_START', toolCallId, toolName: 'get_weather', parentMessageId: msgId } },
    { delay: 260, event: { type: 'TOOL_CALL_ARGS', toolCallId, delta: '{"loca' } },
    { delay: 360, event: { type: 'TOOL_CALL_ARGS', toolCallId, delta: 'tion":"San Francisco"}' } },
    { delay: 500, event: { type: 'TOOL_CALL_END', toolCallId } },
    { delay: 900, event: { type: 'TOOL_CALL_RESULT', toolCallId, result: '{"temperature":68,"unit":"F","condition":"sunny","wind":"light breeze"}' } },
    { delay: 1000, event: { type: 'STEP_FINISHED', stepName: 'lookup-weather', stepId } },
    { delay: 1100, event: { type: 'TEXT_MESSAGE_START', messageId: msgId, role: 'assistant' } },
    ...words.map((word, i) => ({
      delay: 1200 + i * 70,
      event: { type: 'TEXT_MESSAGE_CONTENT', messageId: msgId, delta: word },
    })),
    { delay: 1200 + words.length * 70 + 100, event: { type: 'TEXT_MESSAGE_END', messageId: msgId } },
    { delay: 1200 + words.length * 70 + 200, event: { type: 'RUN_FINISHED', threadId, runId } },
  ]
}

export function buildMultiStep(): ScheduledEvent[] {
  const threadId = id()
  const runId = id()
  const step1Id = id()
  const step2Id = id()
  const msgId = id()
  const words = ['I', "'ve", ' completed', ' the', ' analysis.', ' Both', ' steps', ' ran', ' successfully', ' and', ' the', ' agent', ' state', ' has', ' been', ' updated', ' with', ' the', ' results.']

  return [
    { delay: 0, event: { type: 'RUN_STARTED', threadId, runId } },
    { delay: 80, event: { type: 'STATE_SNAPSHOT', snapshot: { phase: 'initializing', progress: 0, steps_completed: 0 } } },
    { delay: 200, event: { type: 'STEP_STARTED', stepName: 'data-collection', stepId: step1Id } },
    { delay: 600, event: { type: 'STATE_DELTA', delta: [
      { op: 'replace', path: '/phase', value: 'collecting' },
      { op: 'replace', path: '/progress', value: 40 },
    ] } },
    { delay: 1000, event: { type: 'STEP_FINISHED', stepName: 'data-collection', stepId: step1Id } },
    { delay: 1100, event: { type: 'STATE_DELTA', delta: [
      { op: 'replace', path: '/phase', value: 'analyzing' },
      { op: 'replace', path: '/progress', value: 60 },
      { op: 'replace', path: '/steps_completed', value: 1 },
    ] } },
    { delay: 1200, event: { type: 'STEP_STARTED', stepName: 'analysis', stepId: step2Id } },
    { delay: 1700, event: { type: 'STATE_DELTA', delta: [
      { op: 'replace', path: '/progress', value: 90 },
    ] } },
    { delay: 2000, event: { type: 'TEXT_MESSAGE_START', messageId: msgId, role: 'assistant' } },
    ...words.map((word, i) => ({
      delay: 2100 + i * 65,
      event: { type: 'TEXT_MESSAGE_CONTENT', messageId: msgId, delta: word },
    })),
    { delay: 2100 + words.length * 65 + 100, event: { type: 'TEXT_MESSAGE_END', messageId: msgId } },
    { delay: 2100 + words.length * 65 + 150, event: { type: 'STEP_FINISHED', stepName: 'analysis', stepId: step2Id } },
    { delay: 2100 + words.length * 65 + 200, event: { type: 'STATE_DELTA', delta: [
      { op: 'replace', path: '/phase', value: 'complete' },
      { op: 'replace', path: '/progress', value: 100 },
      { op: 'replace', path: '/steps_completed', value: 2 },
    ] } },
    { delay: 2100 + words.length * 65 + 300, event: { type: 'RUN_FINISHED', threadId, runId } },
  ]
}

export function buildError(): ScheduledEvent[] {
  const threadId = id()
  const runId = id()
  const msgId = id()

  return [
    { delay: 0, event: { type: 'RUN_STARTED', threadId, runId } },
    { delay: 80, event: { type: 'TEXT_MESSAGE_START', messageId: msgId, role: 'assistant' } },
    { delay: 180, event: { type: 'TEXT_MESSAGE_CONTENT', messageId: msgId, delta: 'Processing your request...' } },
    { delay: 380, event: { type: 'TEXT_MESSAGE_CONTENT', messageId: msgId, delta: ' Almost there—' } },
    { delay: 700, event: { type: 'RUN_ERROR', message: 'Upstream service timeout: the model backend did not respond within 30s.', code: 'UPSTREAM_TIMEOUT' } },
  ]
}

export function buildComponentDemo(): ScheduledEvent[] {
  const threadId = id()
  const runId = id()
  const msgId = id()
  const componentId = id()

  const introWords = [
    "I've", ' prepared', ' an', ' interactive', ' poll', ' for', ' you.', ' Cast', ' your', ' vote', ' below!',
  ]

  const pollJson = JSON.stringify({
    question: 'Which AI agent framework do you prefer?',
    options: [
      { id: 'a', label: 'LangChain', votes: 14 },
      { id: 'b', label: 'LlamaIndex', votes: 9 },
      { id: 'c', label: 'CrewAI', votes: 11 },
      { id: 'd', label: 'AutoGen', votes: 7 },
    ],
  })

  // Split into small chunks to simulate streaming
  const chunkSize = 25
  const chunks: string[] = []
  for (let i = 0; i < pollJson.length; i += chunkSize) {
    chunks.push(pollJson.slice(i, i + chunkSize))
  }

  const events: ScheduledEvent[] = [
    { delay: 0, event: { type: 'RUN_STARTED', threadId, runId } },
    { delay: 50, event: { type: 'TEXT_MESSAGE_START', messageId: msgId, role: 'assistant' } },
    ...introWords.map((word, i) => ({
      delay: 100 + i * 65,
      event: { type: 'TEXT_MESSAGE_CONTENT', messageId: msgId, delta: word },
    })),
  ]

  const introEnd = 100 + introWords.length * 65

  events.push({ delay: introEnd, event: { type: 'TEXT_MESSAGE_END', messageId: msgId } })
  events.push({
    delay: introEnd + 120,
    event: {
      type: 'CUSTOM',
      name: 'COMPONENT_DATA_START',
      value: { componentId, componentType: 'poll' },
    },
  })

  chunks.forEach((chunk, i) => {
    events.push({
      delay: introEnd + 220 + i * 35,
      event: {
        type: 'CUSTOM',
        name: 'COMPONENT_DATA',
        value: { componentId, delta: chunk },
      },
    })
  })

  const endDelay = introEnd + 220 + chunks.length * 35 + 80
  events.push({
    delay: endDelay,
    event: { type: 'CUSTOM', name: 'COMPONENT_DATA_END', value: { componentId } },
  })
  events.push({ delay: endDelay + 60, event: { type: 'RUN_FINISHED', threadId, runId } })

  return events
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const SCENARIOS: Record<ScenarioName, () => ScheduledEvent[]> = {
  'simple-chat': buildSimpleChat,
  'tool-use': buildToolUse,
  'multi-step': buildMultiStep,
  'error': buildError,
  'component-demo': buildComponentDemo,
}
