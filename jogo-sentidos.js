// jogo-sentidos.js
// VERSÃO 5 (Progressão de Níveis Implementada)

// --- Referências da UI ---
const targetZone = document.getElementById("target-zone");
const draggableShapes = document.querySelectorAll("#draggable-shapes .shape");
const feedbackText = document.getElementById("sensory-feedback-text");
const titleText = document.getElementById("sensory-title");
const instructionText = document.getElementById("sensory-instruction");

// --- 1. DEFINIÇÃO DOS NÍVEIS ---
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

// --- 2. Variáveis de Estado ---
let currentSensoryLevelIndex = 0;
let draggedShape = null; 
let isDragging = false; 

// --- 3. Funções de Início e Fim (Chamadas pelo Menu) ---

function startSensoryGame() {
    console.log("Iniciando Aventura dos Sentidos...");
    currentSensoryLevelIndex = 0; // Sempre começa da fase 0
    loadSensoryLevel(currentSensoryLevelIndex); // Carrega a primeira fase
    addDragDropListeners();
}

function stopSensoryGame() {
    console.log("Parando Aventura dos Sentidos...");
    removeDragDropListeners();
    
    // Garante que nenhum estado de "arrastando" seja mantido
    if (draggedShape) {
        draggedShape.style.opacity = "1";
        draggedShape.style.transform = "translate(0, 0)";
    }
    draggedShape = null;
    isDragging = false;
    
    // Limpa os textos ao sair
    titleText.textContent = "Aventura dos Sentidos";
    instructionText.textContent = "Pratique suas habilidades!";
    feedbackText.textContent = "";
    feedbackText.className = "";
    targetZone.textContent = "";
    targetZone.className = "";
}

// --- 4. Função de Carregar Nível ---
// (Substitui a lógica antiga do 'resetSensoryGame')

function loadSensoryLevel(index) {
    const level = sensoryLevels[index];
    
    titleText.textContent = level.title;
    instructionText.textContent = level.instruction;
    feedbackText.textContent = "";
    feedbackText.className = "";
    targetZone.dataset.targetShape = level.targetShape; 
    targetZone.textContent = level.targetText;
    targetZone.className = ""; // Limpa .correct-drop

    // Reposiciona e MOSTRA todas as formas
    draggableShapes.forEach(shape => {
        const parent = document.getElementById("draggable-shapes");
        if (shape.parentElement !== parent) {
             parent.appendChild(shape); 
        }
        shape.style.opacity = "1"; // <-- Mostra a forma de novo
        shape.style.transform = "translate(0, 0)"; // Reseta posição
    });
}


// --- 5. Lógica de Drag and Drop (Mouse e Toque) ---
// (Esta seção permanece inalterada)

function addDragDropListeners() {
    draggableShapes.forEach(shape => {
        // --- Eventos de MOUSE ---
        shape.addEventListener("dragstart", handleDragStart);
        shape.addEventListener("dragend", handleDragEnd);

        // --- Eventos de TOQUE ---
        shape.addEventListener("touchstart", handleTouchStart, { passive: false });
    });

    // --- Eventos da Zona Alvo (MOUSE) ---
    targetZone.addEventListener("dragover", handleDragOver);
    targetZone.addEventListener("dragleave", handleDragLeave);
    targetZone.addEventListener("drop", handleDrop);

    // --- Eventos Globais (TOQUE) ---
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
}

function removeDragDropListeners() {
    draggableShapes.forEach(shape => {
        shape.removeEventListener("dragstart", handleDragStart);
        shape.removeEventListener("dragend", handleDragEnd);
        shape.removeEventListener("touchstart", handleTouchStart);
    });
    targetZone.removeEventListener("dragover", handleDragOver);
    targetZone.removeEventListener("dragleave", handleDragLeave);
    targetZone.removeEventListener("drop", handleDrop);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
}


// =========== MANIPULADORES DE EVENTOS DE MOUSE ============
// (Esta seção permanece inalterada)

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


// ========= MANIPULADORES DE EVENTOS DE TOQUE (TOUCH) =========
// (Esta seção permanece inalterada)

let initialX = 0;
let initialY = 0;
let offsetX = 0;
let offsetY = 0;

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
    
    draggedShape.style.display = 'none';
    let elementOver = document.elementFromPoint(touch.clientX, touch.clientY);
    draggedShape.style.display = '';

    if (elementOver && elementOver.closest('#target-zone')) {
        targetZone.classList.add("drag-over");
    } else {
        targetZone.classList.remove("drag-over");
    }
}

function handleTouchEnd(e) {
    if (!isDragging || !draggedShape) return;

    let touch = e.changedTouches[0];
    
    draggedShape.style.display = 'none';
  let elementOver = document.elementFromPoint(touch.clientX, touch.clientY);
    draggedShape.style.display = '';

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


// =========== 6. LÓGICA DE VERIFICAÇÃO (Modificada) =============

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
    
    // Esconde a forma correta e a impede de ser arrastada
    shapeElement.style.opacity = "0";
    shapeElement.style.transform = "translate(0, 0)"; 

    // --- LÓGICA DE PROGRESSÃO ---
    setTimeout(() => {
        currentSensoryLevelIndex++; // Avança para a próxima fase

        if (currentSensoryLevelIndex < sensoryLevels.length) {
            // Ainda há fases, carrega a próxima
            loadSensoryLevel(currentSensoryLevelIndex);
        } else {
            // Terminou todas as fases
            titleText.textContent = "Parabéns!";
            instructionText.textContent = "Você completou todas as fases!";
            feedbackText.textContent = "Você é ótimo com as formas!";
            feedbackText.className = "correct";
            targetZone.textContent = "VITÓRIA!";
            
            // Opcional: Desabilitar o drag and drop
            removeDragDropListeners();
        }
    }, 2000); // Espera 2s antes de avançar
}

function handleWrongDrop(shapeElement) {
    // (Esta função permanece inalterada)
    console.log("ERROU - SENTIDOS!");
    targetZone.classList.add("wrong-drop");
    feedbackText.textContent = "Oops! Tente de novo.";
    feedbackText.className = "wrong";
    
    // Anima a forma de volta ao lugar
    shapeElement.style.opacity = "1";
    shapeElement.style.transform = "translate(0, 0)";
    
    setTimeout(() => {
        targetZone.classList.remove("wrong-drop");
        feedbackText.textContent = "";
        feedbackText.className = "";
    }, 1000);
}