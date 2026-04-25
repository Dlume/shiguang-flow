import { useMemo } from 'react'
import { useAppStore } from '../store/useStore'

export default function WeeklySummary() {
  const notes = useAppStore((s) => s.notes)

  const summary = useMemo(() => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() + 1)
    startOfWeek.setHours(0, 0, 0, 0)

    const weekNotes = notes.filter((n) => new Date(n.date) >= startOfWeek)
    
    // 简易词频统计
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
    <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-100">
      <h2 className="text-lg font-medium text-stone-700 mb-4">本周拾光</h2>
      <div className="text-sm text-stone-500 mb-4">
        起始于 {summary.startOfWeek.toLocaleDateString('zh-CN')} · 共记录 {summary.count} 次
      </div>

      {summary.topWords.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-4">
          {summary.topWords.map(([word, count]) => (
            <span
              key={word}
              className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm"
              style={{ fontSize: `${Math.min(12 + count * 2, 18)}px` }}
            >
              {word} <span className="text-xs text-stone-400">×{count}</span>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-stone-400 text-sm italic mb-4">本周暂无记录，静待花开。</div>
      )}

      <div className="text-xs text-stone-400 border-t border-stone-100 pt-3">
        因果自择，步履不停。
      </div>
    </div>
  )
}