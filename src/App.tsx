import { useState, useEffect } from 'react'
import { useAppStore } from './store/useStore'
import NoteEditor from './components/NoteEditor'
import WeeklySummary from './components/WeeklySummary'
import DataManager from './components/DataManager'

type Tab = 'record' | 'summary' | 'data'

interface Note {
  id: string
  date: string
  content: string
  mood?: string
}

// 按周分组
function groupByWeek(notes: Note[]) {
  const weeks = new Map<string, Note[]>()
  notes.forEach((note) => {
    const date = new Date(note.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay() + 1)
    const weekKey = weekStart.toISOString().split('T')[0]
    if (!weeks.has(weekKey)) weeks.set(weekKey, [])
    weeks.get(weekKey)!.push(note)
  })
  return Array.from(weeks.entries()).sort((a, b) => b[0].localeCompare(a[0]))
}

// 按月分组
function groupByMonth(notes: Note[]) {
  const months = new Map<string, Note[]>()
  notes.forEach((note) => {
    const monthKey = note.date.slice(0, 7) // YYYY-MM
    if (!months.has(monthKey)) months.set(monthKey, [])
    months.get(monthKey)!.push(note)
  })
  return Array.from(months.entries()).sort((a, b) => b[0].localeCompare(a[0]))
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('record')
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set())
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  
  const loadNotes = useAppStore((s) => s.loadNotes)
  const notes = useAppStore((s) => s.notes)
  const todayHexagram = useAppStore((s) => s.todayHexagram)

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  const tabs = [
    { id: 'record' as Tab, label: '记录' },
    { id: 'summary' as Tab, label: '回顾' },
    { id: 'data' as Tab, label: '数据' },
  ]

  const toggleWeek = (week: string) => {
    const next = new Set(expandedWeeks)
    next.has(week) ? next.delete(week) : next.add(week)
    setExpandedWeeks(next)
  }

  const toggleMonth = (month: string) => {
    const next = new Set(expandedMonths)
    next.has(month) ? next.delete(month) : next.add(month)
    setExpandedMonths(next)
  }

  const weekNotes = groupByWeek(notes)
  const monthNotes = groupByMonth(notes)

  const formatWeekLabel = (weekStart: string) => {
    const date = new Date(weekStart)
    const end = new Date(date)
    end.setDate(date.getDate() + 6)
    return `${date.getMonth() + 1}/${date.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
  }

  const formatMonthLabel = (month: string) => {
    const [year, m] = month.split('-')
    return `${year}年${parseInt(m)}月`
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <div className="flex justify-center mb-3">
          <img src="/logo.svg" alt="拾光·心流 Logo" className="w-16 h-16" />
        </div>
        <h1 className="text-2xl font-serif text-stone-800 mb-1">拾光·心流</h1>
        {todayHexagram && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-full mb-2">
            <span className="text-lg font-serif text-stone-700">{todayHexagram.image}</span>
            <span className="text-sm text-stone-600">
              第 {todayHexagram.number} 卦 · {todayHexagram.name}
            </span>
            <span className="text-xs text-stone-400">|</span>
            <span className="text-xs text-stone-500 italic">{todayHexagram.judgment}</span>
          </div>
        )}
      </header>

      {/* 标签导航 */}
      <nav className="flex gap-2 mb-6 bg-stone-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 内容区域 */}
      {activeTab === 'record' && (
        <>
          <NoteEditor />
          
          {/* 过往拾光 - 折叠展示 */}
          {notes.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-stone-700">过往拾光</h2>
                <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      viewMode === 'week'
                        ? 'bg-white text-stone-800 shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    按周
                  </button>
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      viewMode === 'month'
                        ? 'bg-white text-stone-800 shadow-sm'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    按月
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {viewMode === 'week' ? (
                  weekNotes.map(([week, items]) => (
                    <div key={week} className="border border-stone-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleWeek(week)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-stone-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-xs transition-transform ${expandedWeeks.has(week) ? 'rotate-90' : ''}`}>
                            ▶
                          </span>
                          <span className="text-sm font-medium text-stone-700">
                            第{new Date(week).getWeek ? new Date(week).getWeek() : Math.ceil(new Date(week).getDate() / 7)}周 · {formatWeekLabel(week)}
                          </span>
                        </div>
                        <span className="text-xs text-stone-400">{items.length} 条记录</span>
                      </button>
                      {expandedWeeks.has(week) && (
                        <div className="divide-y divide-stone-50">
                          {items.map((note) => (
                            <div key={note.id} className="px-4 py-3">
                              <div className="text-xs text-stone-400 mb-1">{note.date}</div>
                              <div className="text-stone-700 whitespace-pre-wrap text-sm">{note.content}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  monthNotes.map(([month, items]) => (
                    <div key={month} className="border border-stone-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleMonth(month)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-stone-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-xs transition-transform ${expandedMonths.has(month) ? 'rotate-90' : ''}`}>
                            ▶
                          </span>
                          <span className="text-sm font-medium text-stone-700">
                            {formatMonthLabel(month)}
                          </span>
                        </div>
                        <span className="text-xs text-stone-400">{items.length} 条记录</span>
                      </button>
                      {expandedMonths.has(month) && (
                        <div className="divide-y divide-stone-50">
                          {items.map((note) => (
                            <div key={note.id} className="px-4 py-3">
                              <div className="text-xs text-stone-400 mb-1">{note.date}</div>
                              <div className="text-stone-700 whitespace-pre-wrap text-sm">{note.content}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'summary' && <WeeklySummary />}
      {activeTab === 'data' && <DataManager />}
    </main>
  )
}

export default App
