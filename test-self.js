/**
 * 拾光·心流 - 自测脚本
 * 九子高质量模式 v2.0
 */

import { test } from 'node:test'
import assert from 'node:assert'

// 模拟测试数据
const mockNotes = [
  { id: '1', date: '2026-04-25', content: '今天天气真好，心情愉快', mood: 'happy' },
  { id: '2', date: '2026-04-24', content: '工作有些忙碌，但收获满满', mood: 'busy' },
  { id: '3', date: '2026-04-23', content: '和朋友聚餐，聊得很开心', mood: 'happy' },
  { id: '4', date: '2026-04-22', content: '读了本好书，受益匪浅', mood: 'calm' },
  { id: '5', date: '2026-04-21', content: '下雨天，适合宅在家里', mood: 'relaxed' },
  { id: '6', date: '2026-04-18', content: '周末去爬山，风景很美', mood: 'happy' },
  { id: '7', date: '2026-04-17', content: '项目进度顺利，团队配合默契', mood: 'happy' },
  { id: '8', date: '2026-04-15', content: '感冒了，需要好好休息', mood: 'sick' },
  { id: '9', date: '2026-04-10', content: '新的开始，充满期待', mood: 'hopeful' },
  { id: '10', date: '2026-04-05', content: '清明节，思念故人', mood: 'sad' },
  { id: '11', date: '2026-03-28', content: '春天来了，万物复苏', mood: 'happy' },
  { id: '12', date: '2026-03-15', content: '学习新技能，进步中', mood: 'motivated' },
]

// 测试工具函数
function groupByWeek(notes) {
  const weeks = new Map()
  notes.forEach((note) => {
    const date = new Date(note.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay() + 1)
    const weekKey = weekStart.toISOString().split('T')[0]
    if (!weeks.has(weekKey)) weeks.set(weekKey, [])
    weeks.get(weekKey).push(note)
  })
  return Array.from(weeks.entries()).sort((a, b) => b[0].localeCompare(a[0]))
}

function groupByMonth(notes) {
  const months = new Map()
  notes.forEach((note) => {
    const monthKey = note.date.slice(0, 7)
    if (!months.has(monthKey)) months.set(monthKey, [])
    months.get(monthKey).push(note)
  })
  return Array.from(months.entries()).sort((a, b) => b[0].localeCompare(a[0]))
}

function getWeekNumber(weekStart) {
  const date = new Date(weekStart)
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
  return Math.ceil((days + startOfYear.getDay() + 1) / 7)
}

// 第一轮：基础功能测试
test('第一轮：基础功能测试', async (t) => {
  console.log('\n🧪 第一轮：基础功能测试\n')
  
  await t.test('1.1 按周分组应该正确', () => {
    const weeks = groupByWeek(mockNotes)
    assert.ok(weeks.length > 0, '应该有周数据')
    assert.ok(weeks.every(([_, notes]) => notes.length > 0), '每周应该有记录')
    console.log(`   ✅ 按周分组：${weeks.length} 周，共 ${mockNotes.length} 条记录`)
  })

  await t.test('1.2 按月分组应该正确', () => {
    const months = groupByMonth(mockNotes)
    assert.ok(months.length > 0, '应该有月数据')
    assert.ok(months.every(([_, notes]) => notes.length > 0), '每月应该有记录')
    console.log(`   ✅ 按月分组：${months.length} 月，共 ${mockNotes.length} 条记录`)
  })

  await t.test('1.3 周序号计算应该正确', () => {
    const weeks = groupByWeek(mockNotes)
    const weekNum = getWeekNumber(weeks[0][0])
    assert.ok(weekNum > 0 && weekNum <= 53, '周序号应该在 1-53 之间')
    console.log(`   ✅ 周序号计算：第 ${weekNum} 周`)
  })

  await t.test('1.4 日期格式化应该正确', () => {
    const weeks = groupByWeek(mockNotes)
    const date = new Date(weeks[0][0])
    const end = new Date(date)
    end.setDate(date.getDate() + 6)
    const label = `${date.getMonth() + 1}/${date.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
    assert.ok(label.includes('/'), '日期格式应该包含斜杠')
    assert.ok(label.includes(' - '), '日期范围应该包含分隔符')
    console.log(`   ✅ 日期格式化：${label}`)
  })

  await t.test('1.5 数据排序应该降序', () => {
    const weeks = groupByWeek(mockNotes)
    const months = groupByMonth(mockNotes)
    assert.ok(weeks[0][0] >= weeks[weeks.length - 1][0], '周应该按时间降序')
    assert.ok(months[0][0] >= months[months.length - 1][0], '月应该按时间降序')
    console.log(`   ✅ 数据排序：降序排列`)
  })
})

// 第二轮：边界条件测试
test('第二轮：边界条件测试', async (t) => {
  console.log('\n🧪 第二轮：边界条件测试\n')
  
  await t.test('2.1 空数据应该正确处理', () => {
    const emptyNotes = []
    const weeks = groupByWeek(emptyNotes)
    const months = groupByMonth(emptyNotes)
    assert.strictEqual(weeks.length, 0, '空数据周分组应该为空')
    assert.strictEqual(months.length, 0, '空数据月分组应该为空')
    console.log(`   ✅ 空数据处理：正常`)
  })

  await t.test('2.2 单条数据应该正确处理', () => {
    const singleNote = [{ id: '1', date: '2026-04-25', content: '测试' }]
    const weeks = groupByWeek(singleNote)
    const months = groupByMonth(singleNote)
    assert.strictEqual(weeks.length, 1, '单条数据应该有 1 周')
    assert.strictEqual(months.length, 1, '单条数据应该有 1 月')
    assert.strictEqual(weeks[0][1].length, 1, '该周应该有 1 条记录')
    console.log(`   ✅ 单条数据处理：正常`)
  })

  await t.test('2.3 超长文本应该正确处理', () => {
    const longNote = [{ 
      id: '1', 
      date: '2026-04-25', 
      content: '这是一段非常长的内容。'.repeat(100) 
    }]
    assert.ok(longNote[0].content.length > 1000, '内容应该超过 1000 字')
    const weeks = groupByWeek(longNote)
    assert.strictEqual(weeks[0][1][0].content, longNote[0].content, '长文本应该完整保留')
    console.log(`   ✅ 超长文本处理：正常 (${longNote[0].content.length} 字)`)
  })

  await t.test('2.4 特殊字符应该正确处理', () => {
    const specialNote = [{ 
      id: '1', 
      date: '2026-04-25', 
      content: '测试特殊字符：!@#$%^&*()_+-=[]{}|;:\'",.<>?/`~ 中文 emoji 🎉' 
    }]
    const weeks = groupByWeek(specialNote)
    assert.ok(weeks[0][1][0].content.includes('🎉'), 'emoji 应该正常保留')
    assert.ok(weeks[0][1][0].content.includes('!@#$'), '特殊字符应该正常保留')
    console.log(`   ✅ 特殊字符处理：正常`)
  })

  await t.test('2.5 跨月数据应该正确处理', () => {
    const crossMonthNotes = [
      { id: '1', date: '2026-03-31', content: '3 月' },
      { id: '2', date: '2026-04-01', content: '4 月' },
    ]
    const months = groupByMonth(crossMonthNotes)
    assert.strictEqual(months.length, 2, '应该分为 2 个月')
    console.log(`   ✅ 跨月数据处理：正常`)
  })
})

