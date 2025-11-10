// jogo-memoria.js
// VERSÃO 3 (Placar de Recorde com localStorage)

console.log("Jogo da Memória carregado.");

// --- 1. Referências da UI ---
const memoryInstruction = document.getElementById("memory-instruction");
const memoryScoreDisplay = document.getElementById("memory-score");
const memoryStartButton = document.getElementById("memory-start-btn");
const memoryButtons = document.querySelectorAll(".memory-btn");
// (NOVO) Referência ao placar de recorde
const memoryHighScoreDisplay = document.getElementById("memory-high-score");

// --- 2. Referências de Áudio ---
const memorySounds = {
    1: document.getElementById("audio-memory-1"), // Verde
    2: document.getElementById("audio-memory-2"), // Vermelho
    3: document.getElementById("audio-memory-3"), // Amarelo
    4: document.getElementById("audio-memory-4"), // Azul
    error: document.getElementById("audio-memory-error")
};

// --- 3. Definição de Dificuldade ---
const memoryDifficultySettings = {
    facil: { speed: 800 }, // 800ms
    medio: { speed: 500 }, // 500ms
    dificil: { speed: 300 } // 300ms
};
let currentSpeed = 500;

// --- 4. Variáveis de Estado ---
let sequence = []; 
let playerSequence = []; 
let score = 0;
let isPlayerTurn = false;
let gameActive = false;
let sequenceTimer = null;
// (NOVO) Variáveis de Recorde
let highScore = 0;
const HIGH_SCORE_KEY = 'memoryGameHighScore'; // Chave para o localStorage

// --- 5. Funções de Início e Fim ---

function startMemoryGame(difficulty = 'facil') {
    console.log("Iniciando Jogo da Memória. Dificuldade: " + difficulty);
    currentSpeed = memoryDifficultySettings[difficulty].speed || 500;
    
    // (NOVO) Carrega o recorde salvo
    loadHighScore();
    
    memoryStartButton.style.display = 'block';
    memoryStartButton.disabled = false;
    memoryInstruction.textContent = "Pressione 'Começar' para jogar.";
    resetGame();
}

function stopMemoryGame() {
    console.log("Parando Jogo da Memória.");
  	if (sequenceTimer) clearTimeout(sequenceTimer);
    gameActive = false;
    isPlayerTurn = false;
    memoryStartButton.style.display = 'block';
    memoryStartButton.disabled = false;
}

function resetGame() {
  	sequence = [];
  	playerSequence = [];
  	score = 0;
  	memoryScoreDisplay.textContent = "Pontuação: 0";
  	isPlayerTurn = false;
  	gameActive = true;
}

// --- 6. Lógica de Recorde (NOVO) ---
function loadHighScore() {
    // Busca o recorde no localStorage; se não existir, usa 0
    highScore = localStorage.getItem(HIGH_SCORE_KEY) || 0;
    memoryHighScoreDisplay.textContent = `Recorde: ${highScore}`;
}

function saveHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem(HIGH_SCORE_KEY, highScore);
        memoryHighScoreDisplay.textContent = `Recorde: ${highScore}`;
        // Retorna true se for um novo recorde
        return true;
    }
    return false;
}

// --- 7. Lógica Principal do Jogo ---

function nextRound() {
  	console.log("Iniciando próximo round...");
  	isPlayerTurn = false;
  	playerSequence = [];
  	memoryStartButton.style.display = 'none'; 
  	memoryInstruction.textContent = "Observe a sequência...";

  	const nextColor = Math.floor(Math.random() * 4) + 1;
  	sequence.push(nextColor);
  	
  	// Atualiza a pontuação (score é o número de acertos)
  	score = sequence.length - 1;
  	memoryScoreDisplay.textContent = "Pontuação: " + score;
  	
  	playSequence();
}

function playSequence() {
  	let i = 0;
  	
  	function playNext() {
  		if (i >= sequence.length || !gameActive) {
  			// Sequência terminou
  			isPlayerTurn = true;
  			memoryInstruction.textContent = "Sua vez! Repita a sequência.";
  			return;
  		}
  		
  		const color = sequence[i];
  		highlightButton(color);
  		
  		i++;
  		sequenceTimer = setTimeout(playNext, currentSpeed + 200); 
  	}
  	
  	sequenceTimer = setTimeout(playNext, currentSpeed);
}

function handlePlayerClick(color) {
  	if (!isPlayerTurn || !gameActive) return;

  	console.log("Jogador clicou: " + color);
  	highlightButton(color); 
  	playerSequence.push(color);
  	
  	const index = playerSequence.length - 1;

  	// 1. Verificação de Erro
  	if (playerSequence[index] !== sequence[index]) {
  		gameOver();
  		return;
  	}
  	
  	// 2. Verificação de Acerto (Fim da sequência)
  	if (playerSequence.length === sequence.length) {
  		isPlayerTurn = false;
  		memoryInstruction.textContent = "Certo! Próximo nível...";
  		sequenceTimer = setTimeout(nextRound, 1000); 
  	}
}

function highlightButton(color) {
  	const button = document.querySelector(`.memory-btn[data-color="${color}"]`);
  	if (!button) return;

  	if (memorySounds[color]) {
  		memorySounds[color].currentTime = 0;
  		memorySounds[color].play().catch(e => console.log("Erro no áudio"));
  	}
  	
  	button.classList.add("highlight");
  	
  	setTimeout(() => {
  		button.classList.remove("highlight");
  	}, currentSpeed - 50);
}

// (MODIFICADO)
function gameOver() {
  	console.log("Game Over!");
  	isPlayerTurn = false;
  	gameActive = false;
  	
  	// (NOVO) Verifica se é um novo recorde
  	const isNewHighScore = saveHighScore();
  	
  	if (isNewHighScore) {
  		memoryInstruction.textContent = `NOVO RECORDE! Pontuação: ${score}. Pressione 'Começar'.`;
  	} else {
  		memoryInstruction.textContent = `Fim de Jogo! Sua pontuação: ${score}. Pressione 'Começar'.`;
  	}
  	
  	memoryStartButton.style.display = 'block';
  	memoryStartButton.disabled = false;
  	
  	if (memorySounds.error) {
  		memorySounds.error.play().catch(e => console.log("Erro no áudio"));
  	}
}


// --- 8. Inicialização dos Eventos ---
memoryStartButton.addEventListener("click", () => {
  	memoryStartButton.disabled = true;
  	resetGame();
  	nextRound();
});

memoryButtons.forEach(button => {
  	button.addEventListener("click", () => {
  		const color = parseInt(button.dataset.color, 10);
  		handlePlayerClick(color);
  	});
});