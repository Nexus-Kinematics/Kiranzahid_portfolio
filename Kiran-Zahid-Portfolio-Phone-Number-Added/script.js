/* Portfolio site behavior + content.json renderer. Keeps the original portfolio theme. */
(function () {
  'use strict';
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#siteNav .nav__link'));
  var mobileQuery = window.matchMedia('(max-width: 900px)');
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  function setMenu(open) { if (!toggle || !nav) return; nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Close' : 'Menu'; }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    navLinks.forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    var onBreakpoint = function (e) { if (!e.matches) setMenu(false); };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', onBreakpoint); else if (mobileQuery.addListener) mobileQuery.addListener(onBreakpoint);
  }
  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
  function node(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined && text !== null) n.textContent = String(text); return n; }
  function setText(sel, text) { var n = $(sel); if (n && text !== undefined && text !== null) n.textContent = text; }
  function safeUrl(value) { return typeof value === 'string' && (/^(https?:|mailto:|tel:|data:|blob:)/i.test(value) || (/^[A-Za-z0-9._/-]+$/.test(value) && !/(^|\/)\.\.(?:\/|$)/.test(value))) ? value : ''; }
  function mediaUrl(value) { if (!value) return ''; if (typeof value !== 'string') return ''; return safeUrl(value) ? value : ''; }
  function link(label, url, cls) { var a = node('a', cls || '', label || 'Open link'); a.href = safeUrl(url) || '#'; if (/^https?:/i.test(a.href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } return a; }
  function renderLinks() {
    var dataLinks = Array.isArray(content.links) ? content.links : [];
    ['.hero .link-list', '.contact .link-list'].forEach(function (sel) { var ul = $(sel); if (!ul) return; ul.replaceChildren(); dataLinks.forEach(function (item) { if (!item || !item.label || !item.url) return; var li = node('li'); li.appendChild(link(item.label, item.url)); ul.appendChild(li); }); });
  }
  function renderSkills() {
    var wrap = $('.skills'); if (!wrap) return; wrap.replaceChildren();
    (content.skills || []).forEach(function (s) { var card=node('div','skills__group'); card.appendChild(node('h3','',s.title || 'Skills')); var ul=node('ul'); (s.tags || []).forEach(function (t) { ul.appendChild(node('li','',t)); }); card.appendChild(ul); if (s.description) card.appendChild(node('p','skills__note',s.description)); wrap.appendChild(card); });
  }
  function renderProjects() {
    var section=$('#projects'); if (!section) return; var container=$('.wrap',section); if (!container) return;
    var intro=$('.section-intro',section); if (intro && content.site && content.site.projectsIntro) intro.textContent=content.site.projectsIntro;
    $$('.project',section).forEach(function (n) { n.remove(); });
    var oldGrid=$('.project-grid',section); if(oldGrid)oldGrid.remove();
    var grid=null;
    (content.projects || []).forEach(function (p, i) {
      var article=node('article','project'); article.setAttribute('aria-label',p.title || ('Project '+(i+1)));
      var imgUrl=mediaUrl(p.image);
      if (imgUrl) { var shot=node('div','project__shot'); var img=node('img'); img.src=imgUrl; img.alt=p.imageAlt || (p.title+' image'); img.loading='lazy'; shot.appendChild(img); article.appendChild(shot); }
      var body=node('div','project__body'); var main=node('div'); main.appendChild(node('p','project__kind',p.category || 'Project')); main.appendChild(node('h3','project__title',p.title || 'Untitled project')); if(p.status) main.appendChild(node('p','project__kind',p.status)); main.appendChild(node('p','',p.description || ''));
      if (Array.isArray(p.tags) && p.tags.length) { var tags=node('ul','tags'); tags.setAttribute('aria-label','Technologies'); p.tags.forEach(function(t){tags.appendChild(node('li','',t));}); main.appendChild(tags); }
      if (p.notes) main.appendChild(node('p','project__note',p.notes));
      var media=node('div','project__media-links');
      if (p.image && imgUrl) media.appendChild(link('Open full-size image',imgUrl,'project__media-link'));
      var pdf=mediaUrl(p.pdf);
      /* Keep the AQSA evidence reachable even if an older content.json omits its PDF field. */
      if (!pdf && /AQSA POS System Testing/i.test(p.title || '')) pdf='assets/AQSA-POS-Testing-Evidence.pdf';
      if(pdf) {
        var actions=node('p','project__actions');
        var viewPdf=node('a','btn btn--primary','View testing evidence (PDF)');
        viewPdf.href=pdf; viewPdf.target='_blank'; viewPdf.rel='noopener noreferrer';
        var downloadPdf=node('a','btn btn--secondary','Download PDF');
        downloadPdf.href=pdf; downloadPdf.setAttribute('download','AQSA-POS-Testing-Evidence.pdf');
        actions.appendChild(viewPdf); actions.appendChild(downloadPdf); main.appendChild(actions);
      }
      var vid=mediaUrl(p.video); if(vid) { if(/^data:video|\.(mp4|webm|ogg)(\?|$)/i.test(vid)) { var video=node('video','project__video'); video.controls=true; video.preload='metadata'; video.src=vid; media.appendChild(video); } else media.appendChild(link('Watch project video',vid,'project__media-link')); }
      var projectLink=mediaUrl(p.link); if(projectLink) media.appendChild(link('Project link',projectLink,'project__media-link'));
      if(media.childNodes.length) main.appendChild(media); body.appendChild(main); article.appendChild(body);
      if (i < 2) container.appendChild(article);
      else { if(!grid){grid=node('div','project-grid');container.appendChild(grid);} grid.appendChild(article); }
    });
  }
  function renderExperience() {
    var section=$('#experience'); if(!section)return; var list=$('.entries',section); if(!list)return; list.replaceChildren();
    (content.experience || []).forEach(function(e){var li=node('li','entry'); var head=node('div','entry__head'); head.appendChild(node('h3','entry__title',e.role || 'Role')); if(e.duration) head.appendChild(node('p','entry__when',e.duration)); li.appendChild(head); if(e.organization)li.appendChild(node('p','entry__org',e.organization)); if(e.description)li.appendChild(node('p','entry__text',e.description)); var l=mediaUrl(e.link); if(l)li.appendChild(link('Organization / details',l)); var im=mediaUrl(e.image); if(im){var img=node('img');img.src=im;img.alt=(e.role||'Experience')+' image';img.loading='lazy';img.style.maxWidth='240px';img.style.borderRadius='12px';li.appendChild(img);} list.appendChild(li);});
  }
  function renderEducation() {
    var section=$('#education'); if(!section)return; var wrap=$('div',section); if(!wrap)return; var oldLists=$$('.entries',section); oldLists.forEach(function(l){l.replaceChildren();});
    var formal= (content.education||[]).filter(function(e){return /formal|education/i.test(e.type||'');});
    var courses=(content.education||[]).filter(function(e){return !/formal|education/i.test(e.type||'');});
    var lists=$$('.entries',section); var formalList=lists[0], courseList=lists[1];
    function addEntry(list,e){if(!list)return;var li=node('li','entry');var head=node('div','entry__head');head.appendChild(node('h4','entry__title',e.title||'Education'));if(e.status)head.appendChild(node('p','entry__when',e.status));li.appendChild(head);if(e.institution)li.appendChild(node('p','entry__org',e.institution));if(e.description)li.appendChild(node('p','entry__text',e.description));var im=mediaUrl(e.certificateImage);if(im){var img=node('img');img.src=im;img.alt=(e.title||'')+' certificate';img.loading='lazy';img.style.maxWidth='240px';img.style.borderRadius='12px';li.appendChild(img);}var pdf=mediaUrl(e.certificatePdf);if(pdf)li.appendChild(link('View certificate PDF',pdf));var l=mediaUrl(e.link);if(l)li.appendChild(link('Course details',l));list.appendChild(li);}
    formal.forEach(function(e){addEntry(formalList,e);});courses.forEach(function(e){addEntry(courseList,e);});
  }
  function renderCertificates() {
    var section=$('#certificates'), list=$('#certificateList'); if(!section||!list)return; list.replaceChildren(); var certs=content.certificates||[]; section.hidden=!certs.length;
    certs.forEach(function(c){var card=node('article','entry');var head=node('div','entry__head');head.appendChild(node('h3','entry__title',c.title||'Certificate'));if(c.date)head.appendChild(node('p','entry__when',c.date));card.appendChild(head);if(c.issuer)card.appendChild(node('p','entry__org',c.issuer));if(c.description)card.appendChild(node('p','entry__text',c.description));var im=mediaUrl(c.image);if(im){var img=node('img');img.src=im;img.alt=(c.title||'')+' certificate image';img.loading='lazy';img.style.maxWidth='280px';img.style.borderRadius='12px';card.appendChild(img);}var pdf=mediaUrl(c.pdf);if(pdf)card.appendChild(link('View certificate PDF',pdf));var l=mediaUrl(c.link);if(l)card.appendChild(link('Verify certificate',l));list.appendChild(card);});
  }
  function renderCustom() { var section=$('#customContent'), list=$('#customList'); if(!section||!list)return;list.replaceChildren();var fields=content.extraFields||[];section.hidden=!fields.length;fields.forEach(function(f){var e=node('article','entry');e.appendChild(node('h3','entry__title',f.title||f.label||'Additional information'));if(f.description||f.value)e.appendChild(node('p','entry__text',f.description||f.value));var im=mediaUrl(f.image);if(im){var img=node('img');img.src=im;img.alt=f.title||f.label||'Portfolio image';img.loading='lazy';img.style.maxWidth='280px';e.appendChild(img);}var pdf=mediaUrl(f.pdf);if(pdf)e.appendChild(link('Open document',pdf));var video=mediaUrl(f.video);if(video){if(/^data:video|\.(mp4|webm|ogg)(\?|$)/i.test(video)){var v=node('video');v.src=video;v.controls=true;v.style.maxWidth='100%';e.appendChild(v);}else e.appendChild(link('Watch video',video));}var url=mediaUrl(f.link);if(url)e.appendChild(link('More details',url));list.appendChild(e);}); }
  function applyContent(c) {
    content=c||{}; var site=content.site||{}, p=content.profile||{}, contact=content.contact||{};
    if(site.title){document.title=site.title;var og=$('meta[property="og:title"]');if(og)og.content=site.title;}
    if(site.description){var meta=$('meta[name="description"]');if(meta)meta.content=site.description;}
    setText('.brand',p.name||'Kiran Zahid'); setText('#hero-title',p.name||'Kiran Zahid'); setText('.hero__role',p.headline||''); setText('.hero__intro',p.intro||'');
    var about=$$('.prose p'); if(p.aboutLead && about[0])about[0].textContent=p.aboutLead; if(Array.isArray(p.aboutParagraphs)){var host=$('.prose'); if(host){host.replaceChildren(); if(p.aboutLead)host.appendChild(node('p','lead',p.aboutLead));p.aboutParagraphs.forEach(function(t){host.appendChild(node('p','',t));}); if(p.location||p.languages){host.appendChild(node('p','', [p.location,p.languages].filter(Boolean).join(' · ')));}}}
    var portrait=$('.portrait img'); var portraitSrc=mediaUrl(p.portrait); if(portrait&&portraitSrc){portrait.src=portraitSrc;portrait.removeAttribute('srcset');portrait.alt=p.portraitAlt||((p.name||'Portfolio owner')+' portrait');}
    var cv=mediaUrl(p.cv)||'Kiran-Zahid-CV.pdf'; ['#heroCvLink','.site-footer a[href$="Kiran-Zahid-CV.pdf"]'].forEach(function(sel){var a=$(sel);if(a){a.href=cv;if(!/^data:application\/pdf/i.test(cv))a.setAttribute('download','');else a.removeAttribute('download');}});
    var email=p.email||contact.email||''; var em=$('#contactEmail'); if(em){em.textContent=email;em.href=email?'mailto:'+email:'#';}
    var phone=p.phone||contact.phone||''; var ph=$('#contactPhone'); if(ph){ph.textContent=phone;ph.href=phone?'tel:'+phone.replace(/[^0-9+]/g,''):'#';ph.setAttribute('aria-label',phone?'Call '+phone:'Phone number unavailable');}
    setText('#contactAvailability','Availability: '+(p.availability||contact.availability||'')); if(contact.copy)setText('.contact__copy',contact.copy);
    var footer=$('.site-footer p'); if(footer){footer.replaceChildren(document.createTextNode('© '));footer.appendChild(node('span','',String(new Date().getFullYear())));footer.appendChild(document.createTextNode(' '+(p.name||'Kiran Zahid')));}
    renderLinks();renderSkills();renderProjects();renderExperience();renderEducation();renderCertificates();renderCustom();
  }
  var content={};
  fetch('content.json?v=20261027-pdf-buttons-fix',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('content unavailable');return r.json();}).then(applyContent).catch(function(err){console.warn('Portfolio content could not load; showing built-in HTML fallback.',err);});
})();
