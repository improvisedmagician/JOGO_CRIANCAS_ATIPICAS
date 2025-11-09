// script.js
// Gerenciador de Navegação (V6 - Adicionado Controle de Volume)

document.addEventListener("DOMContentLoaded", () => {
    
    const screens = document.querySelectorAll(".game-screen");
    const allMenuButtons = document.querySelectorAll(".menu-btn, .btn-voltar");

    // --- INÍCIO DA MODIFICAÇÃO (CONTROLE DE VOLUME) ---
    const volumeWidget = document.getElementById("volume-control-widget");
    const volumeIcon = document.getElementById("volume-icon");
    const volumeSlider = document.getElementById("volume-slider");
    // Pega TODOS os elementos <audio> da página
    const allAudioElements = document.querySelectorAll("audio"); 

    let currentVolume = 1.0;

    // 1. Função para definir o volume de todos os áudios
    function setGlobalVolume(volume) {
        allAudioElements.forEach(audio => {
            audio.volume = volume;
        });
    }

    // 2. Aplica o volume inicial (100%)
    setGlobalVolume(currentVolume);

    // 3. Mostra/Esconde o slider ao clicar no ícone
    volumeIcon.addEventListener("click", () => {
        volumeWidget.classList.toggle("open");
    });

    // 4. Atualiza o volume de tudo quando o slider mudar
    volumeSlider.addEventListener("input", (e) => {
        currentVolume = e.target.value;
        setGlobalVolume(currentVolume);
    
        // Atualiza o ícone (Mudo / Não-Mudo)
        if (currentVolume == 0) {
            volumeIcon.textContent = "🔇";
        } else {
            volumeIcon.textContent = "🔊";
        }
    });
    // --- FIM DA MODIFICAÇÃO (CONTROLE DE VOLUME) ---


    // --- Instância do Jogo da Rua ---
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
        if (screenId !== "nivel-reciclagem" && typeof stopRecyclingGame === 'function') {
            stopRecyclingGame();
        }
        if (screenId !== "nivel-respiracao" && typeof stopZenGame === 'function') {
            stopZenGame();
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
                else if (targetScreen === "nivel-reciclagem" && typeof startRecyclingGame === 'function') {
                    console.log("Iniciando Jogo da Reciclagem - Dificuldade:", difficulty);
                    startRecyclingGame(difficulty);
                }
	            else if (targetScreen === "nivel-respiracao" && typeof startZenGame === 'function') {
                    console.log("Iniciando Jogo da Respiração");
                    startZenGame();
                }
            }
        });
    });

    showScreen("menu-principal");
 });