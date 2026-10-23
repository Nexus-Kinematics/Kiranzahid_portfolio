/* Kiran Zahid portfolio: small progressive enhancements.
   The page is fully readable and navigable without this file. */
(function () {
  'use strict';

  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var mobileQuery = window.matchMedia('(max-width: 900px)');

  // Footer year
  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }

  // Mobile menu
  function setMenu(open) {
    if (!toggle || !nav) { return; }
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'));
    });

    links.forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Reset when the viewport grows past the mobile breakpoint
    var onBreakpoint = function (event) { if (!event.matches) { setMenu(false); } };
    if (mobileQuery.addEventListener) { mobileQuery.addEventListener('change', onBreakpoint); }
    else if (mobileQuery.addListener) { mobileQuery.addListener(onBreakpoint); }
  }

  // Highlight the nav link for the section currently in view
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  function updateActive() {
    var marker = window.innerHeight * 0.35;
    var current = null;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= marker) { current = section; }
    });
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom && sections.length) { current = sections[sections.length - 1]; }
    links.forEach(function (link) {
      var active = current && link.getAttribute('href') === '#' + current.id;
      if (active) { link.setAttribute('aria-current', 'true'); }
      else { link.removeAttribute('aria-current'); }
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) { return; }
    ticking = true;
    window.requestAnimationFrame(function () { updateActive(); ticking = false; });
  }

  if (sections.length) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateActive();
  }
})();

/* ==========================================================================
   Personal dashboard (local editor)
   - Edits are saved in this browser's localStorage only. They never change the
     website for other visitors; to change the public site, edit the files.
   - Login: the username and password are not stored in this file. Only a
     SHA-256 hash is, so this is a convenience lock, not real security.
   ========================================================================== */
