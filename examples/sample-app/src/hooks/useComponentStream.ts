import { useEffect, useRef, useState } from 'react'
import { useAGUI } from 'agui-hooks'
import type { CustomEvent, RunStartedEvent } from 'agui-hooks'

export interface ComponentStreamData {
  componentId: string
  componentType: string
  /** Raw accumulated JSON string — parse only when `done` is true */
  raw: string
  done: boolean
}

export function useComponentStream(): ComponentStreamData[] {
  const { on } = useAGUI()
  const mapRef = useRef<Map<string, ComponentStreamData>>(new Map())
  const [components, setComponents] = useState<ComponentStreamData[]>([])

  function sync() {
    setComponents(Array.from(mapRef.current.values()))
  }

  useEffect(() => {
    const offClear = on<RunStartedEvent>('RUN_STARTED', () => {
      mapRef.current.clear()
      setComponents([])
    })

    const offCustom = on<CustomEvent>('CUSTOM', (e) => {
      const v = e.value as Record<string, string>

      if (e.name === 'COMPONENT_DATA_START') {
        mapRef.current.set(v.componentId, {
          componentId: v.componentId,
          componentType: v.componentType,
          raw: '',
          done: false,
        })
        sync()
      } else if (e.name === 'COMPONENT_DATA') {
        const existing = mapRef.current.get(v.componentId)
        if (existing) {
          mapRef.current.set(v.componentId, { ...existing, raw: existing.raw + v.delta })
          sync()
        }
      } else if (e.name === 'COMPONENT_DATA_END') {
        const existing = mapRef.current.get(v.componentId)
        if (existing) {
          mapRef.current.set(v.componentId, { ...existing, done: true })
          sync()
        }
      }
    })

    return () => {
      offClear()
      offCustom()
    }
  }, [on])

  return components
}
