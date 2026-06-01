const requests = [
  { initials:'EM', name:'Equipe Martins', subject:'Acesso à área técnica', preview:'Chegamos na obra, mas o acesso ainda...', time:'09:42', fresh:true, unread:2, tag:'ACESSO', priority:'medium', active:true, color:'#2f9c76' },
  { initials:'CS', name:'Carlos Souza', subject:'Divergência no projeto', preview:'A medida que consta na planta não...', time:'09:18', unread:1, tag:'PROJETO', priority:'high', color:'#7187b7' },
  { initials:'RE', name:'RF Esquadrias', subject:'Reagendamento de entrega', preview:'Precisamos alterar a data de entrega...', time:'Ontem', tag:'ENTREGA', priority:'medium', color:'#ae7f62' },
  { initials:'JP', name:'João Pedro', subject:'Material não recebido', preview:'O lote de ferragens da torre 2 ainda...', time:'Ontem', tag:'MATERIAL', priority:'high', color:'#5e9ea3' },
  { initials:'MA', name:'Montagem Alfa', subject:'Envio de documentação', preview:'Seguem os documentos dos novos...', time:'12 mai', tag:'DOCUMENTOS', priority:'low', color:'#947cb6' },
  { initials:'AV', name:'André Vieira', subject:'Finalização da OS #4798', preview:'Serviço concluído. Fotos anexadas...', time:'12 mai', tag:'CONCLUSÃO', priority:'low', color:'#b48c54' },
  { initials:'FE', name:'Ferraz Engenharia', subject:'Solicitação de vistoria', preview:'Podemos agendar a vistoria final...', time:'11 mai', tag:'VISTORIA', priority:'low', color:'#617eab' }
];

const requestList = document.querySelector('#request-list');
const search = document.querySelector('#request-search');
const modal = document.querySelector('#access-modal');
const toast = document.querySelector('#toast');

function renderRequests(filter = 'all', query = '') {
  const normalized = query.toLowerCase();
  requestList.innerHTML = requests.filter(item => {
    const matchesText = `${item.name} ${item.subject} ${item.preview}`.toLowerCase().includes(normalized);
    const matchesFilter = filter === 'all' || (filter === 'priority' && item.priority !== 'low') || (filter === 'pending' && item.unread);
    return matchesText && matchesFilter;
  }).map(item => `
    <article class="request-item ${item.active ? 'active' : ''}" tabindex="0">
      <div class="request-item-top">
        <div class="avatar" style="background:${item.color}">${item.initials}</div>
        <div class="request-copy">
          <div class="request-title"><strong>${item.name}</strong><time class="${item.fresh ? 'fresh' : ''}">${item.time}</time></div>
          <p><strong>${item.subject}</strong> · ${item.preview}</p>
        </div>
      </div>
      <div class="request-bottom"><span class="mini-tag">${item.tag}</span>${item.priority !== 'low' ? `<span class="priority-dot ${item.priority}"></span>` : ''}${item.unread ? `<span class="unread">${item.unread}</span>` : ''}</div>
    </article>`).join('');
}

renderRequests();

let activeFilter = 'all';
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelector('.tab.active').classList.remove('active');
  tab.classList.add('active');
  activeFilter = tab.dataset.filter;
  renderRequests(activeFilter, search.value);
}));
search.addEventListener('input', event => renderRequests(activeFilter, event.target.value));

document.querySelector('#request-access').addEventListener('click', () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
});
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
document.querySelector('.modal-close').addEventListener('click', closeModal);
document.querySelector('.cancel-access').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

document.querySelector('.confirm-access').addEventListener('click', () => {
  closeModal();
  document.querySelector('.access-warning').innerHTML = '<svg><use href="#icon-check"></use></svg><div><strong>Acesso temporário liberado</strong><p>Válido hoje até 18:00 · Área técnica do Bloco B</p></div>';
  document.querySelector('.access-warning').style.background = '#e9f7f1';
  document.querySelector('.access-warning').style.color = '#147856';
  const button = document.querySelector('#request-access');
  button.innerHTML = '<svg><use href="#icon-shield"></use></svg>Ver histórico de acessos';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4200);
});

document.querySelector('.approve-ai').addEventListener('click', event => {
  const card = event.target.closest('.ai-message');
  card.querySelector('.ai-buttons').innerHTML = '<span class="mini-tag">✓ RESPOSTA ENVIADA</span>';
  setTimeout(() => document.querySelector('.second-message').classList.remove('hidden'), 550);
});

document.querySelector('.edit-ai').addEventListener('click', () => {
  const suggested = 'Olá, Eduardo! Identifiquei que sua equipe está vinculada à OS #4821. Posso solicitar uma liberação temporária para a área técnica do Bloco B agora. Deseja prosseguir?';
  const composer = document.querySelector('#composer-text');
  composer.value = suggested;
  composer.focus();
});

document.querySelector('.send-button').addEventListener('click', () => {
  const composer = document.querySelector('#composer-text');
  if (!composer.value.trim()) return;
  const article = document.createElement('article');
  article.className = 'message incoming';
  article.style.marginLeft = 'auto';
  article.innerHTML = `<div><div class="bubble" style="background:#e9f7f1"><p>${composer.value.replace(/</g, '&lt;')}</p></div><time style="text-align:right">agora</time></div>`;
  document.querySelector('#messages').append(article);
  composer.value = '';
  article.scrollIntoView({ behavior:'smooth' });
});
