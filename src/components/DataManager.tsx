import { useState } from 'react'
import { useAppStore } from '../store/useStore'
import { encryptData, decryptData } from '../utils/crypto'

// 生成随机密码（16 位，包含大小写字母、数字、特殊字符）
function generatePassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

export default function DataManager() {
  const notes = useAppStore((s) => s.notes)
  const loadNotes = useAppStore((s) => s.loadNotes)
  const [status, setStatus] = useState<string>('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleGeneratePassword = () => {
    const newPwd = generatePassword()
    setPassword(newPwd)
    setStatus('🔑 已生成新密码，请妥善保存')
  }

  const handleCopyPassword = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setStatus('📋 密码已复制到剪贴板')
    } catch {
      setStatus('❌ 复制失败，请手动复制')
    }
  }

  const handleExport = async () => {
    if (!password.trim()) {
      setStatus('⚠️ 请生成或输入加密密码')
      return
    }
    try {
      setStatus('🔄 加密中...')
      const json = JSON.stringify(notes)
      const encrypted = await encryptData(json, password)
      
      const blob = new Blob([encrypted], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `shiguang_backup_${new Date().toISOString().split('T')[0]}.sgx`
      a.click()
      URL.revokeObjectURL(url)
      setStatus('✅ 导出成功，请妥善保管密码和备份文件')
    } catch (e) {
      setStatus('❌ 导出失败')
      console.error(e)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !password.trim()) {
      setStatus('⚠️ 请选择文件并输入密码')
      return
    }
    try {
      setStatus('🔄 解密导入中...')
      const text = await file.text()
      const decrypted = await decryptData(text, password)
      const imported = JSON.parse(decrypted)
      
      if (Array.isArray(imported)) {
        // 简单合并逻辑：去重后保存
        const existingIds = new Set(notes.map((n) => n.id))
        const newNotes = imported.filter((n: any) => !existingIds.has(n.id))
        const merged = [...newNotes, ...notes]
        // 更新 store (需直接操作 IndexedDB)
        const { set } = await import('idb-keyval')
        await set('shiGuang_notes', merged)
        await loadNotes()
        setStatus(`✅ 导入成功，新增 ${newNotes.length} 条记录`)
      } else {
        setStatus('❌ 数据格式无效')
      }
    } catch (e: any) {
      setStatus(`❌ ${e.message || '导入失败'}`)
      console.error(e)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-100">
      <h2 className="text-lg font-medium text-stone-700 mb-4">数据管理</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-stone-600 mb-2">加密密码</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="点击生成或手动输入"
                className="w-full px-4 py-2 pr-20 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 font-mono text-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-2 py-1 text-xs text-stone-500 hover:text-stone-700 transition-colors"
                  title={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
                {password && (
                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="px-2 py-1 text-xs text-stone-500 hover:text-stone-700 transition-colors"
                    title="复制密码"
                  >
                    📋
                  </button>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors text-sm font-medium whitespace-nowrap"
            >
              🔑 生成密码
            </button>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            密码仅保存在本地，导出后请妥善保管。建议复制保存至密码管理器。
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={!password.trim()}
            className="flex-1 px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 disabled:opacity-40 transition-colors text-sm"
          >
            导出备份
          </button>
          <label className="flex-1 px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 cursor-pointer text-center text-sm transition-colors">
            导入恢复
            <input type="file" accept=".sgx" onChange={handleImport} className="hidden" />
          </label>
        </div>

        {status && (
          <div className={`text-sm mt-2 p-3 rounded-lg ${
            status.startsWith('✅') ? 'bg-green-50 text-green-700' :
            status.startsWith('❌') || status.startsWith('⚠️') ? 'bg-red-50 text-red-700' :
            'bg-stone-50 text-stone-600'
          }`}>
            {status}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-stone-100 text-xs text-stone-400">
        数据采用 AES-GCM 加密。密码仅存在于您的设备，请勿遗忘。
      </div>
    </div>
  )
}