(function () {
  'use strict';

  var AUTH_HASH = 'bac82dfbc320db992c07a545c0085044cb27084aecdc7449b44ff97940db4573';
  var KEYS = {
    edits: 'kiranPortfolioEditsV1',
    cv: 'kiranPortfolioCVFieldsV2',
    photo: 'kiranProfilePhotoV1',
    url: 'kiranPortfolioUrlV1',
    entries: 'kiranPortfolioManagedEntriesV1',
    attach: 'kiranPortfolioAttachmentsV1'
  };
  // Keys used by the previous version of the dashboard, so saved edits carry over
  var ALIAS = {
    heroDescription: 'heroIntro', aboutText: 'aboutText1',
    project2Title: 'leadTitle', project2Description: 'leadDesc',
    project3Title: 'supportTitle', project3Description: 'supportDesc',
    project4Title: 'posTitle', project4Description: 'posDesc',
    project1Title: 'ckdTitle', project1Description: 'ckdDesc',
    project5Title: 'fireTitle', project5Description: 'fireDesc',
    experienceText: 'exp1Text', learning1Title: 'edu1Title'
  };
  var CV_DEFAULTS = {
    cvPhone: '',
    cvLocation: 'Punjab, Pakistan',
    cvSummary: 'Emerging technology professional focused on AI automation, n8n, Zapier, AI tools and LLMs, workflow automation, and robotics. Building practical portfolio projects while pursuing the Modern Robotics Specialization from Northwestern University. Brings professional workplace experience from teaching, combined with hands-on learning in AI automation, robotics, and software testing.',
    cvSkills: 'AI automation, n8n and Zapier, AI tools and LLMs, Workflow automation, Robotics and automation, Manual functional testing',
    cvEducation: 'Intermediate (ICS – Physics) — Pakistan Girls College Dina — Completed 2025',
    cvCertifications: 'Modern Robotics Specialization — Northwestern University — Currently pursuing\nAI Mastery — AQSA IT Solutions — Completed\nElements of AI — University of Helsinki — Completed\nAI Elements — Riphah University — Completed',
    cvExperience: 'Teacher — Science Valley — October 2025 to 2026\n• Built practical workplace experience through teaching, communication, organization, and time management.\n• Worked responsibly with students and handled day-to-day professional duties.\n\nTeacher — The Educators — 6 months\n• Developed professional communication, responsibility, organization, and classroom-management skills.\n• Worked directly with students in a structured and professional learning environment.\n\nIntern — AQSA IT Solutions\n• Internship connected to practical IT work and software quality.',
    cvLanguages: 'English — Fluent\nUrdu — Native\nFrench — Basic',
    cvAvailability: 'Part-time, night shifts, and weekends.'
  };
  var CV_IDS = Object.keys(CV_DEFAULTS);

  var dlg = document.getElementById('dashboard');
  if (!dlg || typeof dlg.showModal !== 'function') {
    var hide = document.getElementById('dashboardOpen');
    if (hide) { hide.parentNode.hidden = true; }
    return;
  }

  var openBtn = document.getElementById('dashboardOpen');
  var loginForm = document.getElementById('dashboardLogin');
  var editorForm = document.getElementById('portfolioEditor');
  var loginMsg = document.getElementById('loginMessage');
  var saveMsg = document.getElementById('saveMessage');
  var editorFields = document.getElementById('editorFields');
  var authed = false;

  /* ---- helpers ---- */
  function read(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) { node.className = cls; }
    if (text != null) { node.textContent = text; }
    return node;
  }
  function safeHttp(url) { return typeof url === 'string' && /^https?:\/\/[^\s]+$/i.test(url.trim()); }
  function isEmail(v) { return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(v); }
  function sha256(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }

  var MEDIA_OK = /^(image\/(png|jpeg|webp|gif)|video\/(mp4|webm)|application\/pdf)$/;

  function openPdf(data) {
    try {
      var bin = atob(data.split(',')[1]); var arr = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) { arr[i] = bin.charCodeAt(i); }
      var url = URL.createObjectURL(new Blob([arr], { type: 'application/pdf' }));
      var a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    } catch (err) { window.alert('This PDF could not be opened.'); }
  }

  // Builds a safe element for an attached picture, video, PDF, or other file
  function buildMedia(data, name, caption) {
    var label = caption || name || 'Attachment';
    var wrap;
    if (/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(data)) {
      wrap = el('figure', 'attachment');
      var im = el('img', 'attachment__media managed__media'); im.src = data; im.alt = label; wrap.appendChild(im);
    } else if (/^data:video\/(mp4|webm);base64,/i.test(data)) {
      wrap = el('figure', 'attachment');
      var v = el('video', 'attachment__media managed__media'); v.src = data; v.controls = true; v.preload = 'metadata';
      v.setAttribute('aria-label', label); wrap.appendChild(v);
    } else if (/^data:application\/pdf;base64,/i.test(data)) {
      wrap = el('div', 'attachment');
      var b = el('button', 'btn btn--secondary', 'Open PDF: ' + label); b.type = 'button';
      b.addEventListener('click', function () { openPdf(data); }); wrap.appendChild(b);
      return wrap;
    } else if (/^data:[a-z0-9.+\-\/]+;base64,/i.test(data)) {
      wrap = el('div', 'attachment');
      var a = el('a', 'managed__link', 'Download ' + label); a.href = data; a.download = name || 'attachment'; wrap.appendChild(a);
      return wrap;
    } else { return null; }
    if (caption) { wrap.appendChild(el('figcaption', null, caption)); }
    return wrap;
  }

  /* ---- apply saved edits to the page ---- */
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-edit]'));
  var targets = Array.prototype.slice.call(document.querySelectorAll('[data-attach]'));

  // Simple fields hold text. "list" fields (tags, bullet lists) hold one item per line.
  function getVal(n) {
    if (n.dataset.editType === 'list') {
      return Array.prototype.map.call(n.children, function (li) { return li.textContent.trim(); }).join('\n');
    }
    return n.textContent.trim();
  }
  function setVal(n, v) {
    if (n.dataset.editType === 'list') {
      n.textContent = '';
      v.split(/\r?\n/).forEach(function (line) { line = line.trim(); if (line) { n.appendChild(el('li', null, line)); } });
    } else { n.textContent = v; }
  }
  nodes.forEach(function (n) { n.dataset.default = getVal(n); });

  function syncEmail() {
    var a = document.querySelector('.contact__email');
    if (!a) { return; }
    var v = a.textContent.trim();
    if (isEmail(v)) { a.href = 'mailto:' + v; }
  }

  function applyEdits() {
    var saved = read(KEYS.edits, {});
    Object.keys(ALIAS).forEach(function (old) {
      if (typeof saved[old] === 'string' && saved[ALIAS[old]] === undefined) { saved[ALIAS[old]] = saved[old]; }
    });
    nodes.forEach(function (n) {
      var v = saved[n.dataset.edit];
      if (typeof v === 'string' && v.trim()) { setVal(n, v); }
    });
    if (nodes.length) { syncEmail(); }
    var photo = localStorage.getItem(KEYS.photo);
    var img = document.querySelector('.portrait img');
    if (img && photo && /^data:image\/(png|jpe?g|webp);base64,/i.test(photo)) {
      img.removeAttribute('srcset');
      img.src = photo;
    }
  }

  /* ---- added items ("More" section) ---- */
  var TYPE_LABELS = { education: 'Education', certificate: 'Certificate', project: 'Project', extra: 'More' };

  function renderEntries() {
    var entries = read(KEYS.entries, []);
    var section = document.getElementById('addedContent');
    var wrap = document.getElementById('publicManagedEntries');
    var admin = document.getElementById('managedEntries');
    if (section) { section.hidden = entries.length === 0; }
    if (wrap) {
      wrap.textContent = '';
      entries.forEach(function (item) {
        var card = el('article', 'managed');
        card.appendChild(el('p', 'managed__type', TYPE_LABELS[item.type] || 'More'));
        card.appendChild(el('h3', null, item.title || 'Untitled item'));
        if (item.description) { card.appendChild(el('p', null, item.description)); }
        var media = buildMedia(item.dataUrl || '', item.fileName, '');
        if (media) { card.appendChild(media); }
        if (safeHttp(item.link)) {
          var l = el('a', 'managed__link', 'Open related link'); l.href = item.link.trim(); l.target = '_blank'; l.rel = 'noopener noreferrer';
          var pl = el('p'); pl.appendChild(l); card.appendChild(pl);
        }
        wrap.appendChild(card);
      });
    }
    if (admin) {
      admin.textContent = '';
      if (!entries.length) { admin.appendChild(el('li', 'dashboard__note', 'No added items yet.')); }
      entries.forEach(function (item, index) {
        var li = el('li', 'managed-admin__row');
        li.appendChild(el('span', null, (item.title || 'Untitled item') + ' (' + (TYPE_LABELS[item.type] || 'More') + ')'));
        var rm = el('button', 'btn btn--secondary', 'Remove');
        rm.type = 'button'; rm.dataset.remove = String(index);
        rm.setAttribute('aria-label', 'Remove ' + (item.title || 'untitled item'));
        li.appendChild(rm); admin.appendChild(li);
      });
    }
  }

  /* ---- attachments on existing items ---- */
  function renderAttachments() {
    var store = read(KEYS.attach, {});
    Array.prototype.forEach.call(document.querySelectorAll('.attachments'), function (n) { n.remove(); });
    targets.forEach(function (t) {
      var items = store[t.dataset.attach];
      if (!Array.isArray(items) || !items.length) { return; }
      var inner = !!t.closest('.project-grid') || t.classList.contains('entry');
      var box = el('div', 'attachments' + (inner ? ' attachments--inner' : ''));
      box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'Attachments');
      items.forEach(function (it) { var m = buildMedia(it.dataUrl || '', it.fileName, it.caption || ''); if (m) { box.appendChild(m); } });
      if (box.children.length) { t.appendChild(box); }
    });
  }

  function renderAttachmentAdmin() {
    var store = read(KEYS.attach, {});
    var list = document.getElementById('attachmentList');
    var select = document.getElementById('attachTarget');
    if (!select.options.length) {
      targets.forEach(function (t) { var o = el('option', null, t.dataset.attachLabel || t.dataset.attach); o.value = t.dataset.attach; select.appendChild(o); });
    }
    list.textContent = '';
    var count = 0;
    targets.forEach(function (t) {
      (store[t.dataset.attach] || []).forEach(function (it, index) {
        count++;
        var li = el('li', 'managed-admin__row');
        li.appendChild(el('span', null, (t.dataset.attachLabel || t.dataset.attach) + ': ' + (it.fileName || 'file')));
        var rm = el('button', 'btn btn--secondary', 'Remove'); rm.type = 'button';
        rm.dataset.attachKey = t.dataset.attach; rm.dataset.attachIndex = String(index);
        rm.setAttribute('aria-label', 'Remove ' + (it.fileName || 'file') + ' from ' + (t.dataset.attachLabel || t.dataset.attach));
        li.appendChild(rm); list.appendChild(li);
      });
    });
    if (!count) { list.appendChild(el('li', 'dashboard__note', 'No attachments yet.')); }
  }

  /* ---- editor ---- */
  function buildEditor() {
    var saved = read(KEYS.edits, {});
    editorFields.textContent = '';
    var groups = {};
    nodes.forEach(function (n) {
      var g = n.dataset.group || 'Other';
      (groups[g] = groups[g] || []).push(n);
    });
    Object.keys(groups).forEach(function (name) {
      var fs = el('fieldset', 'editor-group'); fs.appendChild(el('legend', null, name));
      groups[name].forEach(function (n) {
        var id = 'edit-' + n.dataset.edit;
        var f = el('div', 'field');
        var lab = el('label', null, n.dataset.label || n.dataset.edit); lab.htmlFor = id; f.appendChild(lab);
        var current = getVal(n);
        var isList = n.dataset.editType === 'list';
        var input = (isList || current.length > 70) ? el('textarea') : el('input');
        if (input.tagName === 'TEXTAREA') { input.rows = isList ? Math.min(8, current.split('\n').length + 1) : Math.min(10, Math.ceil(current.length / 38) + 1); } else { input.type = 'text'; }
        input.id = id; input.name = n.dataset.edit; input.value = current;
        f.appendChild(input); fs.appendChild(f);
      });
      editorFields.appendChild(fs);
    });
    var cv = read(KEYS.cv, {});
    CV_IDS.forEach(function (id) {
      var field = document.getElementById(id);
      field.value = typeof cv[id] === 'string' ? cv[id] : CV_DEFAULTS[id];
    });
    document.getElementById('portfolioUrl').value = localStorage.getItem(KEYS.url) || saved.portfolioUrl || '';
    renderEntries();
    renderAttachmentAdmin();
  }

  function setMsg(node, text) { node.textContent = text; }

  /* ---- open, close, login ---- */
  function showLogin() {
    authed = false;
    loginForm.hidden = false; editorForm.hidden = true;
    loginForm.reset(); setMsg(loginMsg, ''); setMsg(saveMsg, '');
  }
  openBtn.addEventListener('click', function () { showLogin(); dlg.showModal(); document.getElementById('dashUser').focus(); });
  document.getElementById('dashboardClose').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('close', function () { showLogin(); openBtn.focus(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) { dlg.close(); } });

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var user = document.getElementById('dashUser').value;
    var pass = document.getElementById('dashPass').value;
    if (!window.crypto || !crypto.subtle) {
      setMsg(loginMsg, 'This browser cannot check the login here. Open the website over https and try again.');
      return;
    }
    sha256(user + '\n' + pass).then(function (hash) {
      if (hash === AUTH_HASH) {
        authed = true; setMsg(loginMsg, '');
        loginForm.hidden = true; editorForm.hidden = false;
        buildEditor();
        var first = editorForm.querySelector('input, textarea'); if (first) { first.focus(); }
      } else {
        setMsg(loginMsg, 'Incorrect username or password. Please try again.');
        document.getElementById('dashPass').value = '';
        document.getElementById('dashPass').focus();
      }
    });
  });
  document.getElementById('dashboardLogout').addEventListener('click', function () { dlg.close(); });

  /* ---- save and reset ---- */
  editorForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!authed) { return; }
    var saved = {};
    nodes.forEach(function (n) {
      var field = document.getElementById('edit-' + n.dataset.edit);
      var v = field ? field.value.trim() : '';
      if (v && v !== n.dataset.default) { saved[n.dataset.edit] = v; }
    });
    if (saved.emailText && !isEmail(saved.emailText)) { setMsg(saveMsg, 'Enter a valid email address in the Contact email field.'); return; }
    var url = document.getElementById('portfolioUrl').value.trim();
    if (url && !safeHttp(url)) { setMsg(saveMsg, 'The portfolio URL must start with https:// or http://.'); return; }
    var cv = {};
    CV_IDS.forEach(function (id) { cv[id] = document.getElementById(id).value.trim(); });
    var ok = write(KEYS.edits, saved) && write(KEYS.cv, cv);
    if (url) { try { localStorage.setItem(KEYS.url, url); } catch (err) { ok = false; } } else { localStorage.removeItem(KEYS.url); }
    if (!ok) { setMsg(saveMsg, 'Could not save in this browser. Check that browser storage is allowed.'); return; }
    nodes.forEach(function (n) { setVal(n, saved[n.dataset.edit] || n.dataset.default); });
    syncEmail();
    setMsg(saveMsg, 'Saved in this browser.');
  });

  document.getElementById('dashboardReset').addEventListener('click', function () {
    if (!authed) { return; }
    if (!window.confirm('Reset all saved edits, attachments on existing items, CV details, profile photo, and portfolio URL in this browser? Items added under "Add to your portfolio" are kept.')) { return; }
    [KEYS.edits, KEYS.cv, KEYS.photo, KEYS.url, KEYS.attach].forEach(function (k) { localStorage.removeItem(k); });
    window.location.reload();
  });

  /* ---- profile photo ---- */
  document.getElementById('profileUpload').addEventListener('change', function (e) {
    var input = e.target; var file = input.files && input.files[0];
    if (!file || !authed) { return; }
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { setMsg(saveMsg, 'Please choose a JPG, PNG, or WebP image.'); input.value = ''; return; }
    if (file.size > 3 * 1024 * 1024) { setMsg(saveMsg, 'Please choose an image smaller than 3 MB.'); input.value = ''; return; }
    var reader = new FileReader();
    reader.onload = function () {
      try {
        localStorage.setItem(KEYS.photo, String(reader.result));
        applyEdits(); setMsg(saveMsg, 'Profile picture updated in this browser.');
      } catch (err) { setMsg(saveMsg, 'That image is too large for browser storage. Please choose a smaller one.'); }
    };
    reader.onerror = function () { setMsg(saveMsg, 'Could not read that image. Please try another.'); };
    reader.readAsDataURL(file);
  });

  /* ---- add and remove items ---- */
  document.getElementById('addEntryButton').addEventListener('click', function () {
    if (!authed) { return; }
    var type = document.getElementById('entryType').value;
    var title = document.getElementById('entryTitle').value.trim();
    var description = document.getElementById('entryDescription').value.trim();
    var link = document.getElementById('entryLink').value.trim();
    var fileInput = document.getElementById('entryFile');
    var file = fileInput.files && fileInput.files[0];
    if (!title && !description && !link && !file) { setMsg(saveMsg, 'Add a title, details, link, or file first.'); return; }
    if (link && !safeHttp(link)) { setMsg(saveMsg, 'Use a complete link beginning with https:// or http://.'); return; }
    if (file && file.size > 1800000) { setMsg(saveMsg, 'Please use a file smaller than 1.8 MB so it can be saved in this browser.'); return; }
    function finish(dataUrl) {
      var entries = read(KEYS.entries, []);
      entries.push({ type: type, title: title, description: description, link: link, dataUrl: dataUrl || '', fileName: file ? file.name : '' });
      if (!write(KEYS.entries, entries)) { setMsg(saveMsg, 'Could not save this item. Try a smaller attachment or remove older ones.'); return; }
      ['entryTitle', 'entryDescription', 'entryLink'].forEach(function (id) { document.getElementById(id).value = ''; });
      fileInput.value = '';
      renderEntries(); setMsg(saveMsg, 'Item added and saved in this browser.');
    }
    if (file) {
      var reader = new FileReader();
      reader.onload = function () { finish(String(reader.result || '')); };
      reader.onerror = function () { setMsg(saveMsg, 'Could not read that file. Please try another.'); };
      reader.readAsDataURL(file);
    } else { finish(''); }
  });

  document.getElementById('managedEntries').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-remove]');
    if (!btn || !authed) { return; }
    var entries = read(KEYS.entries, []);
    entries.splice(Number(btn.dataset.remove), 1);
    write(KEYS.entries, entries); renderEntries(); setMsg(saveMsg, 'Item removed.');
  });

  document.getElementById('attachButton').addEventListener('click', function () {
    if (!authed) { return; }
    var key = document.getElementById('attachTarget').value;
    var input = document.getElementById('attachFile');
    var caption = document.getElementById('attachCaption').value.trim();
    var file = input.files && input.files[0];
    if (!file) { setMsg(saveMsg, 'Choose a picture, video, or PDF first.'); return; }
    if (!MEDIA_OK.test(file.type)) { setMsg(saveMsg, 'Please choose a picture (JPG, PNG, WebP, GIF), a video (MP4 or WebM), or a PDF.'); return; }
    if (file.size > 1800000) { setMsg(saveMsg, 'Please use a file smaller than 1.8 MB so it can be saved in this browser.'); return; }
    var reader = new FileReader();
    reader.onload = function () {
      var store = read(KEYS.attach, {});
      (store[key] = store[key] || []).push({ dataUrl: String(reader.result || ''), fileName: file.name, caption: caption });
      if (!write(KEYS.attach, store)) { setMsg(saveMsg, 'Browser storage is full. Remove an older attachment or use a smaller file.'); return; }
      input.value = ''; document.getElementById('attachCaption').value = '';
      renderAttachments(); renderAttachmentAdmin(); setMsg(saveMsg, 'File attached and saved in this browser.');
    };
    reader.onerror = function () { setMsg(saveMsg, 'Could not read that file. Please try another.'); };
    reader.readAsDataURL(file);
  });

  document.getElementById('attachmentList').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-attach-key]');
    if (!btn || !authed) { return; }
    var store = read(KEYS.attach, {});
    var list = store[btn.dataset.attachKey] || [];
    list.splice(Number(btn.dataset.attachIndex), 1);
    if (list.length) { store[btn.dataset.attachKey] = list; } else { delete store[btn.dataset.attachKey]; }
    write(KEYS.attach, store); renderAttachments(); renderAttachmentAdmin(); setMsg(saveMsg, 'Attachment removed.');
  });

  applyEdits();
  renderEntries();
  renderAttachments();
})();
