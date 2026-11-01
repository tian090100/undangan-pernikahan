(function(root){
 'use strict';
 function create(options){
  const fetcher=options.fetchImpl||root.fetch.bind(root);
  const timeoutMs=options.timeoutMs??45000;
  const pause=options.pause||((ms)=>new Promise(resolve=>root.setTimeout(resolve,ms)));
  const offline=options.isOffline||(()=>typeof root.navigator!=='undefined'&&root.navigator.onLine===false);
  return async function request(action,fields={},token='',onRetry=()=>{}){
   // Retrying cancellation could hide its outcome. Only login and read are retried.
   const attempts=(action==='login'||action==='list')?2:1;
   for(let attempt=0;attempt<attempts;attempt++){
    if(offline())throw Error('network');
    const controller=new root.AbortController();
    let timedOut=false;
    const timer=root.setTimeout(()=>{timedOut=true;controller.abort()},timeoutMs);
    try{
     const response=await fetcher(options.endpoint,{method:'POST',cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',headers:{apikey:options.key,Authorization:'Bearer '+options.key,'Content-Type':'application/json'},body:JSON.stringify({action,...(token?{token}:{}),...fields}),signal:controller.signal});
     let data;try{data=await response.json()}catch{throw Error('unavailable')}
     if(response.status===401||response.status===403||response.status===429){throw Error(data.error||'unauthorized')}
     if(!response.ok)throw Error('unavailable');
     if(data.error)throw Error(data.error);
     return data;
    }catch(caught){
     const reason=timedOut?'timeout':caught instanceof TypeError?'network':caught.message;
     if(attempt+1<attempts&&['network','timeout','unavailable'].includes(reason)&&!offline()){
      onRetry();await pause(1200);continue;
     }
     throw Error(reason||'unavailable');
    }finally{root.clearTimeout(timer)}
   }
  };
 }
 const transport={create};
 if(typeof module!=='undefined'&&module.exports)module.exports=transport;
 else root.rexyAdminTransport=transport;
})(typeof globalThis!=='undefined'?globalThis:window);
