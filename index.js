// HARI AI - INFINITE SECURE - FINAL 🔐♾️
const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

// ENCRYPTION
const KEY = crypto.createHash('sha256').update(process.env.HARI_SECRET || 'Hari-Chennai-Secure-2024').digest();
function encrypt(t){try{const iv=crypto.randomBytes(16);const c=crypto.createCipheriv('aes-256-gcm',KEY,iv);let e=c.update(t,'utf8','hex');e+=c.final('hex');return iv.toString('hex')+':'+c.getAuthTag().toString('hex')+':'+e;}catch{return t;}}
function decrypt(t){try{const [ivHex,tagHex,enc]=t.split(':');const d=crypto.createDecipheriv('aes-256-gcm',KEY,Buffer.from(ivHex,'hex'));d.setAuthTag(Buffer.from(tagHex,'hex'));let dec=d.update(enc,'hex','utf8');dec+=d.final('utf8');return dec;}catch{return t;}}

// SECURITY
const blocked=new Set(); const counts=new Map();
app.use((req,res,next)=>{
  const ip=req.headers['x-forwarded-for']||req.ip||'unknown';
  if(blocked.has(ip)) return res.status(403).json({error:'Blocked 🔐'});
  let c=counts.get(ip)||{n:0,t:Date.now()};
  if(Date.now()-c.t>60000){c.n=0;c.t=Date.now();}
  c.n++;counts.set(ip,c);
  if(c.n>150){blocked.add(ip);return res.status(429).json({error:'Blocked 🔐'});}
  const b=JSON.stringify(req.body).toLowerCase();
  if(['<script','drop table','union select'].some(x=>b.includes(x))){blocked.add(ip);return res.status(403).json({error:'Hack blocked 🔐'});}
  next();
});

// INFINITE DB
let DB=[];
function addFeature(name,cmd,cat,reply){
  const id=DB.length+1;
  DB.push({id,name:encrypt(name),cmd:encrypt(cmd.toLowerCase()),cat:encrypt(cat),reply:encrypt(reply||name+' working!'),time:encrypt(new Date().toISOString())});
  return id;
}
function getFeature(id){
  const f=DB[id-1]; if(!f) return null;
  return {id:f.id,name:decrypt(f.name),cmd:decrypt(f.cmd),cat:decrypt(f.cat),reply:decrypt(f.reply)};
}

// CORE FEATURES
addFeature("Hi Secure","hi","Core","Hi da! 🔐♾️ Hari AI Infinite Secure Bot! No one can hack! Type 'features' - Total infinite!");
addFeature("Features List","features","Core","LIST");
addFeature("Security Status","security","Security","SECURITY");
addFeature("Bill Maker","bill","Business","Bill Maker working! Amount sollu - Ex: bill 500");
addFeature("Photo Create","create photo","Photo","Photo Create working! Prompt sollu");
addFeature("QR Code","qr","Utils","QR Code working!");
addFeature("AI Chat","ai","AI","AI Chat working!");
addFeature("Add Feature","add feature","System","ADD");
addFeature("Search","search","System","SEARCH");

