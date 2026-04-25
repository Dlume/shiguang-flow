import { useState } from 'react'
import { useAppStore } from '../store/useStore'
import { getRandomSuggestion } from '../utils/suggestions'
import { Sparkles, PenLine } from 'lucide-react'

export default function NoteEditor() {
  const [content, setContent] = useState('')
  const [lastSuggestion, setLastSuggestion] = useState<string | null>(null)
  const addNote = useAppStore((s) => s.addNote)

  const handleSubmit = () => {
    if (!content.trim()) return
    addNote({ content: content.trim() })
    setContent('')
    setLastSuggestion(getRandomSuggestion())
    setTimeout(() => setLastSuggestion(null), 3000)
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-[var(--shadow-md)] border border-[var(--border)] overflow-hidden">
      {/* 头部装饰 */}
      <div className="relative h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600" />
      
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
            <PenLine className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <h2 className="text-base font-medium text-[var(--text-primary)]">记录此刻</h2>
        </div>

        <textarea
          className="w-full h-32 sm:h-40 p-4 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:bg-white transition-all resize-none text-sm sm:text-base leading-relaxed"
          placeholder="今天的想法、情绪或一件小事..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-[var(--text-tertiary)] font-medium tabular-nums">
            {content.length} 字
          </span>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="group relative px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-xl overflow-hidden transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              保存
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* 开心小建议 - 优化动画 */}
        {lastSuggestion && (
          <div className="mt-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl" />
            <div className="relative px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0 animate-scale-in">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm text-amber-800 font-medium leading-relaxed animate-slide-up">
                {lastSuggestion}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
