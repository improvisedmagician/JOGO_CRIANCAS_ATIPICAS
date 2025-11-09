// jogo-reciclagem.js
// VERSÃO 3 (Mensagem de Parabéns melhorada)

// --- 1. Referências da UI ---
const recycleGameContainer = document.getElementById("recycle-game-container");
const recycleItemsContainer = document.getElementById("recycle-items-container");
const recycleBinContainer = document.getElementById("recycle-bin-container");
const recycleFeedbackText = document.getElementById("recycle-feedback-text");
const recycleTitle = document.getElementById("recycle-title");
const recycleInstruction = document.getElementById("recycle-instruction"); // Adicionado


// --- 2. Banco de Itens e Lixeiras ---
const allTrashItems = [
    { id: "garrafa-pet", type: "plastico", name: "Garrafa PET" },
    { id: "jornal", type: "papel", name: "Jornal" },
    { id: "lata-refri", type: "metal", name: "Lata" },
    { id: "garrafa-vidro", type: "vidro", name: "Garrafa de Vidro" },
    { id: "casca-banana", type: "organico", name: "Casca de Banana" }
];

const allBins = [
    { type: "plastico", name: "Plástico" },
    { type: "papel", name: "Papel" },
    { type: "vidro", name: "Vidro" },
    { type: "metal", name: "Metal" },
    { type: "organico", name: "Orgânico" }
];

// --- 3. Definição de Dificuldade (Lógica 3/4/5 Lixeiras) ---
const recyclingDifficultySettings = {
    facil: { bins: ["plastico", "papel", "organico"] },
    medio: { bins: ["plastico", "papel", "vidro", "metal"] },
    dificil: { bins: ["plastico", "papel", "vidro", "metal", "organico"] }
};

// --- 4. Variáveis de Estado ---
let currentBins = []; // Lixeiras ativas
let currentTrashList = []; // Lista de lixos para o nível
let currentTrashIndex = 0; // Qual lixo estamos mostrando
let draggedTrashItem = null; 
let isDraggingTrash = false; 

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- 5. Funções de Início e Fim ---

function startRecyclingGame(difficulty = 'facil') {
    console.log("Iniciando EcoAventura. Dificuldade: " + difficulty);
    
    const settings = recyclingDifficultySettings[difficulty];
    currentBins = settings.bins;
    
    // 1. Filtra os lixos que correspondem às lixeiras do nível
    currentTrashList = allTrashItems.filter(item => currentBins.includes(item.type));
    shuffleArray(currentTrashList);
    
    // 2. Reseta o progresso
    currentTrashIndex = 0;
    
    // 3. Reseta a UI
    recycleTitle.textContent = "EcoAventura ♻️";
    recycleInstruction.textContent = "Arraste o lixo para a lixeira correta!"; // Reseta instrução
    recycleFeedbackText.textContent = "";
    
    // 4. Cria as lixeiras na tela
    createRecycleBins();
    
    // 5. Carrega o primeiro item de lixo
    loadRecycleItem(currentTrashIndex);
}

function stopRecyclingGame() {
    console.log("Parando EcoAventura.");
    draggedTrashItem = null;
    isDraggingTrash = false;
    recycleItemsContainer.innerHTML = "";
    recycleBinContainer.innerHTML = "";
}

// --- 6. Funções de Carregamento de UI ---

function createRecycleBins() {
    recycleBinContainer.innerHTML = "";
    
    // Ajusta o grid
    let len = currentBins.length;
    if (len <= 3) {
        recycleBinContainer.style.gridTemplateColumns = `repeat(${len}, 1fr)`;
    } else {
        recycleBinContainer.style.gridTemplateColumns = "1fr 1fr";
    }

    currentBins.forEach(binType => {
        const binInfo = allBins.find(b => b.type === binType);
        const binBox = document.createElement('div');
        binBox.className = 'recycle-bin';
        binBox.dataset.bin = binInfo.type;
        binBox.textContent = binInfo.name;
        
        // Adiciona listeners de Mouse para o alvo
        binBox.addEventListener("dragover", handleDragOver);
        binBox.addEventListener("dragleave", handleDragLeave);
        binBox.addEventListener("drop", handleDrop);
        
        recycleBinContainer.appendChild(binBox);
    });
}

function loadRecycleItem(index) {
    // Limpa o feedback
    recycleFeedbackText.textContent = "";
    recycleBinContainer.querySelectorAll('.recycle-bin').forEach(b => b.className = 'recycle-bin');
    
    // Verifica se ganhou
    if (index >= currentTrashList.length) {
        // MENSAGEM DE PARABÉNS MELHORADA
        recycleTitle.textContent = "Parabéns, Amigo da Natureza! 🌱";
        recycleInstruction.textContent = "Você reciclou todo o lixo e deixou o planeta mais bonito!";
        recycleFeedbackText.textContent = "Excelente trabalho!";
        recycleFeedbackText.className = "correct";
        recycleItemsContainer.innerHTML = ""; // Limpa lixo
        return;
    }

    const item = currentTrashList[index];
    
    // Cria o item de lixo
    const itemElement = document.createElement('div');
    itemElement.className = 'recycle-item';
    itemElement.dataset.type = item.type;
    itemElement.dataset.item = item.id;
    itemElement.draggable = true;
    
    // Adiciona listeners (Mouse)
    itemElement.addEventListener("dragstart", handleDragStart);
    itemElement.addEventListener("dragend", handleDragEnd);
    // Adiciona listeners (Touch)
    itemElement.addEventListener("touchstart", handleTouchStart, { passive: false });
    
    recycleItemsContainer.innerHTML = ""; // Limpa o item anterior
    recycleItemsContainer.appendChild(itemElement);
}

