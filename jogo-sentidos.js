// jogo-sentidos.js
// VERSÃO 8 (Correção definitiva para "desaparecimento" no mobile usando 'visibility')

// --- 1. Referências da UI ---
const targetZone = document.getElementById("target-zone");
const draggableShapes = document.querySelectorAll("#draggable-shapes .shape"); 
const feedbackText = document.getElementById("sensory-feedback-text");
const titleText = document.getElementById("sensory-title");
const instructionText = document.getElementById("sensory-instruction");

// --- 2. Definição dos Níveis ---
const sensoryLevels = [
    {
        title: "Fase 1: O Círculo",
        instruction: "Arraste o CÍRCULO para a caixa.",
        targetShape: "circulo",
        targetText: "Solte o CÍRCULO aqui"
    },
    {
        title: "Fase 2: O Quadrado",
        instruction: "Agora, arraste o QUADRADO para a caixa.",
        targetShape: "quadrado",
        targetText: "Solte o QUADRADO aqui"
    },
    {
        title: "Fase 3: O Triângulo",
        instruction: "Por último, arraste o TRIÂNGULO para a caixa.",
        targetShape: "triangulo",
        targetText: "Solte o TRIÂNGULO aqui"
    }
];

// --- 3. Variáveis de Estado ---
let currentSensoryLevelIndex = 0;
let currentSensoryDifficulty = 'facil';
let draggedShape = null; 
let isDragging = false; 

// --- 4. Funções de Início e Fim ---

function startSensoryGame(difficulty = 'facil') {
    console.log("Iniciando Aventura dos Sentidos (Dificuldade: " + difficulty + ")");
    currentSensoryDifficulty = difficulty;
    currentSensoryLevelIndex = 0;
    loadSensoryLevel(currentSensoryLevelIndex);
}

function stopSensoryGame() {
    console.log("Parando Aventura dos Sentidos...");
    if (draggedShape) {
        draggedShape.style.opacity = "1";
        draggedShape.style.transform = "translate(0, 0)";
        draggedShape.style.visibility = 'visible'; // Garante que está visível
    }
    draggedShape = null;
    isDragging = false;
}

// --- 5. Função de Carregar Nível ---
function loadSensoryLevel(index) {
    const level = sensoryLevels[index];
    
    titleText.textContent = level.title;
    instructionText.textContent = level.instruction;
    feedbackText.textContent = "";
    feedbackText.className = "";
    targetZone.dataset.targetShape = level.targetShape; 
    targetZone.textContent = level.targetText;
    targetZone.className = "";

    draggableShapes.forEach(shape => {
        const shapeType = shape.dataset.shape;
        let showShape = false;

        if (shapeType === 'circulo' || shapeType === 'quadrado' || shapeType === 'triangulo') {
            showShape = true;
        }
        if (currentSensoryDifficulty === 'medio' && shapeType === 'estrela') {
            showShape = true;
        }
        if (currentSensoryDifficulty === 'dificil' && (shapeType === 'estrela' || shapeType === 'pentagono')) {
            showShape = true;
        }
        
        shape.style.display = showShape ? "block" : "none";
        shape.style.opacity = "1";
        shape.style.transform = "translate(0, 0)";
        shape.style.visibility = 'visible'; // Garante que está visível
    });
}

// --- 6. Lógica de Drag and Drop (Mouse - Inalterada) ---

function handleDragStart(e) {
    draggedShape = this; 
    isDragging = true;
    e.dataTransfer.setData("text/plain", this.id);
    setTimeout(() => { this.style.opacity = "0.5"; }, 0);
}

function handleDragEnd() {
    if (isDragging) {
        draggedShape.style.opacity = "1";
        draggedShape = null;
        isDragging = false;
        targetZone.classList.remove("drag-over");
    }
}

function handleDragOver(e) {
    e.preventDefault(); 
    this.classList.add("drag-over");
}

function handleDragLeave() {
    this.classList.remove("drag-over");
}

function handleDrop(e) {
    e.preventDefault();
    if (!draggedShape) return;
    checkDropLogic(draggedShape);
}

