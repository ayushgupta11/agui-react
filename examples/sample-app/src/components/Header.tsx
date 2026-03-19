import React from 'react'
import { useAGUI } from 'agui-hooks'
import type { ScenarioName } from '../mocks/scenarios'

const SCENARIOS: { name: ScenarioName; label: string }[] = [
  { name: 'simple-chat', label: 'Simple Chat' },
  { name: 'tool-use', label: 'Tool Use' },
  { name: 'multi-step', label: 'Multi-Step' },
  { name: 'error', label: 'Error' },
  { name: 'component-demo', label: 'Component Demo' },
]

interface HeaderProps {
  scenario: ScenarioName
  onScenarioChange: (s: ScenarioName) => void
}

export function Header({ scenario, onScenarioChange }: HeaderProps) {
  const { isConnected, isRunning } = useAGUI()

  return (
    <header className="flex items-center gap-4 px-4 py-3 border-b border-gray-800 bg-gray-900 shrink-0 flex-wrap">
      <span className="text-sm font-semibold text-gray-200 mr-2">agui-hooks demo</span>

      <div className="flex gap-2 flex-wrap">
        {SCENARIOS.map(({ name, label }) => (
          <button
            key={name}
            onClick={() => onScenarioChange(name)}
            disabled={isRunning}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              scenario === name
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <StatusDot active={isConnected} label="Connected" activeColor="bg-emerald-500" />
        <StatusDot active={isRunning} label="Running" activeColor="bg-indigo-500" pulse />
      </div>
    </header>
  )
}

function StatusDot({
  active,
  label,
  activeColor,
  pulse = false,
}: {
  active: boolean
  label: string
  activeColor: string
  pulse?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`w-2 h-2 rounded-full ${active ? activeColor : 'bg-gray-700'} ${
          active && pulse ? 'animate-pulse' : ''
        }`}
      />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  )
}
