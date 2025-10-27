// jogo-emocoes.js

// --- 1. Definição das Perguntas ---
const emotionQuestions = [
    {
        imagePath: "images/rosto_alegre.png", 
        correctEmotion: "Alegria"
    },
    {
        imagePath: "images/rosto_triste.png", 
        correctEmotion: "Tristeza"
    },
    {
        imagePath: "images/rosto_raiva.png", 
        correctEmotion: "Raiva"
    }
];

// --- 2. Referências da UI ---
// (Note que usamos os IDs novos do HTML)
const emotionFaceImage = document.getElementById("emotion-face-image");
const emotionOptionButtons = document.querySelectorAll("#emotion-options-container .option-btn");
const emotionFeedbackText = document.getElementById("emotion-feedback-text");

// --- 3. Variáveis de Controle ---
let currentEmotionQuestionIndex = 0;
let currentEmotionQuestion;
let emotionGameActive = false; // Controla se o jogo está rodando

// --- 4. Funções Principais ---

function showEmotionQuestion(index) {
    if (index >= emotionQuestions.length) {
        // Jogo terminou, reinicia
        currentEmotionQuestionIndex = 0;
        index = 0; 
    }
    
    currentEmotionQuestion = emotionQuestions[index];
    emotionFaceImage.src = currentEmotionQuestion.imagePath;
    emotionFeedbackText.textContent = "";
    emotionFeedbackText.className = "";
}

function handleEmotionCorrectAnswer() {
    console.log("ACERTOU JOGO EMOÇÕES!");
    emotionFeedbackText.textContent = "Isso mesmo! É " + currentEmotionQuestion.correctEmotion + "!";
    emotionFeedbackText.classList.add("correct");

    // Impede cliques duplos
    emotionGameActive = false; 

    setTimeout(() => {
        currentEmotionQuestionIndex++;
        if (currentEmotionQuestionIndex < emotionQuestions.length) {
            showEmotionQuestion(currentEmotionQuestionIndex);
        } else {
            // Terminou o ciclo
            alert("Parabéns! Você terminou o Jogo das Emoções!");
            // (Poderia voltar ao menu aqui)
            showEmotionQuestion(0); // Reinicia
        }
        emotionGameActive = true; // Permite cliques novamente
    }, 1500); 
}

function handleEmotionWrongAnswer(selectedEmotion) {
    console.log("ERROU JOGO EMOÇÕES. Clicou em " + selectedEmotion);
    emotionFeedbackText.textContent = "Tente de novo...";
    emotionFeedbackText.classList.add("wrong");
    
    setTimeout(() => {
        emotionFeedbackText.textContent = "";
        emotionFeedbackText.className = "";
    }, 1000); 
}

// Função que será chamada pelo menu principal
function startEmotionGame() {
    console.log("Iniciando Jogo das Emoções...");
    emotionGameActive = true;
    currentEmotionQuestionIndex = 0;
    showEmotionQuestion(currentEmotionQuestionIndex);
}

// Função que será chamada pelo menu principal
function stopEmotionGame() {
    console.log("Parando Jogo das Emoções...");
    emotionGameActive = false;
    // Limpa a imagem ou qualquer estado
    emotionFaceImage.src = ""; 
    emotionFeedbackText.textContent = "";
}

// --- 5. Inicialização dos Botões ---
// Isso roda 1 vez para configurar os botões
emotionOptionButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Só funciona se o jogo estiver ativo (evita clique duplo)
        if (!emotionGameActive) return; 

        const emotion = button.dataset.emotion;
        
        if (emotion === currentEmotionQuestion.correctEmotion) {
            handleEmotionCorrectAnswer();
        } else {
            handleEmotionWrongAnswer(emotion);
        }
    });
});