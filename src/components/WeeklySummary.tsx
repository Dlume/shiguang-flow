import { useMemo } from 'react'
import { useAppStore } from '../store/useStore'
import { BarChart3, TrendingUp } from 'lucide-react'

export default function WeeklySummary() {
  const notes = useAppStore((s) => s.notes)

  const summary = useMemo(() => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() + 1)
    startOfWeek.setHours(0, 0, 0, 0)

    const weekNotes = notes.filter((n) => new Date(n.date) >= startOfWeek)
    
    const wordCount: Record<string, number> = {}
    weekNotes.forEach((n) => {
      n.content.split(/[\s,，。！？；；、\n]+/).forEach((w) => {
        if (w.length > 1) wordCount[w] = (wordCount[w] || 0) + 1
      })
    })
    const topWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    return { count: weekNotes.length, topWords, startOfWeek }
  }, [notes])

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-[var(--shadow-md)] border border-[var(--border)] overflow-hidden">
      <div className="relative h-1 bg-gradient-to-r from-blue-400 to-cyan-500" />
      
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <h2 className="text-base font-medium text-[var(--text-primary)]">本周拾光</h2>
        </div>

        <div className="flex items-center gap-4 mb-5 p-3 bg-[var(--bg-tertiary)] rounded-xl">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
              {summary.count}
            </div>
            <div className="text-xs text-[var(--text-tertiary)]">
              本周记录 ({summary.startOfWeek.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}起)
            </div>
          </div>
        </div>

        {summary.topWords.length > 0 ? (
          <div>
            <div className="text-xs font-medium text-[var(--text-tertiary)] mb-3 uppercase tracking-wider">高频词汇</div>
            <div className="flex flex-wrap gap-2">
              {summary.topWords.map(([word, count], index) => (
                <span
                  key={word}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-[var(--text-primary)] rounded-full text-sm font-medium border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors"
                  style={{ 
                    fontSize: `${Math.min(13 + count * 0.8, 16)}px`,
                    background: index === 0 
                      ? 'linear-gradient(to right, rgba(59,130,246,0.1), rgba(6,182,212,0.1))' 
                      : undefined
                  }}
                >
                  {word}
                  <span className="ml-1 text-[var(--text-tertiary)] text-xs">×{count}</span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-[var(--text-tertiary)]" />
            </div>
            <div className="text-sm text-[var(--text-tertiary)]">
              本周暂无记录
            </div>
            <div className="text-xs text-[var(--text-tertiary)] mt-1">
              开始记录你的第一个瞬间吧
            </div>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--text-tertiary)] text-center">
            每一个当下，都值得被铭记
          </div>
        </div>
      </div>
    </div>
  )
}
