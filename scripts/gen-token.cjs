const crypto = require('crypto');
function base64url(s){
  return Buffer.from(s).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
const payload = base64url(JSON.stringify({ id: 'dev-user', role: 'admin', exp: Math.floor(Date.now()/1000) + 7*24*3600 }));
const secret = 'dev-secret-change-in-production';
const sig = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
console.log(`${header}.${payload}.${sig}`);
