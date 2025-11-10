const CACHE_NAME = 'jogo-dia-a-dia-v11'; // Versão atualizada

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
  './jogo-memoria.js', 
  
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
  './sounds/ambient-zen.mp3',
  './sounds/voice-inspire.mp3',
  './sounds/voice-expire.mp3',
  './sounds/zen-ding.mp3',
  './sounds/zen-victory.mp3',

  // (NOVOS) Sons da Memória
  './sounds/memory-1.mp3',
  './sounds/memory-2.mp3',
  './sounds/memory-3.mp3',
  './sounds/memory-4.mp3',
  './sounds/memory-error.mp3',

  // Ícones do PWA
  './images/icon-192.png',
  './images/icon-512.png'
];

// Instala o SW (skipWaiting)
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Ativa o SW (clients.claim)
self.addEventListener('activate', event => {
  event.waitUntil(
  	caches.keys().then(keys => Promise.all(
  		keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
  	)).then(() => self.clients.claim()) 
  );
});

// Fetch (Stale-While-Revalidate)
self.addEventListener('fetch', event => {
  event.respondWith(
  	caches.match(event.request).then(cacheRes => {
  		const fetchRes = fetch(event.request).then(networkRes => {
  			caches.open(CACHE_NAME).then(cache => {
  				cache.put(event.request, networkRes.clone());
  			});
  			return networkRes;
  		}).catch(() => {
  			if (cacheRes) {
  				return cacheRes;
  			}
  		});
  		
  		return cacheRes || fetchRes;
  	})
  );
});