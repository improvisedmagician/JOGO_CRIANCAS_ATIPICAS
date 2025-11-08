// jogo-emocoes.js
// VERSÃO 8 (Cronômetro numérico + Caminhos Corrigidos para raiz)

// --- 1. Banco de Imagens e Nomes ---
// (CAMINHOS CORRIGIDOS para funcionar na raiz)
const emotionQuestions = [
    { imagePath: "images/rosto_alegre.png", correctEmotion: "Alegria" },
    { imagePath: "images/rosto_triste.png", correctEmotion: "Tristeza" },
    { imagePath: "images/rosto_raiva.png", correctEmotion: "Raiva" },
    { imagePath: "images/rosto_medo.png", correctEmotion: "Medo" },
    { imagePath: "images/rosto_nojinho.png", correctEmotion: "Nojinho" },
    { imagePath: "images/rosto_tedio.png", correctEmotion: "Tédio" },
    { imagePath: "images/rosto_vergonha.png", correctEmotion: "Vergonha" },
    { imagePath: "images/rosto_ansiedade.png", correctEmotion: "Ansiedade" }
];

const allEmotionNames = [
  "Alegria", "Tristeza", "Raiva", "Medo", 
  "Nojinho", "Tédio", "Vergonha", "Ansiedade"
];

// --- 2. Definição de Dificuldade ---
const emotionDifficultySettings = {
    facil: { numOptions: 4, timeLimit: 0 },
    medio: { numOptions: 6, timeLimit: 5000 },
    dificil: { numOptions: 8, timeLimit: 3000 }
};
let currentDifficultySettings = emotionDifficultySettings.facil;
let emotionTimer = null; // Guarda o setInterval
let timeLeft = 0; // Guarda os segundos restantes

// --- 3. Referências da UI ---
const emotionFaceImage = document.getElementById("emotion-face-image");
const emotionOptionButtonsContainer = document.getElementById("emotion-options-container");
const emotionFeedbackText = document.getElementById("emotion-feedback-text");
const emotionTimerDiv = document.getElementById("emotion-timer");
const emotionTimerBar = document.getElementById("emotion-timer-bar");
const emotionGameTitle = document.querySelector('#nivel-emocoes h1');
// (MELHORIA 2) Referência ao contador numérico
const emotionCountdownDisplay = document.getElementById("emotion-countdown");

// --- 4. Variáveis de Controle ---
let shuffledQuestions = []; 
let currentEmotionQuestionIndex = 0;
let currentEmotionQuestion;
let emotionGameActive = false; 
let correctlyGuessedEmotions = new Set(); 

// --- 5. Funções de Timer (Melhoria 2) ---
function resetTimerBar() {
    emotionTimerBar.classList.remove("animating");
    emotionTimerBar.style.transitionDuration = '0s';
    emotionTimerBar.style.transform = 'translateX(-100%)';
}

function startTimerBar(durationMs) {
    if (durationMs <= 0) {
        emotionTimerDiv.style.display = "none";
        return;
    }
    emotionTimerDiv.style.display = "block";
    void emotionTimerBar.offsetWidth; 
    emotionTimerBar.style.transitionDuration = (durationMs / 1000) + 's';
    emotionTimerBar.classList.add("animating");
}

// Limpa todos os timers (Interval e Bar)
function clearAllTimers() {
    clearInterval(emotionTimer); // Usa clearInterval
    emotionTimer = null;
    resetTimerBar();
    if (emotionCountdownDisplay) {
        emotionCountdownDisplay.textContent = "";
    }
}


// --- 6. Funções Principais ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateEmotionOptions() {
    const correctEmotion = currentEmotionQuestion.correctEmotion;
    const numOptions = currentDifficultySettings.numOptions;
    let options = [correctEmotion];
    let distractors = allEmotionNames.filter(name => name !== correctEmotion);
    shuffleArray(distractors);
    while (options.length < numOptions && distractors.length > 0) {
        options.push(distractors.pop());
    }
    shuffleArray(options);
    populateButtonContainer(options);
}

function populateButtonContainer(optionsArray) {
    emotionOptionButtonsContainer.innerHTML = ''; 
    optionsArray.forEach(emotionName => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.dataset.emotion = emotionName;
        button.textContent = emotionName;
        button.addEventListener('click', handleEmotionChoice);
        emotionOptionButtonsContainer.appendChild(button);
    });
}

