/* ═══════════════════════════════════════════════
   Axis Inventory — auth.js
   Autenticação centralizada via Supabase client
═══════════════════════════════════════════════ */

const SURL = 'https://adbskoverysjohhwadln.supabase.co'
const AKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYnNrb3Zlcnlzam9oaHdhZGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODE3NDIsImV4cCI6MjA4OTI1Nzc0Mn0.qP8if_vGdrc0VD9F8dU0fln0MS1AhmwYm5NglTpHQv4'

// Inicializa o cliente Supabase (persistSession habilitado por padrão)
const supabase = window.supabase.createClient(SURL, AKEY, {
  auth: { persistSession: true, storageKey: 'ax_sess' }
})

// Estado global
let SESSION = null
let PERFIL = 'Consulta'

// Utilitários
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const hAuth = () => ({
  'apikey': AKEY,
  'Authorization': `Bearer ${SESSION?.access_token}`,
  'Content-Type': 'application/json'
})

// Intercepta 401 e redireciona para login
const chk401 = r => {
  if (r.status === 401) {
    supabase.auth.signOut()
    toast('Sessão expirada. Faça login novamente.', 'err')
    setTimeout(() => location.href = 'dashboard.html', 1200)
    throw new Error('Sessão expirada')
  }
  return r
}

// Toast global
let _tid = 0
const toast = (msg, tipo = 'info', dur = 4000) => {
  const tc = document.getElementById('tc') || document.getElementById('toast-c')
  if (!tc) return
  const el = document.createElement('div')
  el.className = `toast ${tipo}`
  el.innerHTML = `<span>${esc(msg)}</span>`
  el.id = `t${++_tid}`
  tc.appendChild(el)
  setTimeout(() => el.remove(), dur)
}

// Login com email/senha
const fazerLogin = async () => {
  const email = document.getElementById('l-email')?.value.trim()
  const senha = document.getElementById('l-senha')?.value
  const btn = document.getElementById('btn-login')
  const msg = document.getElementById('login-msg')

  if (!email || !senha) { toast('Preencha email e senha.', 'err'); return }
  btn.textContent = 'Entrando…'; btn.disabled = true
  if (msg) msg.innerHTML = ''

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) throw error
    SESSION = data.session
    await posLogin()
  } catch (e) {
    if (msg) msg.innerHTML = `<div style="padding:9px 12px;background:#FEF2F2;color:#DC2626;border:1px solid #FECACA;border-radius:7px;font-size:13px">${e.message}</div>`
  } finally {
    btn.textContent = 'Entrar'; btn.disabled = false
  }
}

// Pós-login: carrega perfil e inicializa sidebar
const posLogin = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) { location.href = 'dashboard.html'; return }
  SESSION = session

  const { data } = await supabase
    .from('usuarios')
    .select('perfil,nome')
    .eq('id', session.user.id)
    .single()

  PERFIL = data?.perfil || 'Consulta'
  const nome = data?.nome || session.user.email?.split('@')[0] || '?'

  // Atualiza sidebar
  const avatar = document.getElementById('sb-avatar')
  const userName = document.getElementById('sb-user-name')
  const userRole = document.getElementById('sb-user-role')
  if (avatar) avatar.textContent = nome[0].toUpperCase()
  if (userName) userName.textContent = nome
  if (userRole) userRole.textContent = PERFIL

  // Mostra UI
  const sidebar = document.querySelector('.sidebar')
  const loginScreen = document.getElementById('login-screen')
  const appScreen = document.getElementById('app-screen') || document.getElementById('app')

  if (sidebar) sidebar.style.display = 'flex'
  if (loginScreen) loginScreen.style.display = 'none'
  if (appScreen) appScreen.style.display = 'block'

  // Callback da página (ex: carregarItens, carregarDashboard)
  if (typeof onPostLogin === 'function') await onPostLogin()
}

// Logout
const fazerLogout = async () => {
  await supabase.auth.signOut()
  SESSION = null; PERFIL = null
  location.href = 'dashboard.html'
}

// Init: verifica sessão existente
const initAuth = async (redirectIfNoSession = true) => {
  const sidebar = document.querySelector('.sidebar')
  if (sidebar) sidebar.style.display = 'none'

  // Supabase restaura sessão automaticamente do storage
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    SESSION = session
    await posLogin()
  } else if (redirectIfNoSession) {
    // Sem sessão → login no dashboard
    const loginScreen = document.getElementById('login-screen')
    if (loginScreen) {
      loginScreen.style.display = 'block'
    } else {
      location.href = 'dashboard.html'
    }
  }

  // Escuta mudanças de sessão (refresh automático do token etc.)
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      location.href = 'dashboard.html'
    } else if (event === 'TOKEN_REFRESHED' && session) {
      SESSION = session
    }
  })
}
