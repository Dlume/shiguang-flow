/**
 * 轻量级加密工具 (Web Crypto API)
 * 使用 PBKDF2 + AES-GCM 进行数据加解密
 */

const ALGO = 'AES-GCM'
const KEY_LEN = 256

function getPasswordKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
}

function deriveKey(passwordKey: CryptoKey, salt: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: 100000, hash: 'SHA-256' },
    passwordKey,
    { name: ALGO, length: KEY_LEN },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptData(data: string, password: string): Promise<string> {
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const passwordKey = await getPasswordKey(password)
  const key = await deriveKey(passwordKey, salt)
  const encrypted = await crypto.subtle.encrypt({ name: ALGO, iv }, key, enc.encode(data))
  
  // 组合 salt + iv + ciphertext
  const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
  result.set(salt, 0)
  result.set(iv, salt.length)
  result.set(new Uint8Array(encrypted), salt.length + iv.length)
  
  // 转为 Base64
  return btoa(String.fromCharCode(...result))
}

export async function decryptData(encryptedB64: string, password: string): Promise<string> {
  const dec = new TextDecoder()
  const data = Uint8Array.from(atob(encryptedB64), c => c.charCodeAt(0))
  
  const salt = data.slice(0, 16)
  const iv = data.slice(16, 28)
  const ciphertext = data.slice(28)
  
  const passwordKey = await getPasswordKey(password)
  const key = await deriveKey(passwordKey, salt)
  
  try {
    const decrypted = await crypto.subtle.decrypt({ name: ALGO, iv }, key, ciphertext)
    return dec.decode(decrypted)
  } catch {
    throw new Error('密码错误或数据已损坏')
  }
}