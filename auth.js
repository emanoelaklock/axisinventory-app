/* ═══════════════════════════════════════════════
   Axis Inventory — auth.js
   Autenticação centralizada via Supabase client
═══════════════════════════════════════════════ */

const SURL = 'https://adbskoverysjohhwadln.supabase.co'
const AKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYnNrb3Zlcnlzam9oaHdhZGxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2ODE3NDIsImV4cCI6MjA4OTI1Nzc0Mn0.qP8if_vGdrc0VD9F8dU0fln0MS1AhmwYm5NglTpHQv4'

let _supabase = null
let SESSION = null
let PERFIL = 'Consulta'

// Inicializa o cliente Supabase (lazy)
function getSupabase() {
  if (!_supabase) {
    _supabase = window.supabase.createClient(SURL, AKEY, {
      auth: { persistSession: true, storageKey: 'ax_sess' }
    })
  }
  return _supabase
}

// Utilitários HTTP (fallback para pages que ainda usam fetch direto)
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const hAuth = () => ({
  'apikey': AKEY,
  'Authorization': `Bearer ${SESSION?.access_token}`,
  'Content-Type': 'application/json'
})
const chk401 = r => {
  if (r.status === 401) {
    getSupabase().auth.signOut()
    toast('Sessão expirada.', 'err')
    setTimeout(() => location.href = 'dashboard.html', 1200)
    throw new Error('Sessão expirada')
  }
  return r
}

// Toast global
let _tid = 0
const toast = (msg, tipo = 'info', dur = 4000) => {
  const tc = document.getElementById('tc')
  if (!tc) { console.warn('Toast:', msg); return }
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
  if (btn) { btn.textContent = 'Entrando…'; btn.disabled = true }
  if (msg) msg.innerHTML = ''

  try {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password: senha })
    if (error) throw error
    SESSION = data.session
    await _posLogin(SESSION)
  } catch (e) {
    if (msg) msg.innerHTML = `<div style="padding:9px 12px;background:#FEF2F2;color:#DC2626;border:1px solid #FECACA;border-radius:7px;font-size:13px">${e.message}</div>`
  } finally {
    if (btn) { btn.textContent = 'Entrar'; btn.disabled = false }
  }
}

// Carrega perfil e inicializa UI pós-sessão
const _posLogin = async (session) => {
  SESSION = session

  // Buscar perfil via REST direto (evita depender do cliente JS para queries)
  const r = await fetch(`${SURL}/rest/v1/usuarios?select=perfil,nome&id=eq.${session.user.id}`, {
    headers: hAuth()
  })
  const d = await r.json()
  PERFIL = d[0]?.perfil || 'Consulta'
  const nome = d[0]?.nome || session.user.email?.split('@')[0] || '?'

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

  // Callback da página
  if (typeof onPostLogin === 'function') await onPostLogin()
}

// Logout
const fazerLogout = async () => {
  await getSupabase().auth.signOut()
  SESSION = null; PERFIL = null
  location.href = 'dashboard.html'
}

// Init: verifica sessão existente
const initAuth = async () => {
  const sidebar = document.querySelector('.sidebar')
  if (sidebar) sidebar.style.display = 'none'

  const { data: { session } } = await getSupabase().auth.getSession()

  if (session) {
    await _posLogin(session)
  } else {
    // Sem sessão — mostrar login se existir na página, senão redirecionar
    const loginScreen = document.getElementById('login-screen')
    if (loginScreen) {
      loginScreen.style.display = 'block'
    } else {
      location.href = 'dashboard.html'
    }
  }

  // Reagir a mudanças de sessão (refresh automático de token etc.)
  getSupabase().auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      location.href = 'dashboard.html'
    } else if (event === 'TOKEN_REFRESHED' && session) {
      SESSION = session
    }
  })
}