// (MODIFICADO) Lógica do timer reescrita com setInterval
function showEmotionQuestion() {
    clearAllTimers(); // Limpa timers anteriores

    if (currentEmotionQuestionIndex >= shuffledQuestions.length) {
        currentEmotionQuestionIndex = 0; 
        shuffleArray(shuffledQuestions);
    }
    
    currentEmotionQuestion = shuffledQuestions[currentEmotionQuestionIndex];

    if (correctlyGuessedEmotions.has(currentEmotionQuestion.correctEmotion)) {
        console.log("Pulando " + currentEmotionQuestion.correctEmotion + " (já acertou)");
        currentEmotionQuestionIndex++;
        showEmotionQuestion(); 
        return; 
    }

    emotionFaceImage.src = currentEmotionQuestion.imagePath;
    emotionFeedbackText.textContent = "";
    emotionFeedbackText.className = "";
    generateEmotionOptions();
    emotionGameActive = true;

    // --- LÓGICA DO TIMER NUMÉRICO (Melhoria 2) ---
    const timeLimit = currentDifficultySettings.timeLimit;
    if (timeLimit > 0) {
        timeLeft = timeLimit / 1000; // Ex: 5000ms -> 5s
        emotionCountdownDisplay.textContent = timeLeft;
        startTimerBar(timeLimit); // Inicia a barra visual

        // Inicia o contador
        emotionTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                emotionCountdownDisplay.textContent = "0";
                handleEmotionWrongAnswer("Tempo esgotado!");
            } else {
                emotionCountdownDisplay.textContent = timeLeft;
            }
        }, 1000); // Roda a cada segundo

    }
}

function handleEmotionCorrectAnswer() {
    if (!emotionGameActive) return;
    emotionGameActive = false; 
    clearAllTimers(); // Para o timer

    console.log("ACERTOU JOGO EMOÇÕES!");
    emotionFeedbackText.textContent = "Isso mesmo! É " + currentEmotionQuestion.correctEmotion + "!";
    emotionFeedbackText.classList.add("correct");

    correctlyGuessedEmotions.add(currentEmotionQuestion.correctEmotion);
    console.log("Acertos: " + correctlyGuessedEmotions.size + "/" + emotionQuestions.length);

    setTimeout(() => {
        if (correctlyGuessedEmotions.size === emotionQuestions.length) {
            // VITÓRIA!
            emotionOptionButtonsContainer.innerHTML = ''; 
            if (emotionGameTitle) {
                emotionGameTitle.textContent = "Parabéns!";
            }
            // CAMINHO CORRIGIDO
            emotionFaceImage.src = "images/parabens.png"; 
            emotionFeedbackText.textContent = "Você reconheceu todas as emoções! Muito bem!";
            emotionFeedbackText.className = "correct";
        } else {
            currentEmotionQuestionIndex++;
            showEmotionQuestion(); 
        }
    }, 1500); 
}

function handleEmotionWrongAnswer(feedbackMessage) {
    if (!emotionGameActive) return;
    emotionGameActive = false; 
    clearAllTimers(); // Para o timer

    console.log("ERROU JOGO EMOÇÕES. " + feedbackMessage);
    emotionFeedbackText.textContent = feedbackMessage || "Tente de novo...";
    emotionFeedbackText.classList.add("wrong");
    
    setTimeout(() => {
        currentEmotionQuestionIndex++;
        showEmotionQuestion(); 
    }, 1500);
}

function handleEmotionChoice(event) {
    if (!emotionGameActive) return; 
    const chosenEmotion = event.target.dataset.emotion;
    
    if (chosenEmotion === currentEmotionQuestion.correctEmotion) {
        handleEmotionCorrectAnswer();
    } else {
        handleEmotionWrongAnswer("Oops! Essa não é a emoção certa.");
    }
}


// --- 7. Funções de Início/Fim (Chamadas pelo Menu) ---
function startEmotionGame(difficulty = 'facil') {
    console.log("Iniciando Jogo das Emoções (Dificuldade: " + difficulty + ")");
    
    if (emotionGameTitle) {
        emotionGameTitle.textContent = "O que esta pessoa está sentindo?";
    }
    
    currentDifficultySettings = emotionDifficultySettings[difficulty] || emotionDifficultySettings.facil;
    correctlyGuessedEmotions = new Set();
    shuffledQuestions = [...emotionQuestions];
    shuffleArray(shuffledQuestions);
    currentEmotionQuestionIndex = 0;
    showEmotionQuestion();
}

function stopEmotionGame() {
    console.log("Parando Jogo das Emoções...");
    clearAllTimers(); // Limpa tudo
    emotionGameActive = false;
    emotionFaceImage.src = ""; 
    emotionFeedbackText.textContent = "";
    emotionOptionButtonsContainer.innerHTML = '';
    if (emotionGameTitle) {
        emotionGameTitle.textContent = "O que esta pessoa está sentindo?";
    }
}