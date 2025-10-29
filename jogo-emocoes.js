// jogo-emocoes.js
// VERSÃO 3 (Dificuldade por Número de Opções)

// --- 1. Banco de Imagens e Nomes ---
// (VOCÊ PRECISA ADICIONAR AS IMAGENS PARA OS NOVOS)
const emotionQuestions = [
    { imagePath: "images/rosto_alegre.png", correctEmotion: "Alegria" },
    { imagePath: "images/rosto_triste.png", correctEmotion: "Tristeza" },
    { imagePath: "images/rosto_raiva.png", correctEmotion: "Raiva" },
    { imagePath: "images/rosto_surpresa.png", correctEmotion: "Surpresa" },
    { imagePath: "images/rosto_medo.png", correctEmotion: "Medo" },
    { imagePath: "images/rosto_nojinho.png", correctEmotion: "Nojinho" },
    { imagePath: "images/rosto_tedio.png", correctEmotion: "Tédio" },
    { imagePath: "images/rosto_ansiedade.png", correctEmotion: "Aniedade" }
];

// Nomes de todas as emoções para usar como "distratores"
const allEmotionNames = [
  "Alegria", "Tristeza", "Raiva", "Surpresa", 
  "Medo", "Nojinho", "Tédio", "Ansiedade",
];

// --- 2. Definição de Dificuldade ---
const emotionDifficultySettings = {
    // Nível 1: 4 opções, sem tempo
    facil: { numOptions: 4, timeLimit: 0 },
    // Nível 2: 6 opções, 5 segundos
    medio: { numOptions: 6, timeLimit: 5000 },
    // Nível 3: 8 opções, 3 segundos
    dificil: { numOptions: 8, timeLimit: 3000 }
};
let currentDifficultySettings = emotionDifficultySettings.facil;
let emotionTimer = null; // Guarda o ID do setTimeout

// --- 3. Referências da UI ---
const emotionFaceImage = document.getElementById("emotion-face-image");
// Container dos botões (não os botões em si)
const emotionOptionButtonsContainer = document.getElementById("emotion-options-container");
const emotionFeedbackText = document.getElementById("emotion-feedback-text");
const emotionTimerDiv = document.getElementById("emotion-timer");
const emotionTimerBar = document.getElementById("emotion-timer-bar");

// --- 4. Variáveis de Controle ---
let shuffledQuestions = []; // Uma cópia das perguntas, embaralhada
let currentEmotionQuestionIndex = 0;
let currentEmotionQuestion;
let emotionGameActive = false; 

// --- 5. Funções de Timer (Inalteradas) ---
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

// --- 6. Funções Principais (Refatoradas) ---

/**
 * Embaralha uma array (algoritmo Fisher-Yates)
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Gera os botões de opção dinamicamente
 */
function generateEmotionOptions() {
    const correctEmotion = currentEmotionQuestion.correctEmotion;
    const numOptions = currentDifficultySettings.numOptions;

    // 1. Começa com a resposta correta
    let options = [correctEmotion];

    // 2. Pega todos os outros nomes (distratores)
    let distractors = allEmotionNames.filter(name => name !== correctEmotion);
    shuffleArray(distractors);

    // 3. Adiciona distratores até atingir o numOptions
    while (options.length < numOptions && distractors.length > 0) {
        options.push(distractors.pop());
    }

    // 4. Embaralha as opções finais
    shuffleArray(options);

    // 5. Cria os botões no HTML
    populateButtonContainer(options);
}

/**
 * Limpa o container e cria os novos botões
 */
function populateButtonContainer(optionsArray) {
    // Limpa botões antigos
    emotionOptionButtonsContainer.innerHTML = ''; 

    optionsArray.forEach(emotionName => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.dataset.emotion = emotionName;
        button.textContent = emotionName;
        
        // Adiciona o listener de clique AQUI
        button.addEventListener('click', handleEmotionChoice);
        
        emotionOptionButtonsContainer.appendChild(button);
    });
}

function showEmotionQuestion() {
    clearTimeout(emotionTimer);
    resetTimerBar();

    // Se chegou ao fim do array, embaralha de novo
    if (currentEmotionQuestionIndex >= shuffledQuestions.length) {
        currentEmotionQuestionIndex = 0; 
        shuffleArray(shuffledQuestions);
    }
    
    currentEmotionQuestion = shuffledQuestions[currentEmotionQuestionIndex];
    emotionFaceImage.src = currentEmotionQuestion.imagePath;
    emotionFeedbackText.textContent = "";
    emotionFeedbackText.className = "";

    // Gera os botões (Fácil: 4, Médio: 6, Difícil: 8)
    generateEmotionOptions();

    emotionGameActive = true;

    // Inicia o timer da dificuldade
    const timeLimit = currentDifficultySettings.timeLimit;
    if (timeLimit > 0) {
        startTimerBar(timeLimit);
        emotionTimer = setTimeout(() => {
            handleEmotionWrongAnswer("Tempo esgotado!");
        }, timeLimit);
     }
}

function handleEmotionCorrectAnswer() {
    if (!emotionGameActive) return;
    emotionGameActive = false; 
    clearTimeout(emotionTimer);

    console.log("ACERTOU JOGO EMOÇÕES!");
    emotionFeedbackText.textContent = "Isso mesmo! É " + currentEmotionQuestion.correctEmotion + "!";
    emotionFeedbackText.classList.add("correct");

    setTimeout(() => {
        currentEmotionQuestionIndex++;
        showEmotionQuestion(); // Mostra a próxima
    }, 1500); 
}

function handleEmotionWrongAnswer(feedbackMessage) {
    if (!emotionGameActive) return;
    emotionGameActive = false; 
    clearTimeout(emotionTimer);

    console.log("ERROU JOGO EMOÇÕES. " + feedbackMessage);
    emotionFeedbackText.textContent = feedbackMessage || "Tente de novo...";
    emotionFeedbackText.classList.add("wrong");
    
    setTimeout(() => {
        currentEmotionQuestionIndex++;
        showEmotionQuestion(); // Mostra a próxima
A   }, 1500);
}

/**
 * Chamada quando um botão de emoção é clicado (Novo)
 */
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
    
    currentDifficultySettings = emotionDifficultySettings[difficulty] || emotionDifficultySettings.facil;
    
    // Cria uma cópia embaralhada do banco de perguntas
    shuffledQuestions = [...emotionQuestions];
    shuffleArray(shuffledQuestions);
    
    currentEmotionQuestionIndex = 0;
    showEmotionQuestion();
}

function stopEmotionGame() {
    console.log("Parando Jogo das Emoções...");
    clearTimeout(emotionTimer);
    resetTimerBar();
    emotionGameActive = false;
    emotionFaceImage.src = ""; 
    emotionFeedbackText.textContent = "";
    // Limpa os botões
    emotionOptionButtonsContainer.innerHTML = '';
}

// (O loop 'emotionOptionButtons.forEach' foi REMOVIDO daqui)