// script.js
// Gerenciador de Navegação do Menu Principal

// Espera o HTML ser totalmente carregado para rodar
document.addEventListener("DOMContentLoaded", () => {
    
    // Pega todas as "telas" do jogo
    const screens = document.querySelectorAll(".game-screen");
    // Pega TODOS os botões que mudam de tela
    const allMenuButtons = document.querySelectorAll(".menu-btn, .btn-voltar");

    // --- Instanciação dos Jogos ---
    // Passa o container específico do JOGO (#container-jogo) para a classe
    const ruaGameContainer = document.getElementById("container-jogo");
    
    let ruaGameInstance = null;
    if (ruaGameContainer && typeof MinigogoAtravessarRua === 'function') {
        ruaGameInstance = new MinigogoAtravessarRua(ruaGameContainer);
    } else {
        console.error("Não foi possível instanciar o MinigogoAtravessarRua. Verifique o ID 'container-jogo' e a classe.");
    }

    /**
     * Função principal para mostrar uma tela específica e esconder as outras.
     * @param {string} screenId - O ID da <section> que deve ser mostrada (ex: "menu-principal")
     */
    function showScreen(screenId) {
        
        // 1. Esconde TODAS as telas
        screens.forEach(screen => {
            screen.classList.remove("active-screen");
        });

        // --- INÍCIO DA CORREÇÃO DE LÓGICA ---
        // 2. PARA (STOP) os jogos que NÃO SÃO a tela de destino
        
        // Para Jogo da Rua (método da classe)
        if (screenId !== "nivel-rua" && ruaGameInstance && typeof ruaGameInstance.parar === 'function') {
            ruaGameInstance.parar();
        }
        // Para Jogo Emoções (função global)
        if (screenId !== "nivel-emocoes" && typeof stopEmotionGame === 'function') {
            stopEmotionGame(); 
        }
        // Para Jogo Sentidos (função global)
        if (screenId !== "nivel-sentidos" && typeof stopSensoryGame === 'function') {
            stopSensoryGame();
        }
        // --- FIM DA CORREÇÃO DE LÓGICA ---

        // 3. Mostra a tela desejada
        const screenToShow = document.getElementById(screenId);
        
        if (screenToShow) {
            screenToShow.classList.add("active-screen");

            // 4. INICIA (START) o jogo correspondente (EXCETO o da rua)
            // (O jogo da rua será iniciado no 'click listener'
            // para garantir que a dificuldade seja passada)

            if (screenId === "nivel-emocoes") {
                if (typeof startEmotionGame === 'function') {
                    startEmotionGame();
                }
            } 
            else if (screenId === "nivel-sentidos") {
                if (typeof startSensoryGame === 'function') {
                    startSensoryGame();
                }
            } 
        }
    }

    // Adiciona o "ouvinte" de clique para todos os botões de navegação
    allMenuButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Pega o valor do atributo 'data-target' (ex: "menu-principal")
            const targetScreen = button.dataset.target; 
            
            if (targetScreen) {
                
                // --- CORREÇÃO DE ORDEM ---
                
                // 1. MOSTRA A TELA (e para os jogos antigos)
                showScreen(targetScreen);
                
                // 2. INICIA o Jogo da Rua (se for o alvo)
                if (targetScreen === "nivel-rua") {
                    const difficulty = button.dataset.difficulty;
                    
                    if (ruaGameInstance && typeof ruaGameInstance.iniciar === 'function') {
                        console.log("Iniciando Jogo da Rua - Dificuldade:", difficulty);
                        ruaGameInstance.iniciar(difficulty); 
                    } else {
                        console.warn("Instância 'ruaGameInstance' ou método 'iniciar' não encontrados.");
                    }
                }
                // --- Fim da Correção ---
            }
        });
    });

    // Garante que o menu principal seja a primeira tela visível ao carregar
    showScreen("menu-principal");
    
});