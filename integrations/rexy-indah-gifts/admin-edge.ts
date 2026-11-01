const allowed=new Set(['https://www.daprita.web.id','https://daprita.web.id','http://127.0.0.1:4174','http://localhost:4174']);
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Access-Control-Allow-Origin':allowed.has(origin)?origin:'https://www.daprita.web.id','Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS',Vary:'Origin','X-Content-Type-Options':'nosniff'};
 const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(origin&&!allowed.has(origin))return reply({error:'forbidden'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply({error:'method'},405);
 let b;try{const raw=await req.text();if(raw.length>4096)return reply({error:'invalid'},400);b=JSON.parse(raw)}catch{return reply({error:'invalid'},400)}
 if(!b||!['login','list','cancel','logout'].includes(b.action))return reply({error:'invalid'},400);
 const params={p_action:b.action};
 if(b.action==='login'){
  if(typeof b.username!=='string'||b.username.length>80||typeof b.password!=='string'||b.password.length>128)return reply({error:'invalid'},400);
  params.p_username=b.username.trim().toLowerCase();params.p_password=b.password;
 }else{
  if(typeof b.token!=='string'||!/^[a-f0-9]{64}$/.test(b.token))return reply({error:'unauthorized'},401);
  params.p_token=b.token;
  if(b.action==='cancel'){
   if(!["air_fryer","coffee_machine","knife_set","wok_pan","cookware_set","vacuum","vacuum_mop","rice_cooker","air_purifier","air_cooler","ps5","fridge","tv"].includes(b.gift)||typeof b.created!=='string'||!Number.isFinite(Date.parse(b.created)))return reply({error:'invalid'},400);
   params.p_gift=b.gift;params.p_created=b.created;
  }
 }
 try{
 const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 const r=await fetch(Deno.env.get('SUPABASE_URL')+'/rest/v1/rpc/rexy_registry_admin',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(params)});
 if(!r.ok)return reply({error:'unavailable'},503);
 const data=await r.json();
 return reply(data,data.error==='unauthorized'?401:data.error==='locked'?429:data.error==='invalid_login'?401:200);
 }catch{return reply({error:'unavailable'},503)}
});
