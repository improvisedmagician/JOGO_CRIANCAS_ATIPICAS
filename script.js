// script.js
// Gerenciador de Navegação do Menu Principal

document.addEventListener("DOMContentLoaded", () => {
    
    const screens = document.querySelectorAll(".game-screen");
    const allMenuButtons = document.querySelectorAll(".menu-btn, .btn-voltar");

    const ruaGameContainer = document.getElementById("container-jogo");
    let ruaGameInstance = null;
    if (ruaGameContainer && typeof MinigogoAtravessarRua === 'function') {
        ruaGameInstance = new MinigogoAtravessarRua(ruaGameContainer);
    } else {
        console.error("Não foi possível instanciar o MinigogoAtravessarRua.");
    }

    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove("active-screen");
        });

        if (screenId !== "nivel-rua" && ruaGameInstance) {
            ruaGameInstance.parar();
        }
        if (screenId !== "nivel-emocoes" && typeof stopEmotionGame === 'function') {
            stopEmotionGame(); 
        }
        if (screenId !== "nivel-sentidos" && typeof stopSensoryGame === 'function') {
            stopSensoryGame();
        }

        const screenToShow = document.getElementById(screenId);
        if (screenToShow) {
            screenToShow.classList.add("active-screen");
        }
    }

    allMenuButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetScreen = button.dataset.target; 
            const difficulty = button.dataset.difficulty; 
            
            if (targetScreen) {
                
                showScreen(targetScreen);
                
                if (targetScreen === "nivel-rua" && ruaGameInstance) {
                    console.log("Iniciando Jogo da Rua - Dificuldade:", difficulty);
                    ruaGameInstance.iniciar(difficulty); 
                } 
                else if (targetScreen === "nivel-emocoes" && typeof startEmotionGame === 'function') {
                    console.log("Iniciando Jogo das Emoções - Dificuldade:", difficulty);
                    startEmotionGame(difficulty);
                }
                else if (targetScreen === "nivel-sentidos" && typeof startSensoryGame === 'function') {
                    console.log("Iniciando Jogo dos Sentidos - Dificuldade:", difficulty);
                    startSensoryGame(difficulty);
                }
            }
        });
    });

    showScreen("menu-principal");
    
});