// --- 7. Lógica de Drag and Drop (Mouse) ---
function handleDragStart(e) {
    draggedTrashItem = this; 
    isDraggingTrash = true;
    e.dataTransfer.setData("text/plain", this.id);
    setTimeout(() => { this.style.opacity = "0.5"; }, 0);
}
function handleDragEnd() {
    if (isDraggingTrash) {
        draggedTrashItem.style.opacity = "1";
    }
    draggedTrashItem = null;
    isDraggingTrash = false;
    document.querySelectorAll('.recycle-bin').forEach(b => b.classList.remove('drag-over'));
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
    if (!draggedTrashItem) return;
    isDraggingTrash = false; 
    checkDropLogic(draggedTrashItem, this); 
}

// --- 8. Lógica de Drag and Drop (Touch) ---
let trashInitialX = 0, trashInitialY = 0, trashOffsetX = 0, trashOffsetY = 0;

function handleTouchStart(e) {
    e.preventDefault(); 
    draggedTrashItem = this; 
    isDraggingTrash = true;
    let touch = e.touches[0];
    trashInitialX = touch.clientX - trashOffsetX;
    trashInitialY = touch.clientY - trashOffsetY;
    draggedTrashItem.style.opacity = "0.5";
    draggedTrashItem.style.zIndex = "1000"; 
}

// Adiciona os listeners globais de touch (só precisa ser feito uma vez)
document.addEventListener("touchmove", handleTouchMove, { passive: false });
document.addEventListener("touchend", handleTouchEnd, { passive: false });

function handleTouchMove(e) {
    if (!isDraggingTrash || !draggedTrashItem) return;
    e.preventDefault();
    let touch = e.touches[0];
    let currentX = touch.clientX - trashInitialX;
    let currentY = touch.clientY - trashInitialY;
    trashOffsetX = currentX;
    trashOffsetY = currentY;
    draggedTrashItem.style.transform = `translate(${currentX}px, ${currentY}px)`;
    
    draggedTrashItem.style.visibility = 'hidden';
    let elementOver = document.elementFromPoint(touch.clientX, touch.clientY);
    draggedTrashItem.style.visibility = 'visible';
    
    document.querySelectorAll('.recycle-bin').forEach(b => b.classList.remove('drag-over'));
    
    const binOver = elementOver ? elementOver.closest('.recycle-bin') : null;
    if (binOver) {
        binOver.classList.add("drag-over");
    }
}

function handleTouchEnd(e) {
    if (!isDraggingTrash || !draggedTrashItem) return;
    let touch = e.changedTouches[0];
    
    draggedTrashItem.style.visibility = 'hidden';
    let elementOver = document.elementFromPoint(touch.clientX, touch.clientY);
    draggedTrashItem.style.visibility = 'visible';
    
    const currentDraggedItem = draggedTrashItem;
    draggedTrashItem = null;
    isDraggingTrash = false; 
    trashOffsetX = 0;
    trashOffsetY = 0;
    
    document.querySelectorAll('.recycle-bin').forEach(b => b.classList.remove('drag-over'));
    
    const binOver = elementOver ? elementOver.closest('.recycle-bin') : null;
    if (binOver) {
        checkDropLogic(currentDraggedItem, binOver);
    } else {
        // Soltou fora, retorna ao início
        currentDraggedItem.style.opacity = "1";
        currentDraggedItem.style.transform = "translate(0, 0)";
    }
}

// --- 9. Lógica de Verificação ---
function checkDropLogic(trashElement, binElement) {
    const trashType = trashElement.dataset.type;
    const binType = binElement.dataset.bin;

    if (trashType === binType) {
        handleCorrectDrop(trashElement, binElement);
    } else {
        handleWrongDrop(trashElement, binElement);
    }
}

function handleCorrectDrop(trashElement, binElement) {
    console.log("ACERTOU - RECICLAGEM!");
    
    binElement.classList.add("correct-drop");
    trashElement.style.display = "none"; // Esconde o lixo

    recycleFeedbackText.textContent = "Muito bem!";
    recycleFeedbackText.className = "correct";
    
    // Avança para o próximo lixo
    currentTrashIndex++;
    
    setTimeout(() => {
        loadRecycleItem(currentTrashIndex);
    }, 1500); // Espera 1.5s antes de mostrar o próximo item
}

function handleWrongDrop(trashElement, binElement) {
    console.log("ERROU - RECICLAGEM!");
    
    if (binElement) {
        binElement.classList.add("wrong-drop");
    }
    
    recycleFeedbackText.textContent = "Oops! Tente a lixeira correta.";
    recycleFeedbackText.className = "wrong";
    
    // Anima o lixo de volta ao lugar
    trashElement.style.opacity = "1";
    trashElement.style.transform = "translate(0, 0)";
    
    setTimeout(() => {
        if (binElement) {
            binElement.classList.remove("wrong-drop");
        }
        recycleFeedbackText.textContent = "";
        recycleFeedbackText.className = "";
    }, 1000);
}