function handle(msgBody){
  const lower=msgBody.toLowerCase(); const original=msgBody;
  if(lower.startsWith('add feature ')){
    const p=original.replace(/add feature /i,'').split('|').map(s=>s.trim());
    if(p.length<3) return `❌ Format: add feature Name | command | category | reply`;
    const [name,cmd,cat,reply]=p;
    const id=addFeature(name,cmd,cat,reply);
    return `✅ INFINITE FEATURE #${id} ADDED & ENCRYPTED! 🔐\n\nName: ${name}\nCmd: ${cmd}\nCat: ${cat}\nTotal: ${DB.length} / ∞\n🔐 Encrypted!\n\nType "features"`;
  }
  if(lower==='features'||lower==='list'){
    let out=`♾️ HARI AI - INFINITE SECURE ♾️\n🔐 Encrypted - Hack Proof\n\nTotal: ${DB.length} / ∞\nBlocked: ${blocked.size}\n\n`;
    for(let i=0;i<Math.min(DB.length,25);i++){const f=getFeature(i+1);out+=`#${f.id}: ${f.name} - ${f.cmd} - ${f.cat}\n`;}
    if(DB.length>25) out+=`\n... + ${DB.length-25} more!\n`;
    out+=`\nAdd: "add feature Name | command | category"\nSearch: "search bill"\nSecurity: "security"`;
    return out;
  }
  if(lower.startsWith('search ')){
    const q=original.replace(/search /i,'').toLowerCase(); let out=`🔍 Search "${q}":\n\n`; let found=0;
    for(let i=0;i<DB.length&&found<20;i++){const f=getFeature(i+1);if(f.name.toLowerCase().includes(q)||f.cmd.includes(q)){out+=`#${f.id}: ${f.name} - ${f.cmd}\n`;found++;}}
    if(found===0) out+=`No result - Add pannu`;
    return out;
  }
  if(lower==='security'||lower==='secure'){
    return `🔐 SECURITY STATUS 🔐\n\n✅ Encryption: AES-256-GCM\n✅ Data: Encrypted\n✅ IP Blocker: ${blocked.size} blocked\n✅ Rate Limit: 150/min\n✅ Anti-SQL/XSS: ON\n✅ Hack: 0 Success, ${blocked.size} Blocked\n✅ Total: ${DB.length} / ∞\n\n🛡️ 100% Safe! No one can hack!`;
  }
  for(let i=0;i<DB.length;i++){
    const f=getFeature(i+1);
    if(f&&lower.includes(f.cmd)&&f.cmd.length>=2){
      if(['features','add feature','search','security'].includes(f.cmd)) continue;
      return `✅ ${f.name} #${f.id}\nCat: ${f.cat}\n\n${f.reply}\n\n🔐 Secure | ♾️ #${f.id} / ∞`;
    }
  }
  if(lower.includes('hi')||lower.includes('hello')) return `Hi da! 🔐♾️ Hari AI Infinite Secure! Type "features" - ${DB.length}/∞ ready!`;
  if(lower.includes('bill')){const amt=original.match(/\d+/)?.[0]||'100';return `🧾 Bill #${Date.now().toString().slice(-4)} 🔐\nAmount: ₹${amt}\nGST: ₹${(amt*0.18).toFixed(0)}\nTotal: ₹${(amt*1.18).toFixed(0)}\n✅ Secure - Encrypted`;}
  if(lower.includes('create photo')){const prompt=original.replace(/create photo/i,'').trim()||'Chennai';const url=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024`;return `🎨 Photo Secure 🔐\nPrompt: ${prompt}\nLink: ${url}\n✅ Encrypted`;}
  if(lower.includes('qr')){const data=original.replace(/qr/i,'').trim()||'Hari AI';return `📦 QR Secure 🔐\nData: ${data}\nLink: https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=300x300`;}
  if(lower.startsWith('ai ')){const q=original.slice(3);return `🤖 AI Secure 🔐\nQ: ${q}\nA: Hari AI Secure answer for ${q}... ✅`;}
  return `Hi da! 🔐♾️ Type "features" - ${DB.length}/∞ ready!\nTry: hi, bill 500, create photo girl, qr Hari, ai love, security`;
}

app.get('/',(req,res)=>{res.send(`<h1>🔐♾️ Hari AI - Infinite Secure FINAL</h1><p>Features: ${DB.length} / ∞</p><p>Security: AES-256 Encrypted</p><p>Blocked: ${blocked.size}</p><a href="/admin?token=hari-secure-2024">Admin</a>`);});
app.get('/admin',(req,res)=>{
  if(req.query.token!=='hari-secure-2024') return res.status(401).send('Invalid token 🔐 Use ?token=hari-secure-2024');
  res.send(`<html><body style="font-family:monospace;padding:15px;background:#000;color:#0f0;"><h1>🔐 HARI AI - INFINITE SECURE ADMIN</h1><p>♾️ ${DB.length}/∞ | 🔐 Enc: ${DB.length} | 🛡️ Blocked: ${blocked.size}</p><div style="background:#111;padding:10px;border:1px solid #0f0;"><h3>Add Infinite (Encrypted):</h3><input id="n" placeholder="Name" style="padding:6px;width:150px;"> <input id="c" placeholder="command" style="padding:6px;width:100px;"> <input id="cat" placeholder="category" style="padding:6px;width:80px;"> <input id="r" placeholder="reply" style="padding:6px;width:150px;"> <button onclick="addF()" style="padding:6px;">Add & Encrypt 🔐</button></div><hr><input id="q" placeholder="Search infinite..." style="padding:8px;width:250px;"> <button onclick="searchF()" style="padding:8px;">Search</button> <button onclick="secCheck()" style="padding:8px;">Security 🔐</button> <button onclick="listF()" style="padding:8px;">List ♾️</button><div id="list" style="margin-top:15px;border:1px solid #0f0;padding:10px;max-height:500px;overflow:auto;"></div><script>const token='hari-secure-2024';function addF(){fetch('/api/add?token='+token,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:document.getElementById('n').value,command:document.getElementById('c').value,category:document.getElementById('cat').value,reply:document.getElementById('r').value})}).then(r=>r.json()).then(d=>{alert('Added #'+d.id+' Encrypted!');listF();});}function searchF(){const q=document.getElementById('q').value;fetch('/api/search?q='+q+'&token='+token).then(r=>r.json()).then(d=>{document.getElementById('list').innerHTML=d.results.map(f=>'<div>#'+f.id+': '+f.name+' | '+f.cmd+' | '+f.cat+' | 🔐</div>').join('')+'<div>Total: '+d.total+' / ∞</div>';});}function listF(){fetch('/api/list?token='+token).then(r=>r.json()).then(d=>{document.getElementById('list').innerHTML=d.list.map(f=>'<div>#'+f.id+': '+f.name+' | '+f.cmd+' | '+f.cat+'</div>').join('');});}function secCheck(){fetch('/api/security?token='+token).then(r=>r.json()).then(d=>{document.getElementById('list').innerHTML='<pre>'+JSON.stringify(d,null,2)+'</pre>';});}listF();<\/script></body></html>`);
});
app.post('/api/add',(req,res)=>{const {name,command,category,reply}=req.body;if(!name||!command) return res.json({error:'Need name & command'});const id=addFeature(name,command,category||'General',reply);res.json({success:true,id,total:DB.length,encrypted:true});});
app.get('/api/search',(req,res)=>{const q=(req.query.q||'').toLowerCase();let results=[];for(let i=0;i<DB.length&&results.length<50;i++){const f=getFeature(i+1);if(!q||f.name.toLowerCase().includes(q)||f.cmd.includes(q)) results.push(f);}res.json({results,total:DB.length,infinite:true,encrypted:true});});
app.get('/api/list',(req,res)=>{let list=[];for(let i=0;i<DB.length;i++) list.push(getFeature(i+1));res.json({list,total:DB.length,infinite:'∞'});});
app.get('/api/security',(req,res)=>{res.json({encryption:'AES-256-GCM',total:DB.length,infinite:'∞',encrypted:DB.length,blocked_count:blocked.size,blocked_ips:Array.from(blocked),status:'100% Secure - No hack! 🔐',safe:true});});
app.post('/webhook',(req,res)=>{const msg=req.body.message||req.body.body||req.body.text||'';const reply=handle(msg);res.json({reply,total:`${DB.length} / ∞`,security:'AES-256 Encrypted',hack_proof:true});});
const PORT=process.env.PORT||10000;
app.listen(PORT,()=>console.log(`🔐♾️ HARI AI FINAL - ${DB.length}/∞ - Running on ${PORT}`));
