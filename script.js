// script.js
// Gerenciador de Navegação do Menu Principal (V3 - Dificuldade Unificada)

document.addEventListener("DOMContentLoaded", () => {
    
    const screens = document.querySelectorAll(".game-screen");
    const allMenuButtons = document.querySelectorAll(".menu-btn, .btn-voltar");

    // --- Instância do Jogo da Rua ---
    const ruaGameContainer = document.getElementById("container-jogo");
    let ruaGameInstance = null;
    if (ruaGameContainer && typeof MinigogoAtravessarRua === 'function') {
        ruaGameInstance = new MinigogoAtravessarRua(ruaGameContainer);
    } else {
        console.error("Não foi possível instanciar o MinigogoAtravessarRua.");
    }

    /**
     * Mostra uma tela e PARA todos os jogos que não sejam o alvo.
     */
    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove("active-screen");
        });

        // --- Parar Jogos ---
        if (screenId !== "nivel-rua" && ruaGameInstance) {
            ruaGameInstance.parar();
        }
        if (screenId !== "nivel-emocoes" && typeof stopEmotionGame === 'function') {
            stopEmotionGame(); 
        }
        if (screenId !== "nivel-sentidos" && typeof stopSensoryGame === 'function') {
            stopSensoryGame();
        }
        // --- Fim Parar Jogos ---

        const screenToShow = document.getElementById(screenId);
        if (screenToShow) {
            screenToShow.classList.add("active-screen");
        }
    }

    // --- Gerenciador de Cliques (MODIFICADO) ---
    allMenuButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetScreen = button.dataset.target; 
            // Pega a dificuldade (pode ser undefined se for btn-voltar)
            const difficulty = button.dataset.difficulty; 
            
            if (targetScreen) {
                
                // 1. Troca a tela (e para os jogos antigos)
                showScreen(targetScreen);
                
                // 2. INICIA o jogo correto com a dificuldade
                if (targetScreen === "nivel-rua" && ruaGameInstance) {
                    console.log("Iniciando Jogo da Rua - Dificuldade:", difficulty);
                    ruaGameInstance.iniciar(difficulty); 
                } 
                // --- ADICIONADO NÍVEL 2 ---
                else if (targetScreen === "nivel-emocoes" && typeof startEmotionGame === 'function') {
                    console.log("Iniciando Jogo das Emoções - Dificuldade:", difficulty);
                    startEmotionGame(difficulty);
                }
                // --- ADICIONADO NÍVEL 3 ---
                else if (targetScreen === "nivel-sentidos" && typeof startSensoryGame === 'function') {
                    console.log("Iniciando Jogo dos Sentidos - Dificuldade:", difficulty);
                    startSensoryGame(difficulty);
                }
            }
        });
    });

    // Inicia o menu principal
    showScreen("menu-principal");
    
});