// jogo-sentidos.js
// VERSÃO 17 (Revisão Profissional - Lógica de Alvo Único 3/5/7)

// --- 1. Definições ---
const allShapes = [
    { shape: "circulo", name: "CÍRCULO" },
    { shape: "quadrado", name: "QUADRADO" },
    { shape: "triangulo", name: "TRIÂNGULO" },
  	{ shape: "estrela", name: "ESTRELA" },
  	{ shape: "pentagono", name: "PENTÁGONO" },
  	{ shape: "hexagono", name: "HEXÁGONO" },
  	{ shape: "losango", name: "LOSANGO" }
];
const difficultySettings = {
  	facil: { shapes: ["circulo", "quadrado", "triangulo"] },
  	medio: { shapes: ["circulo", "quadrado", "triangulo", "estrela", "pentagono"] },
  	dificil: { shapes: ["circulo", "quadrado", "triangulo", "estrela", "pentagono", "hexagono", "losango"] }
};

// --- 2. Referências da UI ---
const targetZone = document.getElementById("target-zone");
const draggableShapes = document.querySelectorAll("#draggable-shapes .shape"); 
const feedbackText = document.getElementById("sensory-feedback-text");
const titleText = document.getElementById("sensory-title");
const instructionText = document.getElementById("sensory-instruction");

// --- 3. Variáveis de Estado ---
let targetList = []; // A lista de alvos para a rodada
let currentTargetIndex = 0; // O índice do alvo atual
let draggedElement = null; // O elemento HTML sendo arrastado
let isDragging = false; // Flag para o bug do mouse 'dragend'

// --- 4. Funções Principais (Início / Fim) ---
function startSensoryGame(difficulty = 'facil') {
  	console.log("Iniciando Jogo dos Sentidos (Alvo Único) - Dificuldade: " + difficulty);
  	
  	// Define as formas visíveis e as formas alvo
  	const settings = difficultySettings[difficulty] || difficultySettings.facil;
  	const visibleShapes = settings.shapes;
  	
  	targetList = [...visibleShapes];
  	shuffleArray(targetList); // Embaralha a ordem dos alvos
  	
  	currentTargetIndex = 0;
  	
  	// Reseta a UI
  	titleText.textContent = "Aventura dos Sentidos";
  	feedbackText.textContent = "";

  	// Mostra/Esconde as formas corretas
  	draggableShapes.forEach(shape => {
  		const shapeType = shape.dataset.shape;
  		if (visibleShapes.includes(shapeType)) {
  			shape.style.display = "block";
  			shape.style.opacity = "1";
  			shape.style.transform = "translate(0, 0)";
  			shape.style.visibility = 'visible'; 
  		} else {
  			shape.style.display = "none";
  		}
  	});
  	
  	// Carrega o primeiro alvo
  	loadNextTarget();
}

function stopSensoryGame() {
  	console.log("Parando Jogo dos Sentidos...");
  	draggedElement = null;
  	isDragging = false;
}

// --- 5. Lógica do Jogo ---

function loadNextTarget() {
  	// Verifica se o jogo terminou
  	if (currentTargetIndex >= targetList.length) {
  		// VITÓRIA
  		titleText.textContent = "Parabéns!";
  		instructionText.textContent = "Você encontrou todas as formas!";
  		feedbackText.textContent = "Muito bem!";
  		feedbackText.className = "correct";
  		targetZone.textContent = "VITÓRIA!";
  		targetZone.className = "correct-drop";
  		
  		// Esconde as formas restantes (se houver alguma)
  		draggableShapes.forEach(shape => shape.style.display = "none");
  		return;
  	}
  	
  	// Pega o próximo alvo
  	const targetShapeName = targetList[currentTargetIndex];
  	const targetInfo = allShapes.find(s => s.shape === targetShapeName);

  	titleText.textContent = `Fase ${currentTargetIndex + 1} de ${targetList.length}`;
  	instructionText.textContent = `Arraste o ${targetInfo.name} para a caixa.`;
  	
  	// Atualiza o alvo
  	targetZone.dataset.targetShape = targetInfo.shape; 
  	targetZone.textContent = `Solte o ${targetInfo.name} aqui`;
  	targetZone.className = ""; // Limpa a cor
}

function checkDrop(shapeElement, targetElement) {
  	if (!shapeElement || !targetElement) return;

  	const shapeType = shapeElement.dataset.shape;
  	const targetType = targetElement.dataset.targetShape;

  	if (shapeType === targetType) {
  		// --- ACERTO ---
  		console.log("ACERTOU: " + shapeType);
  		targetElement.classList.add("correct-drop");
  		targetElement.textContent = "✓ Certo!"; 
  		shapeElement.style.display = "none"; // Esconde a forma

  		feedbackText.textContent = "Parabéns, você achou o " + targetType + "!";
  		feedbackText.className = "correct";
  		
  		currentTargetIndex++; // Avança para o próximo alvo
  		
  		setTimeout(() => {
  			loadNextTarget();
  		}, 1500); 
  		
  	} else {
  		// --- ERRO ---
  		console.log("ERROU: Soltou " + shapeType + " no " + targetType);
  		targetElement.classList.add("wrong-drop");
  		feedbackText.textContent = "Oops! Tente de novo.";
  		feedbackText.className = "wrong";
  		
  		// Retorna a forma ao lugar
  		shapeElement.style.opacity = "1";
  		shapeElement.style.transform = "translate(0, 0)";
  		
  		setTimeout(() => {
  			targetElement.classList.remove("wrong-drop");
  			feedbackText.textContent = "";
  			feedbackText.className = "";
  		}, 1000);
  	}
}

