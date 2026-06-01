const fallbackRequests = [
  { initials:'EM', name:'Equipe Martins', subject:'Acesso à área técnica', preview:'Chegamos na obra, mas o acesso ainda...', time:'09:42', fresh:true, unread:2, tag:'ACESSO', priority:'medium', active:true, color:'#2f9c76' },
  { initials:'CS', name:'Carlos Souza', subject:'Divergência no projeto', preview:'A medida que consta na planta não...', time:'09:18', unread:1, tag:'PROJETO', priority:'high', color:'#7187b7' },
  { initials:'RE', name:'RF Esquadrias', subject:'Reagendamento de entrega', preview:'Precisamos alterar a data de entrega...', time:'Ontem', tag:'ENTREGA', priority:'medium', color:'#ae7f62' },
  { initials:'JP', name:'João Pedro', subject:'Material não recebido', preview:'O lote de ferragens da torre 2 ainda...', time:'Ontem', tag:'MATERIAL', priority:'high', color:'#5e9ea3' },
  { initials:'MA', name:'Montagem Alfa', subject:'Envio de documentação', preview:'Seguem os documentos dos novos...', time:'12 mai', tag:'DOCUMENTOS', priority:'low', color:'#947cb6' },
  { initials:'AV', name:'André Vieira', subject:'Finalização da OS #4798', preview:'Serviço concluído. Fotos anexadas...', time:'12 mai', tag:'CONCLUSÃO', priority:'low', color:'#b48c54' },
  { initials:'FE', name:'Ferraz Engenharia', subject:'Solicitação de vistoria', preview:'Podemos agendar a vistoria final...', time:'11 mai', tag:'VISTORIA', priority:'low', color:'#617eab' }
];

let requests = fallbackRequests;
let activeFilter = 'all';
const requestList = document.querySelector('#request-list');
const search = document.querySelector('#request-search');
const modal = document.querySelector('#access-modal');
const toast = document.querySelector('#toast');

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[character]));

const DEMO_STORAGE_KEY = 'montia-demo-state';
const useBrowserStorage = !['localhost', '127.0.0.1'].includes(window.location.hostname);

function cloneFallbackState() {
  return { requests:fallbackRequests, messages:[], accesses:[] };
}

function readBrowserState() {
  const saved = localStorage.getItem(DEMO_STORAGE_KEY);
  return saved ? JSON.parse(saved) : cloneFallbackState();
}

function writeBrowserState(state) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
}

function browserApi(path, options = {}) {
  const state = readBrowserState();
  const payload = options.body ? JSON.parse(options.body) : {};
  if (path === '/api/state') return state;
  if (path === '/api/messages') {
    const content = String(payload.content || '').trim();
    if (!content) throw new Error('Digite uma mensagem antes de enviar');
    const message = { content:content.slice(0, 1000), created_at:new Date().toISOString() };
    state.messages.push(message);
    writeBrowserState(state);
    return message;
  }
  if (path === '/api/accesses') {
    const area = String(payload.area || '').trim();
    const validity = String(payload.validity || '').trim();
    if (!area || !validity) throw new Error('Informe a área permitida e a validade');
    const access = { area:area.slice(0, 100), validity:validity.slice(0, 100), team:'Equipe Martins', created_at:new Date().toISOString() };
    state.accesses.push(access);
    writeBrowserState(state);
    return access;
  }
  throw new Error('Operação indisponível');
}

async function api(path, options = {}) {
  if (useBrowserStorage) return browserApi(path, options);
  const response = await fetch(path, { headers:{ 'Content-Type':'application/json' }, ...options });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Não foi possível concluir a operação');
  return payload;
}

