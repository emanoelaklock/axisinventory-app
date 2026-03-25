/* ═══════════════════════════════════════════════
   Axis Inventory — sidebar.js
   HTML da sidebar + toggle
═══════════════════════════════════════════════ */

// Renderiza a sidebar no elemento #sidebar-container
// Parâmetro: página ativa ('dashboard','equipamentos','movimentacoes',etc.)
function renderSidebar(paginaAtiva = '') {
  const container = document.getElementById('sidebar-container')
  if (!container) return

  const item = (href, svg, label, ativo) => `
    <a class="sb-item${ativo ? ' on' : ''}" href="${href}">
      ${svg}
      <span class="sb-label">${label}</span>
    </a>`

  const SVG = {
    dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    equip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    mov: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    chk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    modelos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    empresas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    resp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  }

  const a = paginaAtiva

  container.innerHTML = `
    <aside class="sidebar" id="sidebar">
      <button class="sb-toggle" onclick="toggleSidebar()" title="Expandir/recolher">
        <svg id="sb-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="sb-brand">
        <div class="sb-logo-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <div>
          <div class="sb-brand-text">Axis Inventory</div>
          <div class="sb-brand-sub">Gestão de equipamentos</div>
        </div>
      </div>
      <nav class="sb-nav">
        ${item('dashboard.html', SVG.dashboard, 'Dashboard', a==='dashboard')}
        ${item('lista-itens.html', SVG.equip, 'Equipamentos', a==='equipamentos')}
        <div class="sb-section">Registros</div>
        ${item('movimentacoes.html', SVG.mov, 'Movimentações', a==='movimentacoes')}
        ${item('checklists.html', SVG.chk, 'Checklists', a==='checklists')}
        <div class="sb-section">Cadastros</div>
        ${item('modelos.html', SVG.modelos, 'Modelos', a==='modelos')}
        ${item('clientes.html', SVG.empresas, 'Empresas', a==='empresas')}
        ${item('responsaveis.html', SVG.resp, 'Responsáveis', a==='responsaveis')}
        <div class="sb-section">Sistema</div>
        ${item('configuracoes.html', SVG.users, 'Usuários', a==='usuarios')}
      </nav>
      <div class="sb-bottom">
        <div class="sb-user" onclick="fazerLogout()" title="Sair">
          <div class="sb-avatar" id="sb-avatar">—</div>
          <div class="sb-user-info">
            <div class="sb-user-name" id="sb-user-name">—</div>
            <div class="sb-user-role" id="sb-user-role">—</div>
          </div>
        </div>
      </div>
    </aside>`
}

// Toggle colapso
let _sidebarCollapsed = false
function toggleSidebar() {
  _sidebarCollapsed = !_sidebarCollapsed
  document.getElementById('sidebar').classList.toggle('collapsed', _sidebarCollapsed)
  const a = document.getElementById('sb-arrow')
  if (a) a.innerHTML = _sidebarCollapsed
    ? '<polyline points="9 18 15 12 9 6"/>'
    : '<polyline points="15 18 9 12 15 6"/>'
}
