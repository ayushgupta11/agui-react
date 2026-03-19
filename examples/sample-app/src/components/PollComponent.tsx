import React, { useState } from 'react'

export interface PollOption {
  id: string
  label: string
  votes: number
}

export interface PollData {
  question: string
  options: PollOption[]
}

interface PollComponentProps {
  data: PollData
}

export function PollComponent({ data }: PollComponentProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [voted, setVoted] = useState(false)
  const [localVotes, setLocalVotes] = useState<Record<string, number>>(
    Object.fromEntries(data.options.map((o) => [o.id, o.votes])),
  )

  function vote() {
    if (!selected || voted) return
    setLocalVotes((prev) => ({ ...prev, [selected]: (prev[selected] ?? 0) + 1 }))
    setVoted(true)
  }

  const total = Object.values(localVotes).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-violet-100">{data.question}</p>

      <div className="space-y-2">
        {data.options.map((option) => {
          const pct = total > 0 ? Math.round((localVotes[option.id] / total) * 100) : 0
          const isSelected = selected === option.id
          const isWinner = voted && pct === Math.max(...Object.values(localVotes).map((v) => total > 0 ? Math.round((v / total) * 100) : 0))

          if (voted) {
            return (
              <div key={option.id} className="relative overflow-hidden rounded-lg border border-violet-800/60 bg-violet-950/40">
                {/* vote bar fill */}
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${
                    isSelected ? 'bg-violet-600/40' : 'bg-violet-900/30'
                  }`}
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <span className="text-violet-400 text-xs">✓</span>
                    )}
                    <span className={`text-sm ${isSelected ? 'text-violet-100 font-medium' : 'text-gray-300'}`}>
                      {option.label}
                    </span>
                    {isWinner && isSelected && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-700 text-violet-200 font-semibold">winner</span>
                    )}
                  </div>
                  <span className={`text-xs font-mono ${isSelected ? 'text-violet-300' : 'text-gray-500'}`}>
                    {pct}%
                  </span>
                </div>
              </div>
            )
          }

          return (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                isSelected
                  ? 'border-violet-500 bg-violet-900/50 text-violet-100'
                  : 'border-violet-900/60 bg-violet-950/30 text-gray-300 hover:border-violet-700 hover:bg-violet-900/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 transition-colors ${
                    isSelected ? 'border-violet-400 bg-violet-400' : 'border-gray-600'
                  }`}
                />
                {option.label}
              </div>
            </button>
          )
        })}
      </div>

      {!voted && (
        <button
          onClick={vote}
          disabled={!selected}
          className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Vote
        </button>
      )}

      {voted && (
        <p className="text-xs text-gray-500 text-center">{total} vote{total !== 1 ? 's' : ''} total</p>
      )}
    </div>
  )
}
