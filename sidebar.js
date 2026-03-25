/* ═══════════════════════════════════════════════
   Axis Inventory — sidebar.js
   HTML da sidebar + toggle + submenus
═══════════════════════════════════════════════ */

function renderSidebar(paginaAtiva) {
  const container = document.getElementById('sidebar-container')
  if (!container) return

  const isChk = paginaAtiva === 'checklists' || paginaAtiva === 'checklists-inspecao'

  const SVG = {
    dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    equip:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    mov:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    chk:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    sub:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
    modelos:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    empresas:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    resp:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    users:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    inspec:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    devol:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg>`,
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

    <a class="sb-item${a==='dashboard'?' on':''}" href="dashboard.html">
      ${SVG.dashboard}<span class="sb-label">Dashboard</span>
    </a>
    <a class="sb-item${a==='equipamentos'?' on':''}" href="lista-itens.html">
      ${SVG.equip}<span class="sb-label">Equipamentos</span>
    </a>

    <div class="sb-section">Registros</div>

    <a class="sb-item${a==='movimentacoes'?' on':''}" href="movimentacoes.html">
      ${SVG.mov}<span class="sb-label">Movimentações</span>
    </a>

    <!-- Checklists com submenu -->
    <button class="sb-item sb-item-parent${isChk?' on':''}" onclick="toggleSubmenu('sub-chk',this)">
      ${SVG.chk}
      <span class="sb-label">Checklists</span>
      <svg class="sb-chevron${isChk?' open':''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:10px;height:10px;margin-left:auto;flex-shrink:0;transition:transform .2s"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div class="sb-submenu${isChk?' open':''}" id="sub-chk">
      <a class="sb-subitem${a==='checklists-inspecao'?' on':''}" href="checklists.html">
        ${SVG.inspec}<span class="sb-label">Inspeção</span>
      </a>
      <a class="sb-subitem${a==='checklists-devolucao'?' on':''}" href="checklist-devolucao.html" target="_blank">
        ${SVG.devol}<span class="sb-label">Devolução</span>
      </a>
    </div>

    <div class="sb-section">Cadastros</div>

    <a class="sb-item${a==='modelos'?' on':''}" href="modelos.html">
      ${SVG.modelos}<span class="sb-label">Modelos</span>
    </a>
    <a class="sb-item${a==='empresas'?' on':''}" href="clientes.html">
      ${SVG.empresas}<span class="sb-label">Empresas</span>
    </a>
    <a class="sb-item${a==='responsaveis'?' on':''}" href="responsaveis.html">
      ${SVG.resp}<span class="sb-label">Responsáveis</span>
    </a>

    <div class="sb-section">Sistema</div>

    <a class="sb-item${a==='usuarios'?' on':''}" href="configuracoes.html">
      ${SVG.users}<span class="sb-label">Usuários</span>
    </a>

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

// Toggle submenu
function toggleSubmenu(id, btn) {
  const sub = document.getElementById(id)
  if (!sub) return
  const isOpen = sub.classList.contains('open')
  sub.classList.toggle('open', !isOpen)
  const chev = btn.querySelector('.sb-chevron')
  if (chev) chev.classList.toggle('open', !isOpen)
}

// Toggle colapso da sidebar
let _sidebarCollapsed = false
function toggleSidebar() {
  _sidebarCollapsed = !_sidebarCollapsed
  document.getElementById('sidebar').classList.toggle('collapsed', _sidebarCollapsed)
  const a = document.getElementById('sb-arrow')
  if (a) a.innerHTML = _sidebarCollapsed
    ? '<polyline points="9 18 15 12 9 6"/>'
    : '<polyline points="15 18 9 12 15 6"/>'
}
