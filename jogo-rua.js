/**
 * ARQUIVO: jogo-rua.js
 *
* MUDANÇAS IMPLEMENTADAS:
 * 1. (REQUISIÇÃO DO USUÁRIO) Atualizado `difficultySettings` com os novos tempos
 *    extremamente rápidos para o ciclo do semáforo.
 * 2. (REQUISIÇÃO DO USUÁRIO) Adicionada a propriedade `tempoCarro` às 
 *    dificuldades para que os carros fiquem mais rápidos.
 * 3. (FEATURE) A função `iniciar()` agora atualiza dinamicamente a 
 *    variável CSS `--tempo-carro` para refletir a dificuldade.
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

        // --- INÍCIO DA MODIFICAÇÃO (Tempos de Semáforo + Velocidade do Carro) ---
        this.difficultySettings = {
            facil: {
                tempoVermelhoFixo: 7000, 
                tempoTransicaoVerde:2000,
                tempoVerdeFixo: 6000, 
                tempoVerdePiscando: 2000,
                tempoCarro: '3s' // Velocidade do carro (Fácil)
            },
            medio: {
                tempoVermelhoFixo: 6000, 
                tempoTransicaoVerde: 1500,
                tempoVerdeFixo: 4000, 
                tempoVerdePiscando: 1500,
                tempoCarro: '2s' // Velocidade do carro (Médio)
            },
            dificil: {
                tempoVermelhoFixo: 3000, 
                tempoTransicaoVerde: 1000,
                tempoVerdeFixo: 1000, 
                tempoVerdePiscando: 500,
                tempoCarro: '1s' // Velocidade do carro (Difícil)
            }
        };
        // --- FIM DA MODIFICAÇÃO ---
        
        this.currentSettings = this.difficultySettings.facil; 

        this.vincularEventos();
    }

    vincularEventos() {
        if (this.btnAtravessar) {
            this.btnAtravessar.addEventListener('click', this.handleAtravessar.bind(this));
        } else {
            console.error("Botão 'atravessar' não encontrado no container.");
        }
    }

    iniciar(difficulty) {
        this.currentSettings = this.difficultySettings[difficulty] || this.difficultySettings.facil;
        
        // --- INÍCIO DA MODIFICAÇÃO (Define a velocidade do carro) ---
        // Atualiza a variável CSS global com base na dificuldade
        document.documentElement.style.setProperty('--tempo-carro', this.currentSettings.tempoCarro);
        // --- FIM DA MODIFICAÇÃO ---
        
        this.jogoAtivo = true;
        
        this.hits = 0;
        this.misses = 0;
        this.updateCountersDisplay(); 
        
        if (this.personagem) {
            this.personagem.classList.remove('atravessando', 'erro-run-back');
        }
        
        this.controlarBotoes(true);
        
        this.iniciarCicloSemaforo('pedestreVermelho');
    }
    
    parar() {
        clearTimeout(this.semaforoTimer);
        this.pararTrafego();
        this.jogoAtivo = false;
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
                this.controlarBotoes(true); 
                
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
        this.jogoAtivo = false; 
        this.atualizarMensagem("Muito bem! Atravessando em segurança!");
        
        this.hits++;
        this.updateCountersDisplay();
        
        clearTimeout(this.semaforoTimer);

        this.personagem.classList.remove('erro-run-back');
        this.personagem.classList.add('atravessando');

        const tempoTravessia = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tempo-travessia')) * 1000;
        setTimeout(() => {
            this.personagem.classList.remove('atravessando');
            this.jogoAtivo = true; 
            this.iniciarCicloSemaforo('pedestreVermelho'); 
        }, tempoTravessia + 1000); 
    }

    tentativaIncorreta() {
        this.jogoAtivo = false; 
        this.atualizarMensagem("PERIGO! QUASE!");

        this.misses++;
        this.updateCountersDisplay();

        this.personagem.classList.remove('atravessando');
        this.personagem.classList.add('erro-run-back');
        
        setTimeout(() => {
            this.personagem.classList.remove('erro-run-back');
            this.jogoAtivo = true; 
            
            if (this.estadoPedestre === 'vermelho') {
                this.atualizarMensagem("SINAL VERMELHO! Não atravesse!");
            }
        }, 800); 
    }

    updateCountersDisplay() {
    if (this.hitElement) {
            this.hitElement.textContent = this.hits;
        }
        if (this.missElement) {
            this.missElement.textContent = this.misses;
        }
    }

    iniciarTrafego() {
        if (this.carTimer) clearTimeout(this.carTimer);
        if (!this.estrada) return; 
        
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