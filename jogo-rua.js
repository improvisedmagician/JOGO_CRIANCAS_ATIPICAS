/**
 * ARQUIVO: jogo-rua.js
 *
 * MUDANÇAS IMPLEMENTADAS:
 * 1. (BUG FIX) Construtor agora busca elementos de pontuação (hits/misses)
 *    pelo ID no 'document' (nível global) e elementos do jogo (botão, luzes)
 *    dentro do 'containerElement' (nível local).
 * 2. (BUG FIX) Corrigido 'clearInterval' para 'clearTimeout' em 'iniciarTrafego',
 *    o que impediria os carros de pararem corretamente.
 */

class MinigogoAtravessarRua {
    
    constructor(containerElement) {
        this.container = containerElement; 
        
        // Elementos do Jogo (dentro do container)
        this.luzPedestreVermelha = this.container.querySelector('.luz-pedestre.vermelha');
        this.luzPedestreVerde = this.container.querySelector('.luz-pedestre.verde');
        this.personagem = this.container.querySelector('#personagem');
        this.mensagem = this.container.querySelector('#mensagem');
        this.btnAtravessar = this.container.querySelector('button[data-action="atravessar"]');
        this.estrada = this.container.querySelector('#estrada');
        
        // Elementos de Pontuação (Fora do container, buscamos no documento)
        this.hitElement = document.getElementById('hits-count'); 
        this.missElement = document.getElementById('misses-count');
        
        this.hits = 0;
        this.misses = 0;

        // Estado interno
        this.estadoPedestre = null; 
        this.jogoAtivo = true; 
        this.carTimer = null;
        this.semaforoTimer = null;

        // Definições de Dificuldade
        this.difficultySettings = {
            facil: {
                tempoVermelhoFixo: 7000, tempoTransicaoVerde: 2000,
                tempoVerdeFixo: 5000, tempoVerdePiscando: 3000,
                
            },
            medio: {
                tempoVermelhoFixo: 5000, tempoTransicaoVerde: 1500,
                tempoVerdeFixo: 3500, tempoVerdePiscando: 2000,
                
            },
            dificil: {
                tempoVermelhoFixo: 3000, tempoTransicaoVerde: 1000,
                tempoVerdeFixo: 2000, tempoVerdePiscando: 1000,
                
            }
        };
        this.currentSettings = this.difficultySettings.facil; 

        this.vincularEventos();
    }

    vincularEventos() {
        // Se o botão foi encontrado, adiciona o evento
        if (this.btnAtravessar) {
            this.btnAtravessar.addEventListener('click', this.handleAtravessar.bind(this));
        } else {
            console.error("Botão 'atravessar' não encontrado no container.");
        }
    }

    iniciar(difficulty) {
        this.currentSettings = this.difficultySettings[difficulty] || this.difficultySettings.facil;
        this.jogoAtivo = true;
        
        // Reseta todos os placares
         
        this.hits = 0;
        this.misses = 0;
        this.updateCountersDisplay(); // Atualiza todos (acertos, erros, pontos)
        
        // Garante que o personagem está no estado limpo
        if (this.personagem) {
            this.personagem.classList.remove('atravessando', 'erro-run-back');
        }
        
        // Botão sempre ativo
        this.controlarBotoes(true);
        
        this.iniciarCicloSemaforo('pedestreVermelho');
    }
    
    parar() {
        clearTimeout(this.semaforoTimer);
        this.pararTrafego();
        this.jogoAtivo = false;
    // Garante que o botão seja desabilitado ao sair
        this.controlarBotoes(false); 
    }

    iniciarCicloSemaforo(estado) {
        clearTimeout(this.semaforoTimer);
        let proximoEstado, tempoEspera;
        const settings = this.currentSettings;

        switch (estado) {
            case 'pedestreVermelho':
                this.estadoPedestre = 'vermelho';
                this.definirSemaforoVisual('vermelho');
                this.iniciarTrafego(); 
                this.atualizarMensagem("SINAL VERMELHO! Não atravesse!");
                this.controlarBotoes(true); // Garante que está ativo
                
                proximoEstado = 'transicaoParaVerde';
                tempoEspera = settings.tempoVermelhoFixo;
                break;

            case 'transicaoParaVerde':
                this.estadoPedestre = 'vermelho'; 
                this.definirSemaforoVisual('vermelho');
                this.pararTrafego();
                this.atualizarMensagem("Espere... os carros estão parando.");
                
                this.controlarBotoes(true); 
                
                proximoEstado = 'pedestreVerdeFixo';
                tempoEspera = settings.tempoTransicaoVerde;
                break;
                
            case 'pedestreVerdeFixo':
                this.estadoPedestre = 'verdeFixo';
                this.definirSemaforoVisual('verdeFixo');
                this.atualizarMensagem("SINAL VERDE! Pode atravessar!");
                this.controlarBotoes(true);
                
                proximoEstado = 'pedestreVerdePiscando';
                tempoEspera = settings.tempoVerdeFixo;
                break;

            case 'pedestreVerdePiscando':
                this.estadoPedestre = 'verdePiscando';
                this.definirSemaforoVisual('verdePiscando');
                this.atualizarMensagem("RÁPIDO! O sinal vai fechar!");
                this.controlarBotoes(true);
                
                proximoEstado = 'pedestreVermelho';
                tempoEspera = settings.tempoVerdePiscando;
                break;
        }

        this.semaforoTimer = setTimeout(() => {
            this.iniciarCicloSemaforo(proximoEstado);
        }, tempoEspera);
    }

