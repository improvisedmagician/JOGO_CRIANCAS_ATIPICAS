// O nome do cache (pode ser qualquer coisa)
const CACHE_NAME = 'jogo-dia-a-dia-v1';

// Todos os arquivos que seu app precisa para funcionar offline
// CORREÇÃO: Todos os caminhos devem ser relativos (./)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json', // Adicionado
  './style.css',
  './script.js',
  './jogo-rua.js',
  './jogo-emocoes.js',
  './jogo-sentidos.js',
  
  // Adicione aqui todas as suas imagens
  './fundo.png',
  './personagem.png',
  './carro.png',
  './images/rosto_alegre.png',
  './images/rosto_triste.png',
  './images/rosto_raiva.png',
  
  // Adicione os ícones do manifest
  './images/icon-192.png',
  './images/icon-512.png'
];

// Evento de 'install': Salva todos os arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de 'fetch': Responde com o cache se estiver offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se o arquivo existir no cache, retorna ele.
        if (response) {
          return response;
        }
        // Se não, busca na rede (internet)
        return fetch(event.request);
      }
    )
  );
});