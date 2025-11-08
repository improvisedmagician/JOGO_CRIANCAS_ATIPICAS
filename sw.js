const CACHE_NAME = 'jogo-dia-a-dia-v3'; // Versão atualizada

// Caminhos para a estrutura raiz (sem 'www')
const urlsToCache = [
  './',
  './index.html',
  './manifest.json', 
  './style.css',
  './script.js',
  './jogo-rua.js',
  './jogo-emocoes.js',
  './jogo-sentidos.js',
  
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
  './images/parabens.png', // Adicionada imagem de vitória

  // Ícones do PWA
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
A       }
        return fetch(event.request);
      }
    )
  );
});

// Limpa caches antigos (importante para a v3 funcionar)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Deleta todos os caches que NÃO sejam o 'v3'
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});