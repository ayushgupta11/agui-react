import { http, HttpResponse } from 'msw'
import { SCENARIOS } from './scenarios'
import type { ScenarioName } from './scenarios'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const handlers = [
  http.post('/api/chat', async ({ request }) => {
    const body = await request.json() as { message?: string; metadata?: { scenario?: string } }
    const scenarioName = (body?.metadata?.scenario ?? 'simple-chat') as ScenarioName
    const builder = SCENARIOS[scenarioName] ?? SCENARIOS['simple-chat']
    const events = builder()

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        let prev = 0
        for (const { delay, event } of events) {
          await sleep(delay - prev)
          prev = delay
          const line = `data: ${JSON.stringify(event)}\n\n`
          controller.enqueue(encoder.encode(line))
        }
        controller.close()
      },
    })

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  }),
]
