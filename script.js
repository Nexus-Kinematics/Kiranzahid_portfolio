const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '✕' : '☰';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.textContent = '☰';
}));
document.getElementById('year').textContent = new Date().getFullYear();

// Browser-local personal dashboard: editable text is stored in localStorage.
const dashboard = document.getElementById('personalDashboard');
const backdrop = document.getElementById('dashboardBackdrop');
const editorFields = document.getElementById('editorFields');
const editorForm = document.getElementById('portfolioEditor');
const loginForm = document.getElementById('dashboardLogin');
const loginMessage = document.getElementById('loginMessage');
const DASHBOARD_USERNAME = 'kiran12345';
const DASHBOARD_PASSWORD = 'kiran123@#zahid';
let dashboardAuthenticated = false;
const saveMessage = document.getElementById('saveMessage');
const STORAGE_KEY = 'kiranPortfolioEditsV1';

// CV editor fields are stored independently and feed the generated PDF.
const CV_STORAGE_KEY='kiranPortfolioCVFieldsV2';
const cvFieldIds=['cvPhone','cvLocation','cvSummary','cvSkills','cvEducation','cvCertifications','cvExperience','cvLanguages','cvAvailability'];
function loadCVFields(){try{const saved=JSON.parse(localStorage.getItem(CV_STORAGE_KEY)||'{}');cvFieldIds.forEach(id=>{const el=document.getElementById(id);if(el&&Object.prototype.hasOwnProperty.call(saved,id))el.value=saved[id];});}catch(e){}}
function saveCVFields(){const values={};cvFieldIds.forEach(id=>{const el=document.getElementById(id);if(el)values[id]=el.value.trim();});try{localStorage.setItem(CV_STORAGE_KEY,JSON.stringify(values));}catch(e){}return values;}

