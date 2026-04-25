import { useState } from 'react'
import { useAppStore } from '../store/useStore'
import { encryptData, decryptData } from '../utils/crypto'
import { Database, Download, Upload, Copy, Eye, EyeOff, Sparkles, Shield } from 'lucide-react'

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
    setStatus('🔑 已生成新密码')
    setTimeout(() => setStatus(''), 3000)
  }

  const handleCopyPassword = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setStatus('📋 已复制')
      setTimeout(() => setStatus(''), 2000)
    } catch {
      setStatus('❌ 复制失败')
      setTimeout(() => setStatus(''), 2000)
    }
  }

  const handleExport = async () => {
    if (!password.trim()) {
      setStatus('⚠️ 请先生成密码')
      setTimeout(() => setStatus(''), 2000)
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
      setStatus('✅ 导出成功')
      setTimeout(() => setStatus(''), 3000)
    } catch (e) {
      setStatus('❌ 导出失败')
      setTimeout(() => setStatus(''), 3000)
      console.error(e)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !password.trim()) {
      setStatus('⚠️ 请选择文件并输入密码')
      setTimeout(() => setStatus(''), 2000)
      return
    }
    try {
      setStatus('🔄 解密中...')
      const text = await file.text()
      const decrypted = await decryptData(text, password)
      const imported = JSON.parse(decrypted)
      
      if (Array.isArray(imported)) {
        const existingIds = new Set(notes.map((n) => n.id))
        const newNotes = imported.filter((n: any) => !existingIds.has(n.id))
        const merged = [...newNotes, ...notes]
        const { set } = await import('idb-keyval')
        await set('shiGuang_notes', merged)
        await loadNotes()
        setStatus(`✅ 导入 ${newNotes.length} 条`)
        setTimeout(() => setStatus(''), 3000)
      } else {
        setStatus('❌ 格式无效')
        setTimeout(() => setStatus(''), 2000)
      }
    } catch (err: any) {
      setStatus('❌ 密码错误')
      setTimeout(() => setStatus(''), 3000)
      console.error(err)
    }
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-[var(--shadow-md)] border border-[var(--border)] overflow-hidden">
      <div className="relative h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
      
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center">
            <Database className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <h2 className="text-base font-medium text-[var(--text-primary)]">数据管理</h2>
        </div>

        {/* 密码区域 */}
        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Shield className="w-4 h-4" />
            <span>加密保护</span>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="生成或输入密码"
                className="w-full px-4 py-2.5 pr-20 rounded-xl bg-white border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all text-sm font-mono"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-1">
                {password && (
                  <button
                    onClick={handleCopyPassword}
                    className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                    title="复制"
                  >
                    <Copy className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                  </button>
                )}
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                  title={showPassword ? '隐藏' : '显示'}
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                  )}
                </button>
              </div>
            </div>
            <button
              onClick={handleGeneratePassword}
              className="px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">生成</span>
            </button>
          </div>
          
          <div className="text-xs text-[var(--text-tertiary)] leading-relaxed">
            密码仅保存在本地，导出后请妥善保管。建议使用密码管理器保存。
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleExport}
            disabled={!password.trim()}
            className="group relative px-4 py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-xl overflow-hidden transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              <span>导出</span>
            </div>
          </button>
          
          <label className="group relative px-4 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-sm font-medium rounded-xl overflow-hidden transition-all hover:shadow-md active:scale-[0.98] cursor-pointer">
            <div className="flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              <span>导入</span>
            </div>
            <input type="file" accept=".sgx" onChange={handleImport} className="hidden" />
          </label>
        </div>

        {/* 状态提示 */}
        {status && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium animate-slide-up ${
            status.startsWith('✅') ? 'bg-green-50 text-green-700' :
            status.startsWith('❌') || status.startsWith('⚠️') ? 'bg-red-50 text-red-700' :
            'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
          }`}>
            {status}
          </div>
        )}

        {/* 安全提示 */}
        <div className="pt-4 border-t border-[var(--border)]">
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5 flex-shrink-0" />
            <div className="text-xs text-[var(--text-tertiary)] leading-relaxed">
              数据采用 AES-GCM 加密，密码仅存在于您的设备。请定期备份重要数据。
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
