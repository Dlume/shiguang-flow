import { useState, useEffect } from 'react'
import { useAppStore } from './store/useStore'
import NoteEditor from './components/NoteEditor'
import WeeklySummary from './components/WeeklySummary'
import DataManager from './components/DataManager'
import { ChevronRight, Home, BarChart3, Database } from 'lucide-react'

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
    const monthKey = note.date.slice(0, 7)
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
    const startMonth = date.getMonth() + 1
    const startDay = date.getDate()
    const endMonth = end.getMonth() + 1
    const endDay = end.getDate()
    return `${startMonth}.${startDay} - ${endMonth}.${endDay}`
  }

  const formatMonthLabel = (month: string) => {
    const [year, m] = month.split('-')
    return `${year}年${parseInt(m)}月`
  }

  const getWeekNumber = (weekStart: string) => {
    const date = new Date(weekStart)
    const startOfYear = new Date(date.getFullYear(), 0, 1)
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
    return Math.ceil((days + startOfYear.getDay() + 1) / 7)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-20 sm:pb-8">
      {/* 头部 - 极简设计 */}
      <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-lg border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white text-lg font-serif">流</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[var(--text-primary)]">拾光·心流</h1>
                <p className="text-xs text-[var(--text-tertiary)]">记录此刻的美好</p>
              </div>
            </div>
            {todayHexagram && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-full">
                <span className="text-base">{todayHexagram.image}</span>
                <span className="text-xs text-[var(--text-secondary)]">{todayHexagram.name}</span>
              </div>
            )}
          </div>
          
          {/* 移动端卦象卡片 */}
          {todayHexagram && (
            <div className="sm:hidden flex items-center gap-2 px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg">
              <span className="text-xl">{todayHexagram.image}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-[var(--text-primary)]">
                  第 {todayHexagram.number} 卦 · {todayHexagram.name}
                </div>
                <div className="text-xs text-[var(--text-tertiary)] truncate">
                  {todayHexagram.judgment}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* 记录页 */}
        {activeTab === 'record' && (
          <div className="space-y-6 animate-fade-in">
            <NoteEditor />
            
            {notes.length > 0 && (
              <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-[var(--shadow-sm)] border border-[var(--border)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                  <h2 className="text-base font-medium text-[var(--text-primary)]">过往拾光</h2>
                  <div className="flex gap-1 bg-[var(--bg-tertiary)] rounded-lg p-0.5">
                    <button
                      onClick={() => setViewMode('week')}
                      className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                        viewMode === 'week'
                          ? 'bg-white text-[var(--text-primary)] shadow-sm'
                          : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                      }`}
                    >
                      按周
                    </button>
                    <button
                      onClick={() => setViewMode('month')}
                      className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                        viewMode === 'month'
                          ? 'bg-white text-[var(--text-primary)] shadow-sm'
                          : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                      }`}
                    >
                      按月
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-[var(--border)]">
                  {viewMode === 'week' ? (
                    weekNotes.map(([week, items]) => (
                      <div key={week} className="group">
                        <button
                          onClick={() => toggleWeek(week)}
                          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center transition-transform ${
                              expandedWeeks.has(week) ? 'rotate-90' : ''
                            }`}>
                              <ChevronRight className="w-3 h-3 text-[var(--text-tertiary)]" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[var(--text-primary)]">
                                第 {getWeekNumber(week)} 周
                              </div>
                              <div className="text-xs text-[var(--text-tertiary)]">
                                {formatWeekLabel(week)}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-full">
                            {items.length} 条
                          </div>
                        </button>
                        
                        {expandedWeeks.has(week) && (
                          <div className="bg-[var(--bg-tertiary)]/50">
                            {items.map((note) => (
                              <div key={note.id} className="px-4 py-3 border-t border-[var(--border)]">
                                <div className="text-xs text-[var(--text-tertiary)] mb-1.5">
                                  {note.date}
                                </div>
                                <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                                  {note.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    monthNotes.map(([month, items]) => (
                      <div key={month} className="group">
                        <button
                          onClick={() => toggleMonth(month)}
                          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center transition-transform ${
                              expandedMonths.has(month) ? 'rotate-90' : ''
                            }`}>
                              <ChevronRight className="w-3 h-3 text-[var(--text-tertiary)]" />
                            </div>
                            <div className="text-sm font-medium text-[var(--text-primary)]">
                              {formatMonthLabel(month)}
                            </div>
                          </div>
                          <div className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-full">
                            {items.length} 条
                          </div>
                        </button>
                        
                        {expandedMonths.has(month) && (
                          <div className="bg-[var(--bg-tertiary)]/50">
                            {items.map((note) => (
                              <div key={note.id} className="px-4 py-3 border-t border-[var(--border)]">
                                <div className="text-xs text-[var(--text-tertiary)] mb-1.5">
                                  {note.date}
                                </div>
                                <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                                  {note.content}
                                </div>
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
          </div>
        )}

        {/* 回顾页 */}
        {activeTab === 'summary' && (
          <div className="animate-fade-in">
            <WeeklySummary />
          </div>
        )}

        {/* 数据页 */}
        {activeTab === 'data' && (
          <div className="animate-fade-in">
            <DataManager />
          </div>
        )}
      </main>

      {/* 底部导航栏 - 移动端优化 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border)] safe-area-bottom sm:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { id: 'record' as Tab, icon: Home, label: '记录' },
            { id: 'summary' as Tab, icon: BarChart3, label: '回顾' },
            { id: 'data' as Tab, icon: Database, label: '数据' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${
                activeTab === tab.id ? 'stroke-[2.5px]' : 'stroke-2'
              }`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 桌面端标签页 */}
      <nav className="hidden sm:flex fixed top-20 right-4 flex-col gap-2 bg-[var(--bg-secondary)] rounded-xl shadow-[var(--shadow-md)] border border-[var(--border)] p-1.5 z-40">
        {[
          { id: 'record' as Tab, icon: Home, label: '记录' },
          { id: 'summary' as Tab, icon: BarChart3, label: '回顾' },
          { id: 'data' as Tab, icon: Database, label: '数据' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