// --- 7. Lógica de Drag and Drop (Touch - CORRIGIDA) ---
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
    
    // --- INÍCIO DA CORREÇÃO (VISIBILITY) ---
    // Usa 'visibility' em vez de 'display' para evitar bugs de layout/desaparecimento
    draggedShape.style.visibility = 'hidden';
    let elementOver = document.elementFromPoint(touch.clientX, touch.clientY);
    draggedShape.style.visibility = 'visible';
    // --- FIM DA CORREÇÃO ---
    
    if (elementOver && elementOver.closest('#target-zone')) {
        targetZone.classList.add("drag-over");
    } else {
        targetZone.classList.remove("drag-over");
    }
}

function handleTouchEnd(e) {
    if (!isDragging || !draggedShape) return;
    let touch = e.changedTouches[0];
    
    // --- INÍCIO DA CORREÇÃO (VISIBILITY) ---
    draggedShape.style.visibility = 'hidden';
    let elementOver = document.elementFromPoint(touch.clientX, touch.clientY);
    draggedShape.style.visibility = 'visible';
    // --- FIM DA CORREÇÃO ---
    
    const currentDraggedShape = draggedShape;
    isDragging = false;
    draggedShape = null;
    offsetX = 0;
    offsetY = 0;
    targetZone.classList.remove("drag-over");
    
    if (elementOver && elementOver.closest('#target-zone')) {
        checkDropLogic(currentDraggedShape);
    } else {
        currentDraggedShape.style.opacity = "1";
        currentDraggedShape.style.transform = "translate(0, 0)";
    }
}

// --- 8. Lógica de Verificação (Inalterada) ---

function checkDropLogic(shapeElement) {
    if (!shapeElement) return;
    const shapeType = shapeElement.dataset.shape;
    const targetType = targetZone.dataset.targetShape;
    if (shapeType === targetType) {
        handleCorrectDrop(shapeElement);
    } else {
        handleWrongDrop(shapeElement);
    }
}

function handleCorrectDrop(shapeElement) {
    console.log("ACERTOU - SENTIDOS!");
    targetZone.textContent = "Muito bem!";
    targetZone.classList.add("correct-drop");
    feedbackText.textContent = "Parabéns, você achou o " + targetZone.dataset.targetShape + "!";
    feedbackText.className = "correct";
    
    // Esconde a forma
    shapeElement.style.display = "none";

    setTimeout(() => {
        currentSensoryLevelIndex++;
        if (currentSensoryLevelIndex < sensoryLevels.length) {
            loadSensoryLevel(currentSensoryLevelIndex);
        } else {
            titleText.textContent = "Parabéns!";
            instructionText.textContent = "Você completou todas as fases!";
            feedbackText.textContent = "Você é ótimo com as formas!";
            feedbackText.className = "correct";
       targetZone.textContent = "VITÓRIA!";
        }
    }, 2000); 
}

function handleWrongDrop(shapeElement) {
    console.log("ERROU - SENTIDOS!");
    targetZone.classList.add("wrong-drop");
    feedbackText.textContent = "Oops! Tente de novo.";
    feedbackText.className = "wrong";
    
    shapeElement.style.opacity = "1";
    shapeElement.style.transform = "translate(0, 0)";
    
    setTimeout(() => {
        targetZone.classList.remove("wrong-drop");
        feedbackText.textContent = "";
        feedbackText.className = "";
    }, 1000);
}


// --- 9. Inicialização ÚNICA dos Listeners ---
function addDragDropListeners() {
    draggableShapes.forEach(shape => {
        shape.addEventListener("dragstart", handleDragStart);
        shape.addEventListener("dragend", handleDragEnd);
        shape.addEventListener("touchstart", handleTouchStart, { passive: false });
    });

    targetZone.addEventListener("dragover", handleDragOver);
    targetZone.addEventListener("dragleave", handleDragLeave);
    targetZone.addEventListener("drop", handleDrop);

   document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
}

addDragDropListeners();