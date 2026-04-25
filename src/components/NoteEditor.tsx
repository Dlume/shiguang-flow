import { useState } from 'react'
import { useAppStore } from '../store/useStore'
import { getRandomSuggestion } from '../utils/suggestions'

export default function NoteEditor() {
  const [content, setContent] = useState('')
  const [lastSuggestion, setLastSuggestion] = useState<string | null>(null)
  const addNote = useAppStore((s) => s.addNote)

  const handleSubmit = () => {
    if (!content.trim()) return
    addNote({ content: content.trim() })
    setContent('')
    // 显示开心小建议
    setLastSuggestion(getRandomSuggestion())
    // 3 秒后自动隐藏
    setTimeout(() => setLastSuggestion(null), 3000)
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6 border border-stone-100">
      <h2 className="text-lg font-medium text-stone-700 mb-4">记录此刻</h2>
      <textarea
        className="w-full h-32 p-4 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none transition-all"
        placeholder="写下今天的想法、情绪或一件小事..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-stone-400">
          {content.length} 字
        </span>
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="px-5 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          保存
        </button>
      </div>

      {/* 开心小建议 */}
      {lastSuggestion && (
        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="text-sm text-amber-800 text-center font-medium">
            {lastSuggestion}
          </div>
        </div>
      )}
    </div>
  )
}
