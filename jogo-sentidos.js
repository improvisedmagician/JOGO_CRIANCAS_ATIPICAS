// jogo-sentidos.js
// VERSÃO 16 (Lógica de Alvo Único + Dificuldade 3/5/7)

// --- 1. Referências da UI ---
const targetZone = document.getElementById("target-zone"); // Alvo Único
const draggableShapes = document.querySelectorAll("#draggable-shapes .shape"); 
const feedbackText = document.getElementById("sensory-feedback-text");
const titleText = document.getElementById("sensory-title");
const instructionText = document.getElementById("sensory-instruction");

// --- 2. Definição das Formas (7 no total) ---
const allShapes = [
    { shape: "circulo", name: "CÍRCULO" },
    { shape: "quadrado", name: "QUADRADO" },
    { shape: "triangulo", name: "TRIÂNGULO" },
    { shape: "estrela", name: "ESTRELA" },
    { shape: "pentagono", name: "PENTÁGONO" },
    { shape: "hexagono", name: "HEXÁGONO" },
    { shape: "losango", name: "LOSANGO" }
];

// --- 3. Definição de Dificuldade (LÓGICA 3/5/7) ---
const sensoryDifficultySettings = {
    // Fácil: 3 formas
    facil: { targetShapes: ["circulo", "quadrado", "triangulo"] },
    // Médio: 5 formas
    medio: { targetShapes: ["circulo", "quadrado", "triangulo", "estrela", "pentagono"] },
    // Difícil: 7 formas
    dificil: { targetShapes: ["circulo", "quadrado", "triangulo", "estrela", "pentagono", "hexagono", "losango"] }
};

// --- 4. Variáveis de Estado ---
let currentLevelList = []; // Lista de alvos (ex: 3, 5 ou 7 formas)
let currentVisibleShapes = []; // Formas na tela (igual a currentLevelList, pois não há distratores)
let currentSensoryLevelIndex = 0; // Qual alvo estamos procurando (0, 1, 2...)
let draggedShape = null; 
let isDragging = false; 

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- 5. Funções de Início e Fim ---

function startSensoryGame(difficulty = 'facil') {
    console.log("Iniciando Jogo de Alvo Único (Dificuldade: " + difficulty + ")");
    
    // 1. Define as formas-alvo E as formas visíveis para este nível
    const settings = sensoryDifficultySettings[difficulty];
    currentVisibleShapes = settings.targetShapes;
    
    // 2. A lista de alvos é uma cópia embaralhada das formas visíveis
    currentLevelList = [...currentVisibleShapes];
    shuffleArray(currentLevelList);
    
    // 3. Reseta o progresso
    currentSensoryLevelIndex = 0;

    // 4. Reseta a UI (mostra/esconde formas)
    titleText.textContent = "Aventura dos Sentidos";
    instructionText.textContent = "Encontre a forma pedida.";
    draggableShapes.forEach(shape => {
        const shapeType = shape.dataset.shape;
        // Mostra a forma se ela fizer parte deste nível
        if (currentVisibleShapes.includes(shapeType)) {
            shape.style.display = "block";
            shape.style.opacity = "1";
            shape.style.transform = "translate(0, 0)";
            shape.style.visibility = 'visible'; 
        } else {
            shape.style.display = "none";
        }
    });
    
    // 5. Carrega o primeiro alvo
    loadSensoryTarget(currentSensoryLevelIndex);
}

function stopSensoryGame() {
    console.log("Parando Aventura dos Sentidos...");
    if (draggedShape) {
        draggedShape.style.opacity = "1";
        draggedShape.style.transform = "translate(0, 0)";
        draggedShape.style.visibility = 'visible'; 
    }
    draggedShape = null;
    isDragging = false;
}

// --- 6. Função de Carregar Alvo ---
function loadSensoryTarget(index) {
    // Pega o nome da forma (ex: "circulo")
    const targetShapeName = currentLevelList[index];
    // Pega as informações completas (ex: {shape: "circulo", name: "CÍRCULO"})
    const targetInfo = allShapes.find(s => s.shape === targetShapeName);

    titleText.textContent = `Fase ${index + 1} de ${currentLevelList.length}`;
    instructionText.textContent = `Arraste o ${targetInfo.name} para a caixa.`;
    
    // Define o alvo no #target-zone
    targetZone.dataset.targetShape = targetInfo.shape; 
    targetZone.textContent = `Solte o ${targetInfo.name} aqui`;
    targetZone.className = ""; // Limpa a cor verde/vermelha
}

// --- 7. Lógica de Drag and Drop (Mouse) ---
function handleDragStart(e) {
    draggedShape = this; 
    isDragging = true;
    e.dataTransfer.setData("text/plain", this.id);
    setTimeout(() => { this.style.opacity = "0.5"; }, 0);
}
function handleDragEnd() {
    if (isDragging) {
        draggedShape.style.opacity = "1";
    }
    draggedShape = null;
    isDragging = false;
    targetZone.classList.remove('drag-over'); // Limpa o hover do alvo
}
function handleDragOver(e) {
    e.preventDefault(); 
    if (!targetZone.classList.contains('correct-drop')) {
        targetZone.classList.add("drag-over");
    }
}
function handleDragLeave() {
    targetZone.classList.remove("drag-over");
}
function handleDrop(e) {
    e.preventDefault();
    if (!draggedShape) return;
    isDragging = false; // Informa ao handleDragEnd que o drop foi tratado
    checkDropLogic(draggedShape, targetZone); 
}