const labels = {
 heroName:'Name heading', heroRole:'Professional title', heroDescription:'Intro / headline description',
 aboutLead:'About headline', aboutText:'About paragraph', experienceTitle:'Internship / experience title', experienceText:'Experience description',
 learning1Title:'Education heading', learning1Text:'Education details', learning2Title:'AI Mastery heading', learning2Text:'AI Mastery details', learning3Title:'Modern Robotics heading', learning3Text:'Modern Robotics details', emailText:'Contact email',
 project1Title:'CKD Screening AI — title', project1Description:'CKD Screening AI — description', project1Status:'CKD Screening AI — status',
 project2Title:'Lead Qualification — title', project2Description:'Lead Qualification — description',
 project3Title:'Customer Support Agent — title', project3Description:'Customer Support Agent — description',
 project4Title:'AQSA POS Testing — title', project4Description:'AQSA POS Testing — description', project4Status:'AQSA POS Testing — status',
 project5Title:'Fire Chaser Robot — title', project5Description:'Fire Chaser Robot — description', project5Status:'Fire Chaser Robot — status'
};
const groups = {
 'Profile & About':['heroName','heroRole','heroDescription','aboutLead','aboutText','emailText'],
 'Projects — edit titles, descriptions, and statuses':['project1Title','project1Description','project1Status','project2Title','project2Description','project3Title','project3Description','project4Title','project4Description','project4Status','project5Title','project5Description','project5Status'],
 'Experience & Learning':['experienceTitle','experienceText','learning1Title','learning1Text','learning2Title','learning2Text','learning3Title','learning3Text']
};
function getEditableNodes(){ return [...document.querySelectorAll('[data-edit]')]; }
function loadEdits(){
  let saved={}; try{ saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); }catch(e){}
  getEditableNodes().forEach(node=>{ const key=node.dataset.edit; if(Object.prototype.hasOwnProperty.call(saved,key)) node.textContent=saved[key]; });
  loadCVFields();
  const portfolioUrlInput=document.getElementById('portfolioUrl');
  if(portfolioUrlInput) portfolioUrlInput.value=saved.portfolioUrl||localStorage.getItem('kiranPortfolioUrlV1')||'';
  const savedPhoto=localStorage.getItem('kiranProfilePhotoV1');
  if(savedPhoto){const pic=document.getElementById('profilePicture'); if(pic)pic.src=savedPhoto;}
  const email=document.querySelector('[data-email-link]'); const text=document.querySelector('[data-edit="emailText"]');
  if(email && text) email.href='mailto:'+text.textContent.trim();
}
function buildEditor(){
  editorFields.innerHTML='';
  Object.entries(groups).forEach(([groupName,keys])=>{
    const section=document.createElement('section'); section.className='editor-group';
    const heading=document.createElement('h3'); heading.textContent=groupName; section.appendChild(heading);
    keys.forEach(key=>{
      const node=document.querySelector(`[data-edit="${key}"]`); if(!node)return;
      const label=document.createElement('label'); label.className='editor-field';
      const caption=document.createElement('span'); caption.textContent=labels[key]||key; label.appendChild(caption);
      const input=(key.toLowerCase().includes('description')||key.toLowerCase().includes('text')||key==='heroRole'||key==='aboutLead')?document.createElement('textarea'):document.createElement('input');
      if(input.tagName==='INPUT') input.type='text'; input.name=key; input.value=node.textContent.trim();
      label.appendChild(input); section.appendChild(label);
    }); editorFields.appendChild(section);
  });
}
function openDashboard(){ loginForm.hidden=false; editorForm.hidden=true; loginForm.reset(); loginMessage.textContent=''; dashboard.classList.add('open'); dashboard.setAttribute('aria-hidden','false'); backdrop.hidden=false; document.body.style.overflow='hidden'; }
function closeDashboard(){ dashboard.classList.remove('open'); dashboard.setAttribute('aria-hidden','true'); backdrop.hidden=true; document.body.style.overflow=''; dashboardAuthenticated=false; }
document.getElementById('dashboardOpen').addEventListener('click',openDashboard);
document.getElementById('dashboardClose').addEventListener('click',closeDashboard);
backdrop.addEventListener('click',closeDashboard);
loginForm.addEventListener('submit',e=>{
  e.preventDefault();
  const username=document.getElementById('dashboardUsername').value;
  const password=document.getElementById('dashboardPassword').value;
  if(username===DASHBOARD_USERNAME && password===DASHBOARD_PASSWORD){
    dashboardAuthenticated=true; loginMessage.textContent=''; loginForm.hidden=true; editorForm.hidden=false; buildEditor();
  } else { loginMessage.textContent='Incorrect username or password. Please try again.'; document.getElementById('dashboardPassword').value=''; }
});
document.getElementById('dashboardLogout').addEventListener('click',()=>{dashboardAuthenticated=false;openDashboard();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDashboard();});
editorForm.addEventListener('submit',e=>{
  e.preventDefault(); if(!dashboardAuthenticated)return; const saved={}; new FormData(editorForm).forEach((value,key)=>{saved[key]=String(value).trim();}); if(saved.portfolioUrl!==undefined)localStorage.setItem('kiranPortfolioUrlV1',saved.portfolioUrl);
  getEditableNodes().forEach(node=>{if(Object.prototype.hasOwnProperty.call(saved,node.dataset.edit))node.textContent=saved[node.dataset.edit];});
  const email=document.querySelector('[data-email-link]'); const emailText=document.querySelector('[data-edit="emailText"]'); if(email&&emailText)email.href='mailto:'+emailText.textContent.trim();
  saveCVFields();
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));saveMessage.textContent='Saved on this browser. Refresh to confirm your changes.';}catch(err){saveMessage.textContent='Could not save in this browser. Check browser storage settings.';}
  buildEditor();
});
document.getElementById('dashboardReset').addEventListener('click',()=>{
  if(!confirm('Reset all saved portfolio edits in this browser? This restores the original text.'))return;
  localStorage.removeItem(STORAGE_KEY); location.reload();
});
loadEdits();


