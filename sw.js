const CACHE_NAME = 'jogo-dia-a-dia-v9'; // Versão atualizada

const urlsToCache = [
  './',
  './index.html',
  './manifest.json', 
  './style.css',
  './script.js',
  './jogo-rua.js',
  './jogo-emocoes.js',
  './jogo-sentidos.js',
  './jogo-reciclagem.js',
  './jogo-respiracao.js', 
  
  // Imagens base
  './fundo.png',
  './personagem.png',
  './carro.png',
  
 // Imagens das Emoções
  './images/rosto_alegre.png',
  './images/rosto_triste.png',
  './images/rosto_raiva.png',
  './images/rosto_medo.png',
  './images/rosto_nojinho.png',
  './images/rosto_tedio.png',
  './images/rosto_vergonha.png',
  './images/rosto_ansiedade.png',
  './images/parabens.png', 

  // Imagens da Reciclagem
  './images/trash/garrafa-pet.png',
  './images/trash/jornal.png',
  './images/trash/lata-refri.png',
  './images/trash/garrafa-vidro.png',
 './images/trash/casca-banana.png',

  // Sons da Respiração
  './sounds/ambient-zen.wav',
  './sounds/voice-inspire.wav',
  './sounds/voice-expire.wav',
  './sounds/zen-ding.wav',
  './sounds/zen-victory.wav',

  // Ícones do PWA
  './images/icon-192.png',
  './images/icon-512.png'
];

// --- CORREÇÃO 1 (skipWaiting) ---
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// --- CORREÇÃO 2 (clients.claim) ---
self.addEventListener('activate', event => {
  event.waitUntil(
  	caches.keys().then(keys => Promise.all(
  		// Filtra todos os caches que NÃO sejam o cache atual (v9)
  		keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
  	)).then(() => self.clients.claim()) // Assume o controle imediato
  );
});

// --- CORREÇÃO 3 (Stale-While-Revalidate) ---
self.addEventListener('fetch', event => {
  event.respondWith(
  	caches.match(event.request).then(cacheRes => {
  		// Busca na rede (fetch) em paralelo
  		const fetchRes = fetch(event.request).then(networkRes => {
  			// Se a busca funcionar, atualiza o cache
  			caches.open(CACHE_NAME).then(cache => {
  				cache.put(event.request, networkRes.clone());
  			});
  			return networkRes;
  		}).catch(() => {
  			// Se o fetch falhar (offline), não faz nada aqui, 
  			// pois o cacheRes (se existir) já será retornado.
  		});
  		
  		// Retorna o cache imediatamente (rápido) se existir,
  		// senão, espera a resposta da rede.
  		return cacheRes || fetchRes;
  	})
  );
});