function renderRequests(filter = activeFilter, query = search.value) {
  const normalized = query.toLowerCase();
  requestList.innerHTML = requests.filter(item => {
    const matchesText = `${item.name} ${item.subject} ${item.preview}`.toLowerCase().includes(normalized);
    const matchesFilter = filter === 'all' || (filter === 'priority' && item.priority !== 'low') || (filter === 'pending' && item.unread);
    return matchesText && matchesFilter;
  }).map(item => `
    <article class="request-item ${item.active ? 'active' : ''}" tabindex="0">
      <div class="request-item-top">
        <div class="avatar" style="background:${escapeHtml(item.color)}">${escapeHtml(item.initials)}</div>
        <div class="request-copy">
          <div class="request-title"><strong>${escapeHtml(item.name)}</strong><time class="${item.fresh ? 'fresh' : ''}">${escapeHtml(item.time)}</time></div>
          <p><strong>${escapeHtml(item.subject)}</strong> · ${escapeHtml(item.preview)}</p>
        </div>
      </div>
      <div class="request-bottom"><span class="mini-tag">${escapeHtml(item.tag)}</span>${item.priority !== 'low' ? `<span class="priority-dot ${escapeHtml(item.priority)}"></span>` : ''}${item.unread ? `<span class="unread">${escapeHtml(item.unread)}</span>` : ''}</div>
    </article>`).join('');
}

function appendSentMessage(message) {
  const article = document.createElement('article');
  article.className = 'message incoming';
  article.style.marginLeft = 'auto';
  article.innerHTML = `<div><div class="bubble" style="background:#e9f7f1"><p>${escapeHtml(message.content)}</p></div><time style="text-align:right">enviada</time></div>`;
  document.querySelector('#messages').append(article);
}

function showAccess(access) {
  document.querySelector('.access-warning').innerHTML = `<svg><use href="#icon-check"></use></svg><div><strong>Acesso temporário liberado</strong><p>${escapeHtml(access.validity)} · ${escapeHtml(access.area)}</p></div>`;
  document.querySelector('.access-warning').style.background = '#e9f7f1';
  document.querySelector('.access-warning').style.color = '#147856';
  document.querySelector('#request-access').innerHTML = '<svg><use href="#icon-shield"></use></svg>Atualizar liberação';
}

function showToast(title, message) {
  toast.querySelector('strong').textContent = title;
  toast.querySelector('p').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4200);
}

async function hydrate() {
  try {
    const state = await api('/api/state');
    requests = state.requests;
    state.messages.forEach(appendSentMessage);
    if (state.accesses.length) showAccess(state.accesses.at(-1));
    renderRequests();
  } catch (error) {
    renderRequests();
    showToast('Modo de visualização', 'Abra pelo arquivo iniciar para salvar seus dados.');
  }
}

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelector('.tab.active').classList.remove('active');
  tab.classList.add('active');
  activeFilter = tab.dataset.filter;
  renderRequests();
}));
search.addEventListener('input', () => renderRequests());

document.querySelector('#request-access').addEventListener('click', () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
});
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
document.querySelector('.modal-close').addEventListener('click', closeModal);
document.querySelector('.cancel-access').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

document.querySelector('.confirm-access').addEventListener('click', async () => {
  try {
    const access = await api('/api/accesses', { method:'POST', body:JSON.stringify({ area:document.querySelector('#access-area').value, validity:document.querySelector('#access-validity').value }) });
    closeModal();
    showAccess(access);
    showToast('Acesso liberado com sucesso', 'A equipe foi notificada e recebeu os QR Codes.');
  } catch (error) { showToast('Não foi possível liberar', error.message); }
});

document.querySelector('.approve-ai').addEventListener('click', event => {
  event.target.closest('.ai-message').querySelector('.ai-buttons').innerHTML = '<span class="mini-tag">✓ RESPOSTA ENVIADA</span>';
  setTimeout(() => document.querySelector('.second-message').classList.remove('hidden'), 550);
});

document.querySelector('.edit-ai').addEventListener('click', () => {
  const composer = document.querySelector('#composer-text');
  composer.value = 'Olá, Eduardo! Identifiquei que sua equipe está vinculada à OS #4821. Posso solicitar uma liberação temporária para a área técnica do Bloco B agora. Deseja prosseguir?';
  composer.focus();
});

document.querySelector('.send-button').addEventListener('click', async () => {
  const composer = document.querySelector('#composer-text');
  if (!composer.value.trim()) return;
  try {
    const message = await api('/api/messages', { method:'POST', body:JSON.stringify({ content:composer.value }) });
    appendSentMessage(message);
    composer.value = '';
    document.querySelector('#messages').lastElementChild.scrollIntoView({ behavior:'smooth' });
  } catch (error) { showToast('Mensagem não enviada', error.message); }
});

hydrate();
