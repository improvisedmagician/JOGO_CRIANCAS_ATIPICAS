// jogo-respiracao.js
// VERSÃO 7 (Remove contagem regressiva entre as pérolas)

console.log("Jogo da Respiração (Tartaruga Zen) carregado.");

// --- Referências da UI ---
const zenBubble = document.getElementById("zen-bubble");
const zenInstruction = document.getElementById("zen-instruction");
const zenTitle = document.getElementById("zen-title");

// --- Referências de Áudio ---
const audioAmbient = document.getElementById("audio-ambient-zen");
const audioVoice = document.getElementById("audio-zen-voice");
const audioSfx = document.getElementById("audio-zen-sfx");

// --- Variáveis de Controle ---
let zenGameLoopTimer = null; 
let zenAnimationTimer = null;
let zenCycleCount = 0; 
const Z_CYCLES_TO_WIN_PEARL = 3; 
let pearlCount = 0; 
const PEARLS_TO_WIN_GAME = 3; 
let isBreathing = false;

// --- Função Helper de Áudio ---
function playSound(element, src) {
    if (element) {
        element.src = src;
        element.currentTime = 0;
        element.play().catch(e => console.log("Erro ao tocar áudio: ", e));
    }
}
function stopSound(element) {
    if (element) {
        element.pause();
        element.currentTime = 0;
    }
}

/**
 * Inicia o Jogo da Respiração
 */
function startZenGame(difficulty = 'facil') {
    console.log("Iniciando Tartaruga Zen.");
    if (isBreathing || !zenBubble) return; 
    isBreathing = true;
    
    zenCycleCount = 0;
    pearlCount = 0;
    
    zenTitle.textContent = "Respira e Relaxe 🐢";
    zenBubble.style.transition = 'all 0.5s ease-in-out'; 
    zenBubble.classList.remove("inhale");
    
    // Toca o som ambiente
    playSound(audioAmbient, "sounds/ambient-zen.wav");
    
    // Inicia a contagem regressiva
    startCountdown(3); 
}

/**
 * Para o Jogo da Respiração
 */
function stopZenGame() {
    console.log("Parando Tartaruga Zen.");
    
    clearTimeout(zenGameLoopTimer);
    clearTimeout(zenAnimationTimer);
    zenGameLoopTimer = null;
    zenAnimationTimer = null;
    isBreathing = false;
    
    // Para todos os sons
    stopSound(audioAmbient);
    stopSound(audioVoice);
    stopSound(audioSfx);
    
    // Reseta o visual
    if (zenBubble) {
        zenBubble.style.transition = 'all 0.5s ease-in-out'; 
        zenBubble.classList.remove("inhale");
    }
    if (zenInstruction) {
        zenInstruction.textContent = "Acompanhe a bolha...";
    }
}

/**
 * Controla a contagem regressiva
 */
function startCountdown(count) {
    if (!isBreathing) return; 
    
    if (count > 0) {
        zenInstruction.textContent = `Prepare-se... ${count}`;
        zenGameLoopTimer = setTimeout(() => {
            startCountdown(count - 1); 
        }, 1000); 
    } else {
        zenInstruction.textContent = "Vamos começar!";
        zenCycleCount = 0; // Reseta o contador de ciclos
        zenGameLoopTimer = setTimeout(() => {
            runBreatheCycle(); // Começa o jogo
        }, 1000); 
    }
}


/**
 * Controla o ciclo de respiração (total de 8 segundos)
 */
function runBreatheCycle() {
    if (!isBreathing || !zenBubble) return; // Parou

    // 1. INSPIRAR (Animação de 4 segundos)
    zenBubble.style.transition = 'all 4s ease-in-out'; 
    zenInstruction.textContent = `Inspire... (Ciclo ${zenCycleCount + 1} de ${Z_CYCLES_TO_WIN_PEARL})`;
    zenBubble.classList.add("inhale"); 
    playSound(audioVoice, "sounds/voice-inspire.wav"); // Toca "Inspire"

    // 2. EXPIRAR (Timer de Animação - 4 segundos)
    zenAnimationTimer = setTimeout(() => {
        if (!isBreathing) return; 
        zenInstruction.textContent = `Expire... (Ciclo ${zenCycleCount + 1} de ${Z_CYCLES_TO_WIN_PEARL})`;
        zenBubble.classList.remove("inhale"); 
        playSound(audioVoice, "sounds/voice-expire.wav"); // Toca "Expire"
    }, 4000); 

    // 3. PRÓXIMO CICLO (Timer de Lógica - 8 segundos)
    zenGameLoopTimer = setTimeout(() => {
        
        zenCycleCount++;
        console.log("Ciclo de respiração: " + zenCycleCount);

        // Verifica se atingiu o objetivo de UMA PÉROLA
        if (zenCycleCount >= Z_CYCLES_TO_WIN_PEARL) {
            pearlCount++; 
            
            // Verifica se atingiu o objetivo FINAL
            if (pearlCount >= PEARLS_TO_WIN_GAME) {
                // VITÓRIA FINAL!
                console.log("Tartaruga Zen completa!");
                zenTitle.textContent = "Parabéns!";
                let pearlDisplay = "⚪️".repeat(PEARLS_TO_WIN_GAME);
                zenInstruction.textContent = `Você coletou ${PEARLS_TO_WIN_GAME} Pérolas da Calma! ${pearlDisplay}`;
                isBreathing = false;
                stopSound(audioAmbient); // Para a música de fundo
                playSound(audioSfx, "sounds/zen-victory.wav"); // Toca som de vitória
            } else {
                // Ganhou uma pérola, mas não o jogo
                let pearlDisplay = "⚪️".repeat(pearlCount); 
                zenInstruction.textContent = `Você ganhou ${pearlCount} Pérola! ${pearlDisplay}`;
                playSound(audioSfx, "sounds/zen-ding.wav"); // Toca som de ganhar pérola
                
                // Inicia o próximo ciclo de respiração (sem contagem)
                zenCycleCount = 0; // Reseta o contador de ciclos
                zenGameLoopTimer = setTimeout(() => {
                    runBreatheCycle(); 
                }, 2000); // Espera 2s antes do próximo ciclo
            }
        } else {
            // Se não, continua o ciclo
            runBreatheCycle();
        }
    }, 8000); // 4s (In) + 4s (Out) = 8s total
}