// --- 8. Lógica de Drag and Drop (Touch) ---
let initialX = 0, initialY = 0, offsetX = 0, offsetY = 0;

function handleTouchStart(e) {
    e.preventDefault(); 
    draggedShape = this; 
    isDragging = true;
    let touch = e.touches[0];
    initialX = touch.clientX - offsetX;
    initialY = touch.clientY - offsetY;
    draggedShape.style.opacity = "0.5";
    draggedShape.style.zIndex = "1000"; 
}

function handleTouchMove(e) {
    if (!isDragging || !draggedShape) return;
    e.preventDefault();
    let touch = e.touches[0];
    let currentX = touch.clientX - initialX;
    let currentY = touch.clientY - initialY;
    offsetX = currentX;
    offsetY = currentY;
    draggedShape.style.transform = `translate(${currentX}px, ${currentY}px)`;
    
    draggedShape.style.visibility = 'hidden';
    let elementOver = document.elementFromPoint(touch.clientX, touch.clientY);
    draggedShape.style.visibility = 'visible';
    
    if (elementOver && elementOver.closest('#target-zone')) {
        targetZone.classList.add("drag-over");
    } else {
        targetZone.classList.remove("drag-over");
    }
}

function handleTouchEnd(e) {
    if (!isDragging || !draggedShape) return;
    let touch = e.changedTouches[0];
    
    draggedShape.style.visibility = 'hidden';
    let elementOver = document.elementFromPoint(touch.clientX, touch.clientY);
    draggedShape.style.visibility = 'visible';
    
    const currentDraggedShape = draggedShape;
    draggedShape = null;
    isDragging = false; 
    offsetX = 0;
    offsetY = 0;
    
    targetZone.classList.remove('drag-over');
    
    if (elementOver && elementOver.closest('#target-zone')) {
        checkDropLogic(currentDraggedShape, targetZone);
    } else {
        currentDraggedShape.style.opacity = "1";
        currentDraggedShape.style.transform = "translate(0, 0)";
    }
}

// --- 9. Lógica de Verificação (Alvo Único) ---

function checkDropLogic(shapeElement, targetBox) {
    if (!shapeElement || !targetBox) return;

    const shapeType = shapeElement.dataset.shape;
    const targetType = targetBox.dataset.targetShape;

    if (shapeType === targetType) {
        handleCorrectDrop(shapeElement, targetBox);
    } else {
        handleWrongDrop(shapeElement, targetBox);
    }
}

function handleCorrectDrop(shapeElement, targetBox) {
    console.log("ACERTOU - SENTIDOS!");
    
    targetBox.classList.add("correct-drop");
    targetBox.textContent = "✓ Certo!"; 
    shapeElement.style.display = "none"; // Esconde a forma correta

    feedbackText.textContent = "Parabéns, você achou o " + targetBox.dataset.targetShape + "!";
    feedbackText.className = "correct";
    
    // Avança para o próximo alvo
    currentSensoryLevelIndex++;
    
    setTimeout(() => {
        // Verifica se completou todos os alvos do nível
        if (currentSensoryLevelIndex < currentLevelList.length) {
            loadSensoryTarget(currentSensoryLevelIndex);
        } else {
            // Vitória
            titleText.textContent = "Parabéns!";
            instructionText.textContent = "Você encontrou todas as formas!";
            feedbackText.textContent = "Muito bem!";
            feedbackText.className = "correct";
            targetZone.textContent = "VITÓRIA!";
}
    }, 2000); 
}

function handleWrongDrop(shapeElement, targetBox) {
    console.log("ERROU - SENTIDOS!");
    
    if (targetBox) {
        targetBox.classList.add("wrong-drop");
 }
    
    feedbackText.textContent = "Oops! Tente de novo.";
    feedbackText.className = "wrong";
    
    shapeElement.style.opacity = "1";
    shapeElement.style.transform = "translate(0, 0)";
    
    setTimeout(() => {
        if (targetBox) {
            targetBox.classList.remove("wrong-drop");
        }
        feedbackText.textContent = "";
        feedbackText.className = "";
    }, 1000);
}

// --- 10. Inicialização ÚNICA dos Listeners ---
function addDragDropListeners() {
    // Adiciona listeners às 7 formas
    draggableShapes.forEach(shape => {
        shape.addEventListener("dragstart", handleDragStart);
        shape.addEventListener("dragend", handleDragEnd);
        shape.addEventListener("touchstart", handleTouchStart, { passive: false });
    });
    
    // Adiciona listeners ao ALVO ÚNICO
    targetZone.addEventListener("dragover", handleDragOver);
    targetZone.addEventListener("dragleave", handleDragLeave);
    targetZone.addEventListener("drop", handleDrop);
    
    // Listeners globais de toque
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
}
addDragDropListeners();