// Profile picture changes are stored locally in this browser.
const profileUpload = document.getElementById('profileUpload');
if(profileUpload){
  profileUpload.addEventListener('change',()=>{
    const file=profileUpload.files && profileUpload.files[0];
    if(!file)return;
    if(!file.type.startsWith('image/')){alert('Please choose an image file.');profileUpload.value='';return;}
    if(file.size>3*1024*1024){alert('Please choose an image smaller than 3 MB.');profileUpload.value='';return;}
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        localStorage.setItem('kiranProfilePhotoV1',String(reader.result));
        const pic=document.getElementById('profilePicture'); if(pic)pic.src=String(reader.result);
        saveMessage.textContent='Profile picture updated in this browser. Click Save changes to save other edits.';
      }catch(err){alert('This image is too large for browser storage. Please choose a smaller image.');}
    };
    reader.readAsDataURL(file);
  });
}

// Build and download a real PDF CV from current portfolio + admin CV fields.
function downloadPortfolioCV(){
  const cv=saveCVFields();
  const getText=(selector)=>{const n=document.querySelector(selector);return n?n.innerText.trim():'';};
  const name=getText('[data-edit="heroName"]')||'Kiran Zahid';
  const role=getText('[data-edit="heroRole"]')||'AI & Robotics Developer';
  const email=(getText('[data-edit="emailText"]')||'kiranzahid188@gmail.com').trim();
  const portfolioUrl=(document.getElementById('portfolioUrl')?.value||localStorage.getItem('kiranPortfolioUrlV1')||'').trim();
  const links=[['LinkedIn','https://www.linkedin.com/in/kiran-zahid-3a4a5a433'],['GitHub','https://github.com/Nexus-Kinematics'],['Fiverr','https://www.fiverr.com/s/Vrrma2z'],['Upwork','https://www.upwork.com/freelancers/~01c463310230087cd5?mp_source=share']];
  if(portfolioUrl && /^https?:\/\//i.test(portfolioUrl)) links.push(['Portfolio Website',portfolioUrl]);
  const projects=[...document.querySelectorAll('.project-card')].map(card=>({title:card.querySelector('h3')?.innerText.trim()||'Project',desc:card.querySelector('.project-info p')?.innerText.trim()||'',status:card.querySelector('.project-status')?.innerText.trim()||card.querySelector('.project-meta')?.innerText.trim()||''}));
  readManagedEntries().forEach(item=>{if(item.type==='project')projects.push({title:item.title||'Project',desc:item.description||'',status:item.link?'Project link: '+item.link:''});});
  if(!window.jspdf || !window.jspdf.jsPDF){
    alert('The PDF generator could not load. Connect to the internet, refresh this page, and try Download CV again.');return;
  }
  const doc=new window.jspdf.jsPDF({unit:'pt',format:'a4'});
  const margin=48, width=doc.internal.pageSize.getWidth()-margin*2, pageH=doc.internal.pageSize.getHeight();let y=54;
  const addPageIfNeeded=(need=28)=>{if(y+need>pageH-48){doc.addPage();y=52;}};
  const heading=(text)=>{addPageIfNeeded(34);y+=8;doc.setFont('helvetica','bold');doc.setFontSize(12);doc.setTextColor(91,53,165);doc.text(text.toUpperCase(),margin,y);y+=8;doc.setDrawColor(139,92,246);doc.line(margin,y,margin+width,y);y+=15;};
  const paragraph=(text,opts={})=>{if(!text)return;doc.setFont('helvetica',opts.bold?'bold':'normal');doc.setFontSize(opts.size||9.5);doc.setTextColor(38,38,48);const lines=doc.splitTextToSize(String(text),width);addPageIfNeeded(lines.length*13+5);doc.text(lines,margin,y);y+=lines.length*13+5;};
  const linesSection=(title,content)=>{if(!String(content||'').trim())return;heading(title);String(content).split(/\r?\n/).forEach(line=>paragraph(line.replace(/^•\s*/, '• ')));};
  doc.setFont('helvetica','bold');doc.setFontSize(23);doc.setTextColor(24,20,35);doc.text(name,margin,y);y+=25;
  doc.setFont('helvetica','normal');doc.setFontSize(13);doc.setTextColor(105,70,170);doc.text(role,margin,y);y+=18;
  paragraph([cv.cvLocation||'Dina, District Jhelum, Punjab, Pakistan',cv.cvPhone||'03187977782',email].filter(Boolean).join('  |  '));
  if(email){doc.setTextColor(91,53,165);doc.setFontSize(9);doc.textWithLink(email,margin,y,{url:'mailto:'+email});y+=14;}
  let x=margin;
  links.forEach(([label,url])=>{doc.setFontSize(9);doc.setTextColor(91,53,165);doc.textWithLink(label,x,y,{url});x+=doc.getTextWidth(label)+18;if(x>margin+width-70){x=margin;y+=14;addPageIfNeeded(20);}});y+=18;
  heading('Professional Summary');paragraph(cv.cvSummary||getText('[data-edit="heroDescription"]'));
  linesSection('Core Skills',cv.cvSkills);
  heading('Projects');projects.forEach(p=>{addPageIfNeeded(45);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(32,32,43);doc.text(doc.splitTextToSize(p.title,width),margin,y);y+=13;paragraph(p.desc);if(p.status)paragraph('Status: '+p.status,{size:8.5});});
  linesSection('Professional Experience',cv.cvExperience);
  linesSection('Education',cv.cvEducation);
  linesSection('Certifications & Specialized Learning',cv.cvCertifications);
  linesSection('Languages',cv.cvLanguages);
  linesSection('Availability',cv.cvAvailability);
  const extraEducation=readManagedEntries().filter(item=>item.type==='education');
  const extraCertificates=readManagedEntries().filter(item=>item.type==='certificate');
  if(extraEducation.length){heading('Additional Education');extraEducation.forEach(item=>{paragraph((item.title||'Education')+(item.description?' — '+item.description:''));if(item.link&&/^https?:\/\//i.test(item.link)){doc.setTextColor(91,53,165);doc.textWithLink('Related link',margin,y,{url:item.link});y+=13;}});}
  if(extraCertificates.length){heading('Certificates');extraCertificates.forEach(item=>{paragraph((item.title||'Certificate')+(item.description?' — '+item.description:''));if(item.link&&/^https?:\/\//i.test(item.link)){doc.setTextColor(91,53,165);doc.textWithLink('Verify / view certificate',margin,y,{url:item.link});y+=13;}});}
  // Add clickable project links for any managed project that has a URL.
  const linkedProjects=readManagedEntries().filter(item=>item.type==='project'&&item.link&&/^https?:\/\//i.test(item.link));
  if(linkedProjects.length){heading('Project Links');linkedProjects.forEach(item=>{addPageIfNeeded(18);doc.setFontSize(9);doc.setTextColor(91,53,165);doc.textWithLink(item.title||item.link,margin,y,{url:item.link});y+=14;});}
  doc.save('Kiran_Zahid_CV.pdf');
}
const cvButton=document.getElementById('downloadCv');
if(cvButton)cvButton.addEventListener('click',downloadPortfolioCV);

// Persist portfolio website URL separately for CV generation and dashboard reopening.
const portfolioUrlInput=document.getElementById('portfolioUrl');
if(portfolioUrlInput){
  portfolioUrlInput.addEventListener('change',()=>localStorage.setItem('kiranPortfolioUrlV1',portfolioUrlInput.value.trim()));
}

// Optional portfolio items: education, certificates, projects, or anything else.
const ENTRY_STORAGE_KEY = 'kiranPortfolioManagedEntriesV1';
function readManagedEntries(){ try { return JSON.parse(localStorage.getItem(ENTRY_STORAGE_KEY)||'[]'); } catch(e){ return []; } }
function safeText(value){ return String(value||'').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function renderManagedEntries(){
  const entries=readManagedEntries();
  const publicWrap=document.getElementById('publicManagedEntries');
  const section=document.getElementById('addedContent');
  if(section) section.hidden=entries.length===0;
  if(publicWrap) publicWrap.innerHTML=entries.map((item,index)=>{
    let media='';
    if(item.dataUrl && item.fileType && item.fileType.startsWith('image/')) media=`<img class="managed-media" src="${item.dataUrl}" alt="${safeText(item.title)}">`;
    else if(item.dataUrl && item.fileType && item.fileType.startsWith('video/')) media=`<video class="managed-media" src="${item.dataUrl}" controls preload="metadata"></video>`;
    else if(item.dataUrl) media=`<p><a class="managed-link" href="${item.dataUrl}" download="${safeText(item.fileName||item.title||'portfolio-file')}">Open / download attached document ↗</a></p>`;
    const link=item.link?`<p><a class="managed-link" href="${safeText(item.link)}" target="_blank" rel="noopener noreferrer">Open related link ↗</a></p>`:'';
    return `<article class="managed-card"><p class="eyebrow">${safeText(item.typeLabel||'ADDED ITEM')}</p><h3>${safeText(item.title||'Untitled item')}</h3><p>${safeText(item.description||'')}</p>${media}${link}</article>`;
  }).join('');
  const adminWrap=document.getElementById('managedEntries');
  if(adminWrap) adminWrap.innerHTML=entries.map((item,index)=>`<div class="managed-admin-row"><div><strong>${safeText(item.title||'Untitled item')}</strong><small>${safeText(item.typeLabel||'Item')}${item.fileName?' · '+safeText(item.fileName):''}${item.link?' · link added':''}</small></div><button type="button" class="button button-secondary managed-remove" data-remove-entry="${index}">Remove</button></div>`).join('') || '<p class="dashboard-subtitle">No extra items yet. Add only what you want to show.</p>';
}
const addEntryButton=document.getElementById('addEntryButton');
if(addEntryButton) addEntryButton.addEventListener('click',()=>{
  if(!dashboardAuthenticated) return;
  const type=document.getElementById('entryType').value;
  const title=document.getElementById('entryTitle').value.trim();
  const description=document.getElementById('entryDescription').value.trim();
  const link=document.getElementById('entryLink').value.trim();
  const fileInput=document.getElementById('entryFile');
  const file=fileInput.files && fileInput.files[0];
  if(!title && !description && !link && !file){ saveMessage.textContent='Add a title, details, link, or file first.'; return; }
  if(link && !/^https?:\/\//i.test(link)){ saveMessage.textContent='Use a complete link beginning with https:// or http://.'; return; }
  if(file && file.size>1800000){ saveMessage.textContent='Please use a file smaller than 1.8 MB so it can be saved in this browser.'; return; }
  const finish=(dataUrl='')=>{
    const labels={education:'EDUCATION',certificate:'CERTIFICATE',project:'PROJECT',extra:'MORE'};
    const item={type,typeLabel:labels[type]||'MORE',title,description,link,dataUrl,fileType:file?file.type:'',fileName:file?file.name:''};
    const entries=readManagedEntries(); entries.push(item);
    try{ localStorage.setItem(ENTRY_STORAGE_KEY,JSON.stringify(entries)); }
    catch(err){ saveMessage.textContent='Could not save this item. Try a smaller attachment or remove older attachments.'; return; }
    document.getElementById('entryTitle').value=''; document.getElementById('entryDescription').value=''; document.getElementById('entryLink').value=''; fileInput.value='';
    saveMessage.textContent='Item added and saved in this browser.'; renderManagedEntries();
  };
  if(file){ const reader=new FileReader(); reader.onload=()=>finish(String(reader.result||'')); reader.onerror=()=>{saveMessage.textContent='Could not read that file. Please try another.';}; reader.readAsDataURL(file); }
  else finish('');
});
const managedEntries=document.getElementById('managedEntries');
if(managedEntries) managedEntries.addEventListener('click',event=>{
  const button=event.target.closest('[data-remove-entry]'); if(!button || !dashboardAuthenticated)return;
  const entries=readManagedEntries(); entries.splice(Number(button.dataset.removeEntry),1); localStorage.setItem(ENTRY_STORAGE_KEY,JSON.stringify(entries)); renderManagedEntries(); saveMessage.textContent='Item removed.';
});
renderManagedEntries();