    handleAtravessar() {
        // Trava o jogo para não receber cliques duplos durante a animação
        if (!this.jogoAtivo) return;

        if (this.estadoPedestre === 'verdeFixo' || this.estadoPedestre === 'verdePiscando') {
            this.atravessarComSeguranca();
        } else {
            this.tentativaIncorreta();
        }
    }

    definirSemaforoVisual(estadoVisual) {
        if (!this.luzPedestreVerde || !this.luzPedestreVermelha) return;
        
        this.luzPedestreVerde.classList.remove('piscando');
        
        if (estadoVisual === 'vermelho') {
            this.luzPedestreVermelha.classList.add('acesa');
            this.luzPedestreVerde.classList.remove('acesa');
        } 
        else if (estadoVisual === 'verdeFixo') {
            this.luzPedestreVermelha.classList.remove('acesa');
            this.luzPedestreVerde.classList.add('acesa');
        }
        else if (estadoVisual === 'verdePiscando') {
            this.luzPedestreVermelha.classList.remove('acesa');
        this.luzPedestreVerde.classList.add('acesa');
            this.luzPedestreVerde.classList.add('piscando');
        }
    }

    atravessarComSeguranca() {
        this.jogoAtivo = false; // Trava o jogo durante a animação
        this.atualizarMensagem("Muito bem! Atravessando em segurança!");
        
        // Contadores
        this.hits++;
        this.updateCountersDisplay();
        
        clearTimeout(this.semaforoTimer);

        this.personagem.classList.remove('erro-run-back');
        this.personagem.classList.add('atravessando');

        const tempoTravessia = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tempo-travessia')) * 1000;
        setTimeout(() => {
            this.personagem.classList.remove('atravessando');
            this.jogoAtivo = true; // Libera o jogo
            this.iniciarCicloSemaforo('pedestreVermelho'); 
        }, tempoTravessia + 1000); 
    }

    tentativaIncorreta() {
        this.jogoAtivo = false; // Trava o jogo durante a animação
        this.atualizarMensagem("PERIGO! QUASE!");

        // Contadores
        this.misses++;
        this.updateCountersDisplay();

        this.personagem.classList.remove('atravessando');
     this.personagem.classList.add('erro-run-back');
        
        setTimeout(() => {
            this.personagem.classList.remove('erro-run-back');
            this.jogoAtivo = true; // Libera o jogo
            
            if (this.estadoPedestre === 'vermelho') {
                this.atualizarMensagem("SINAL VERMELHO! Não atravesse!");
            }
        }, 800); 
    }

    // Função única para atualizar todos os placares
    updateCountersDisplay() {
        if (this.hitElement) {
            this.hitElement.textContent = this.hits;
        }
        if (this.missElement) {
            this.missElement.textContent = this.misses;
        }
    }

    // ... (Funções de Tráfego e Utilitárias) ...

    iniciarTrafego() {
        // --- CORREÇÃO DE BUG (clearInterval -> clearTimeout) ---
        if (this.carTimer) clearTimeout(this.carTimer);
        // --- FIM DA CORREÇÃO ---

        if (!this.estrada) return; // Checagem de segurança
        
        const criarCarro = () => {
            const carro = document.createElement('div');
       carro.classList.add('carro');
            const pista = Math.random() > 0.5 ? 'pista-1' : 'pista-2';
            carro.classList.add(pista);
            this.estrada.appendChild(carro);
            carro.addEventListener('animationend', () => carro.remove());
            const proximoTempo = Math.random() * 2000 + 1000; 
            this.carTimer = setTimeout(criarCarro, proximoTempo);
        };
        criarCarro();
    }

    pararTrafego() {
        if (this.carTimer) {
            clearTimeout(this.carTimer);
            this.carTimer = null;
        }
    }

    atualizarMensagem(texto) {
        if (this.mensagem) {
            this.mensagem.textContent = texto;
        }
    }

    controlarBotoes(habilitar) {
        if (this.btnAtravessar) {
            this.btnAtravessar.disabled = !habilitar;
        }
    }
}