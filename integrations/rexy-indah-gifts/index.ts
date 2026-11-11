const origins = new Set(['https://www.daprita.web.id','https://daprita.web.id','http://127.0.0.1:4174','http://localhost:4174']);
Deno.serve(async req => {
 const origin=req.headers.get('origin')||'';
 const headers={'Content-Type':'application/json','Access-Control-Allow-Origin':origins.has(origin)?origin:'https://www.daprita.web.id','Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Vary':'Origin','Cache-Control':'no-store'};
 const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
 if(origin&&!origins.has(origin)) return reply({error:'origin'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 let method='rexy_demo_gifts',body={};
 if(req.method==='POST'){
  if(Number(req.headers.get('content-length'))>2048)return reply({error:'invalid'},400);
  let b;try{const raw=await req.text();if(raw.length>2048)return reply({error:'invalid'},400);b=JSON.parse(raw)}catch{return reply({error:'invalid'},400)}
  const name=String(b.name||'').trim(),digits=String(b.phone||'').replace(/[^0-9]/g,'');
  const phone=digits.startsWith('0')?'62'+digits.slice(1):digits;
  if(!["air_fryer","coffee_machine","knife_set","wok_pan","cookware_set","vacuum","vacuum_mop","rice_cooker","air_purifier","air_cooler","ps5","tv"].includes(b.gift)||name.length<2||name.length>80||!/^62[0-9]{8,13}$/.test(phone)||b.website)return reply({error:'invalid'},400);
  method='rexy_demo_book';body={p_gift:b.gift,p_name:name,p_phone:phone};
 }else if(req.method!=='GET')return reply({error:'method'},405);
 const key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 try{
 const res=await fetch(Deno.env.get('SUPABASE_URL')+'/rest/v1/rpc/'+method,{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(body)});
 if(!res.ok)return reply({error:'unavailable'},503);
 const data=await res.json();
 return reply(req.method==='GET'?{booked:data.map(x=>x.gift)}:{result:data});
 }catch{return reply({error:'unavailable'},503)}
});
