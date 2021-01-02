//Minimal Precaching & Runtime Caching ServiceWorker

//https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker

const filesToCache = [
          'index.html',
          'page1.js',
          'page2.js',
          'page1.html',
          'page2.html',
          'route-config.js',
          'router.js'
        ];

const staticCacheName = 'cache-v6';

importScripts('./route-config.js');

//Setting up precaching
self.addEventListener('install', async event => {
  self.skipWaiting();

  //create preCache
  async function precache(){
    const cache = await caches.open(staticCacheName);
    cache.addAll(filesToCache);
  }
  
  //do not finish install until precaching is complete
  event.waitUntil(precache());
});


self.addEventListener('activate', event => {

  const clearCaches = async ()=>{
    const keys = await caches.keys();
    const oldKeys = keys.filter(key => key !== staticCacheName);
    if(oldKeys.length > 0){
      const promises = oldKeys.map(key=>caches.delete(key));
      return Promise.all(promises);
    }
    return oldKeys;
  }

  event.waitUntil(clearCaches());

});

//returns a cached response or undefined
async function checkCache(request){
  return caches.match(request);
}

//stores a response in cache
async function cacheResponse(url, response){
  const cache = await caches.open(staticCacheName);
  cache.put(url, response);
}

function getPathName(url){
  const res = url.split('/');
  const [first, second, third, ...path] = res;
  return `/${path}`;
}

//makes a fetch request but checks the cache first
async function cacheFirstRequest(request){

  try{
    const cachedResponse = await checkCache(request);
    
    if(cachedResponse){
      return cachedResponse;
    }else{
      const newResponse = await fetch(request);

      if(!newResponse.ok){
        return caches.match(`index.html`);
      }else{
        const clone = await newResponse.clone();
        cacheResponse(request.url, clone);
        return newResponse;
      }
    }

  }catch(e){
    console.error(e);
    return caches.match('/offline.html');
  }

}

self.addEventListener('fetch', event => {
  event.respondWith(cacheFirstRequest(event.request));
});
