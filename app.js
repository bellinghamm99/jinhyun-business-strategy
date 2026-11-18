'use strict';
const DATA = window.PORTFOLIO_DATA;
const WORKS = window.WORK_MANIFEST || {};
const views = [...document.querySelectorAll('[data-view]')];
const navButtons = [...document.querySelectorAll('.nav-link')];
const modal = document.querySelector('#project-modal');
const modalContent = document.querySelector('#modal-content');
const modalClose = document.querySelector('#modal-close');
let lastFocus = null;

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeUrl = url => {
  const value = String(url ?? '').trim();
  return value && !/^(javascript|data|vbscript):/i.test(value) ? value : '';
};

function closeModal() {
  if (modal.open) modal.close();
  document.body.style.overflow = '';
  lastFocus?.focus?.();
  lastFocus = null;
}
function routeTo(route, push = true) {
  const next = ['main','career','projects','contact'].includes(route) ? route : 'main';
  if (modal.open) closeModal();
  views.forEach(v => v.classList.toggle('is-active', v.dataset.view === next));
  navButtons.forEach(b => {
    const active=b.dataset.route===next;
    b.classList.toggle('is-active',active);
    if (active) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  if (push) history.pushState({route:next}, '', `#${next}`);
  window.scrollTo({top:0,behavior:'instant'});
}
document.querySelectorAll('[data-route]').forEach(el => el.addEventListener('click', e => {
  e.preventDefault();routeTo(el.dataset.route);
}));
window.addEventListener('popstate',()=>routeTo(location.hash.replace('#','')||'main',false));
window.addEventListener('hashchange',()=>routeTo(location.hash.replace('#','')||'main',false));

function renderTimeline() {
  document.querySelector('#main-timeline').innerHTML = DATA.timeline.map(item=>`
    <div class="timeline-item"><div class="timeline-year">${esc(item.year)}</div>
      <div class="timeline-company">${esc(item.company)}</div><div class="timeline-role">${esc(item.role)}</div></div>`).join('');
}
function relatedIds(item) {
  const map = {'MAD ENGINE':['night-crows','business-development'], 'BLACKSTORM':['rememento','business-development'],
    'WEMADE':['wemix'], 'XLGAMES':['archeworld','archeage'], 'BLIZZARD ENTERTAINMENT KOREA':[]};
  return map[item.company] || (item.relatedProject ? [item.relatedProject] : []);
}
function renderCareer() {
  const root = document.querySelector('#career-list');
  root.innerHTML = DATA.career.map(item => {
    const related = relatedIds(item).filter(id=>DATA.projects.some(p=>p.id===id));
    return `<article class="career-card reveal"><div class="career-meta"><div class="career-period">${esc(item.period)}</div></div>
      <div class="career-body"><h2>${esc(item.company)}</h2><h3>${esc(item.role)}</h3>
      <p class="career-summary">${esc(item.summary)}</p>
      <ul class="career-bullets">${item.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul>
      ${related.length ? `<div class="related-projects">${related.map(id=>{
        const p=DATA.projects.find(x=>x.id===id);
        return `<button type="button" class="related-project" data-related="${esc(id)}">${esc(p.title)} ↗</button>`;
      }).join('')}</div>` : ''}</div></article>`;
  }).join('');
  root.querySelectorAll('[data-related]').forEach(b=>b.addEventListener('click',()=>{
    routeTo('projects');openProject(b.dataset.related);
  }));
}
function renderProjects() {
  const root = document.querySelector('#project-grid');
  root.innerHTML = DATA.projects.map(p=>{
    const count=(WORKS[p.id]||[]).length;
    return `<button type="button" class="project-card reveal" data-project="${esc(p.id)}" aria-label="${esc(p.title)} 상세 작업물 보기">
       <div class="project-media"><img src="${esc(p.image)}" alt="${esc(p.title)} 프로젝트 커버" loading="lazy"/><span class="project-index">${esc(p.index)}</span><span class="project-cover-cta" aria-hidden="true">VIEW PROJECT <span>↗</span></span></div>
       <div class="project-info"><div><div class="project-category">${esc(p.category)}</div><h2>${esc(p.title)}</h2>
       <p class="project-highlight">${esc(p.highlight)}</p><span class="project-role">${esc(p.company)}</span></div>
       <div class="project-footnote"><span>${esc(p.period)}</span><span>${count} WORKS ↗</span></div></div>
     </button>`;
  }).join('');
  root.querySelectorAll('[data-project]').forEach(card=>card.addEventListener('click',()=>openProject(card.dataset.project)));
}
function workCard(w) {
  const url=safeUrl(w.url);
  if (!url) return '';
  const thumb=safeUrl(w.preview);
  const ext=url.split('.').pop().split(/[?#]/)[0].toLowerCase();
  const viewable=['pdf','png','jpg','jpeg','webp'].includes(ext);
  const action=viewable ? '문서 열기' : '파일 다운로드';
  const attrs=viewable ? 'target="_blank" rel="noopener noreferrer"' : 'download';
  const filename=w.source_filename || url.split('/').pop();
  return `<a class="work-card" href="${esc(url)}" ${attrs} aria-label="${esc(w.title)} · ${action}">
    <div class="work-thumb">${thumb?`<img src="${esc(thumb)}" alt="${esc(w.title)} 표지 미리보기" loading="lazy"/>`:`<span>${esc(ext.toUpperCase())}</span>`}</div>
    <div class="work-card-content"><span class="work-type">${esc(w.category)} · ${esc(ext.toUpperCase())}</span>
    <h4>${esc(w.title)}</h4>
    <div class="work-description"><span class="work-description-label">WORK SUMMARY</span><p>${esc(w.overview)}</p></div>
    <span class="work-open">${action} <span aria-hidden="true">${viewable?'↗':'↓'}</span></span></div>
  </a>`;
}
function openProject(id) {
  const p=DATA.projects.find(x=>x.id===id); if(!p)return;
  lastFocus=document.activeElement;
  const work=(WORKS[id]||[]).slice().sort((a,b)=>a.order-b.order);
  const selected=work.filter(w=>w.hero);
  const more=work.filter(w=>!w.hero);
  modalContent.innerHTML = `<div class="modal-hero">
      <img src="${esc(p.image)}" alt="${esc(p.title)} 프로젝트 커버" />
      <div class="modal-title"><div class="eyebrow">${esc(p.company)} · ${esc(p.period)}</div>
        <h2>${esc(p.title)}</h2><p>${esc(p.summary)}</p>
        <div class="modal-tags">${p.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>
      </div>
    </div>
    <div class="modal-work-wrap">
      <div class="modal-intro-head"><div><div class="eyebrow">01 / SELECTED WORKS</div><h3>대표 작업물<span>.</span></h3></div>
      <span class="work-count">${String(work.length).padStart(2,'0')} FILES</span></div>
      <p class="modal-work-hint">문서별로 분석 목적과 수행 내용을 정리했습니다. PDF·이미지는 새 탭에서 열리고, Excel·Word 파일은 다운로드됩니다.</p>
      <div class="selected-work-grid">${selected.map(workCard).join('')||'<p>아직 연결된 공개용 작업물이 없습니다.</p>'}</div>
      ${more.length ? `<details class="more-works"><summary>추가 작업물 <small>${more.length}개 더 보기</small><span aria-hidden="true">＋</span></summary>
        <div class="selected-work-grid extra-grid">${more.map(workCard).join('')}</div></details>`:''}
      <section class="project-outcome" aria-label="프로젝트 역할과 기여">
        <span class="eyebrow">02 / ROLE & CONTRIBUTION</span>
        <h3>담당 역할과 기여<span>.</span></h3>
        <ul class="contribution-list">${(p.contributions || [p.result]).map(item=>`<li>${esc(item)}</li>`).join('')}</ul>
      </section>
      <section class="business-impact" aria-label="직무 역량과 사업적 시사점">
        <div class="eyebrow">03 / BUSINESS IMPACT</div>
        <h3>분석을 실행으로<span>.</span></h3>
        <p class="business-impact-description">${esc(p.businessImpact || p.result)}</p>
        <p class="business-impact-relevance"><strong>BUSINESS S&P RELEVANCE</strong><span>${esc(p.businessRelevance || '')}</span></p>
      </section>
      <aside class="work-disclosure" aria-label="작업물 공개 범위 안내">
        <div class="work-disclosure-head"><span aria-hidden="true">ⓘ</span><span>ABOUT WORK SAMPLES</span></div>
        <p>본 포트폴리오에는 공개 가능한 작업물만 선별하여 수록했습니다. 내부 정보 보호를 위해 일부 내용은 편집하거나 생략했으며, 문서로 공개하기 어려운 업무의 기여 내용은 ROLE &amp; CONTRIBUTION에 별도로 정리했습니다.</p>
        <p class="work-disclosure-note">${esc(p.note)}</p>
      </aside>
    </div>`;
  modal.showModal();document.body.style.overflow='hidden';
  modal.scrollTop=0; modalClose.focus();
}
modalClose.addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
modal.addEventListener('close',()=>{document.body.style.overflow='';lastFocus?.focus?.();lastFocus=null;});

function renderContact() {
  const c=DATA.contact;
  const links=[
    {title:'LinkedIn',href:c.linkedin,label:'PROFILE ↗',external:true},
    {title:'Resume',href:c.resume,label:'ENGLISH PDF ↗',external:true},
    {title:'국문 이력서',href:c.resumeKo,label:'KOREAN PDF ↗',external:true},
    {title:'Email',href:c.email,label:'WRITE ↗',external:false}
  ];
  document.querySelector('#contact-links').innerHTML=links.map(l=>{
    const href=safeUrl(l.href);
    return href?`<a class="contact-link" href="${esc(href)}" ${l.external?'target="_blank" rel="noopener noreferrer"':''}><span>${esc(l.title)}</span><small>${esc(l.label)}</small></a>`
      :`<div class="contact-link contact-inactive"><span>${esc(l.title)}</span><small>추후 연결 예정</small></div>`;
  }).join('');
  const instagram=safeUrl(c.instagram);
  document.querySelector('#social-row').innerHTML=instagram?`<a class="social-pill" href="${esc(instagram)}" target="_blank" rel="noopener noreferrer">INSTAGRAM ↗</a>`:'';
}
renderTimeline();renderCareer();renderProjects();renderContact();routeTo(location.hash.replace('#','')||'main',false);