// --- 6. Funções de Event Listeners ---

// Funções de Mouse
function onDragStart(e) {
  	draggedElement = this; 
  	isDragging = true;
  	e.dataTransfer.setData("text/plain", "shape"); // Mudado de this.id para compatibilidade
  	setTimeout(() => { this.style.opacity = "0.5"; }, 0);
}
function onDragEnd() {
  	// Só retorna a peça se o drop NÃO foi bem sucedido (isDragging ainda é true)
  	if (isDragging) {
  		draggedElement.style.opacity = "1";
  	}
  	draggedElement = null;
  	isDragging = false;
  	targetZone.classList.remove('drag-over'); 
}
function onDragOver(e) {
  	e.preventDefault(); 
  	if (!targetZone.classList.contains('correct-drop')) {
  		targetZone.classList.add("drag-over");
  	}
}
function onDragLeave() {
  	targetZone.classList.remove("drag-over");
}
function onDrop(e) {
  	e.preventDefault();
  	if (!draggedElement) return;
  	isDragging = false; // Drop foi tratado, avisa o onDragEnd
  	checkDrop(draggedElement, targetZone); 
}

// Funções de Toque
let touchInitialX = 0, touchInitialY = 0, touchOffsetX = 0, touchOffsetY = 0;
let currentTouchTarget = null; // Guarda o alvo que está sendo sobrevoado

function onTouchStart(e) {
  	e.preventDefault(); 
  	draggedElement = this; 
  	isDragging = true;
  	let touch = e.touches[0];
  	touchInitialX = touch.clientX - touchOffsetX;
  	touchInitialY = touch.clientY - touchOffsetY;
  	draggedElement.style.opacity = "0.5";
  	draggedElement.style.zIndex = "1000"; 
}
function onTouchMove(e) {
  	if (!isDragging || !draggedElement) return;
  	e.preventDefault();
  	let touch = e.touches[0];
  	touchOffsetX = touch.clientX - touchInitialX;
  	touchOffsetY = touch.clientY - touchInitialY;
  	draggedElement.style.transform = `translate(${touchOffsetX}px, ${touchOffsetY}px)`;
  	
  	draggedElement.style.visibility = 'hidden';
  	let elementOver = document.elementFromPoint(touch.clientX, touch.clientY);
  	draggedElement.style.visibility = 'visible';
  	
  	const targetOver = elementOver ? elementOver.closest('#target-zone') : null;
  	
  	if (currentTouchTarget && currentTouchTarget !== targetOver) {
  		currentTouchTarget.classList.remove("drag-over");
  	}
  	
  	if (targetOver && !targetOver.classList.contains('correct-drop')) {
  		targetOver.classList.add("drag-over");
  		currentTouchTarget = targetOver;
  	} else {
  		currentTouchTarget = null;
  	}
}
function onTouchEnd(e) {
  	if (!isDragging || !draggedElement) return;
  	let touch = e.changedTouches[0];
  	
  	const currentDragged = draggedElement;
  	draggedElement = null;
  	isDragging = false; 
  	touchOffsetX = 0;
  	touchOffsetY = 0;
  	
  	if(currentTouchTarget) {
  		currentTouchTarget.classList.remove('drag-over');
  	}

  	if (currentTouchTarget) {
  		checkDrop(currentDragged, currentTouchTarget);
  	} else {
  		// Soltou fora, retorna
  		currentDragged.style.opacity = "1";
  		currentDragged.style.transform = "translate(0, 0)";
  	}
}

// --- 7. Inicialização ---
function initSensoryGame() {
  	// Adiciona listeners às 7 formas
  	draggableShapes.forEach(shape => {
  		shape.addEventListener("dragstart", onDragStart);
  		shape.addEventListener("dragend", onDragEnd);
  		shape.addEventListener("touchstart", onTouchStart, { passive: false });
  	});
  	
  	// Adiciona listeners ao ALVO ÚNICO
  	targetZone.addEventListener("dragover", onDragOver);
  	targetZone.addEventListener("dragleave", onDragLeave);
  	targetZone.addEventListener("drop", onDrop);
  	
  	// Listeners globais de toque
  	document.addEventListener("touchmove", onTouchMove, { passive: false });
  	document.addEventListener("touchend", onTouchEnd, { passive: false });
}

// Embaralha o array (helper)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Inicia os listeners
initSensoryGame();