// 第三轮：性能测试
test('第三轮：性能测试', async (t) => {
  console.log('\n🧪 第三轮：性能测试\n')
  
  // 生成大量测试数据
  const largeNotes = []
  for (let i = 0; i < 1000; i++) {
    const date = new Date(2026, 0, 1)
    date.setDate(date.getDate() + i)
    largeNotes.push({
      id: `${i}`,
      date: date.toISOString().split('T')[0],
      content: `测试内容 ${i}`.repeat(10)
    })
  }

  await t.test('3.1 1000 条数据分组性能', () => {
    const startTime = Date.now()
    const weeks = groupByWeek(largeNotes)
    const months = groupByMonth(largeNotes)
    const endTime = Date.now()
    const duration = endTime - startTime
    
    assert.ok(duration < 100, `分组应该在 100ms 内完成，实际 ${duration}ms`)
    assert.ok(weeks.length > 0, '应该有周数据')
    assert.ok(months.length > 0, '应该有月数据')
    console.log(`   ✅ 1000 条数据分组：${duration}ms`)
  })

  await t.test('3.2 周序号计算性能', () => {
    const weeks = groupByWeek(largeNotes)
    const startTime = Date.now()
    weeks.forEach(([week]) => getWeekNumber(week))
    const duration = Date.now() - startTime
    
    assert.ok(duration < 50, `计算应该在 50ms 内完成，实际 ${duration}ms`)
    console.log(`   ✅ 周序号计算：${duration}ms (${weeks.length} 周)`)
  })

  await t.test('3.3 日期格式化性能', () => {
    const weeks = groupByWeek(largeNotes)
    const startTime = Date.now()
    weeks.forEach(([week]) => {
      const date = new Date(week)
      const end = new Date(date.getTime())
      const result = end.setDate(date.getDate() + 6)
      const label = `${date.getMonth() + 1}/${date.getDate()} - ${new Date(result).getMonth() + 1}/${new Date(result).getDate()}`
    })
    const duration = Date.now() - startTime
    
    assert.ok(duration < 50, `格式化应该在 50ms 内完成，实际 ${duration}ms`)
    console.log(`   ✅ 日期格式化：${duration}ms`)
  })

  await t.test('3.4 内存使用应该合理', () => {
    const beforeMem = process.memoryUsage()
    const weeks = groupByWeek(largeNotes)
    const months = groupByMonth(largeNotes)
    const afterMem = process.memoryUsage()
    const heapUsedDiff = afterMem.heapUsed - beforeMem.heapUsed
    
    assert.ok(heapUsedDiff < 10 * 1024 * 1024, `内存增长应该小于 10MB，实际 ${Math.round(heapUsedDiff / 1024 / 1024 * 100) / 100}MB`)
    console.log(`   ✅ 内存使用：+${Math.round(heapUsedDiff / 1024 / 1024 * 100) / 100}MB`)
  })
})

// 运行测试
console.log('═══════════════════════════════════════════════')
console.log('  拾光·心流 v2.0 - 九子高质量模式自测')
console.log('═══════════════════════════════════════════════')
