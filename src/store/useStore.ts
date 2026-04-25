import { create } from 'zustand'
import { get as idbGet, set as idbSet } from 'idb-keyval'

interface Note {
  id: string
  date: string
  content: string
  mood?: string
}

interface Hexagram {
  number: number
  name: string
  image: string
  judgment: string
  meaning: string
}

interface AppState {
  notes: Note[]
  todayHexagram: Hexagram | null
  addNote: (note: Omit<Note, 'id' | 'date'>) => void
  loadNotes: () => Promise<void>
  setTodayHexagram: (hex: Hexagram) => void
}

// 简易 64 卦数据 (示例截取前 8 卦，实际项目需补全)
const HEXAGRAMS: Hexagram[] = [
  { number: 1, name: '乾', image: '䷀', judgment: '元亨利贞', meaning: '天行健，君子以自强不息。今日宜主动破局，顺势而为。' },
  { number: 2, name: '坤', image: '䷁', judgment: '元亨，利牝马之贞', meaning: '地势坤，君子以厚德载物。今日宜包容沉淀，静待时机。' },
  { number: 3, name: '屯', image: '䷂', judgment: '元亨利贞，勿用有攸往', meaning: '云雷屯，君子以经纶。万事开头难，坚持即有转机。' },
  { number: 4, name: '蒙', image: '䷃', judgment: '亨。匪我求童蒙，童蒙求我', meaning: '山下出泉，蒙。今日宜虚心求教，保持好奇与开放。' },
  { number: 5, name: '需', image: '䷄', judgment: '有孚，光亨，贞吉', meaning: '云上于天，需。君子以饮食宴乐。耐心等待，时机将至。' },
  { number: 6, name: '讼', image: '䷅', judgment: '有孚窒惕，中吉，终凶', meaning: '天与水违行，讼。今日宜退让自省，避免争执，内求平衡。' },
  { number: 7, name: '师', image: '䷆', judgment: '贞，丈人吉，无咎', meaning: '地中有水，师。君子以容民畜众。今日宜专注目标，稳扎稳打。' },
  { number: 8, name: '比', image: '䷇', judgment: '吉。原筮元永贞，无咎', meaning: '地上有水，比。君子以建万国，亲诸侯。今日宜联结他人，互助共生。' },
]

// 根据日期生成伪随机卦象 (每日固定)
function getDailyHexagram(): Hexagram {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const index = seed % HEXAGRAMS.length
  return HEXAGRAMS[index]
}

export const useAppStore = create<AppState>((set) => ({
  notes: [],
  todayHexagram: getDailyHexagram(),

  addNote: async (noteData) => {
    const newNote: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
    }
    set((state) => {
      const updated = [newNote, ...state.notes]
      idbSet('shiGuang_notes', updated).catch(console.error)
      return { notes: updated }
    })
  },

  loadNotes: async () => {
    try {
      const saved = await idbGet('shiGuang_notes')
      if (saved) set({ notes: saved })
    } catch (e) {
      console.warn('IndexedDB load failed', e)
    }
  },

  setTodayHexagram: (hex) => set({ todayHexagram: hex }),
}))