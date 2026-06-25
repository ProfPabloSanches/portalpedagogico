const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function toggleHelpPopup() {
    const popup = document.getElementById('helpPopup');
    if (popup) {
        const isVisible = popup.style.display === 'block';
        popup.style.display = isVisible ? 'none' : 'block';
    }
}

document.addEventListener('click', function(event) {
    const container = document.querySelector('.help-popup-container');
    const popup = document.getElementById('helpPopup');
    if (container && popup && !container.contains(event.target)) {
        popup.style.display = 'none';
    }
});

// Gerador matemático híbrido calibrado para dois níveis: Primeiro Grau e Segundo Grau
function generateMathExpression(targetResult) {
    const difficultySelect = document.getElementById('difficulty');
    // Padrão para 'Primeiro Grau' caso o seletor não seja encontrado
    const nivel = difficultySelect ? difficultySelect.value : 'Primeiro Grau';
    
    // =================================================================
    // NÍVEL: Primeiro Grau -> Encontrar a incógnita X
    // =================================================================
    if (nivel === 'Primeiro Grau') {
        // A letra alvo (1-26) será a própria raiz da equação (o valor de x)
        let x = targetResult; 
        
        // Sorteia um multiplicador 'a' para o x (Ex: 2x, 3x, 4x, 5x)
        let a = Math.floor(Math.random() * 4) + 2;
        let ax = a * x;
        
        // Sorteia um termo independente 'b' para somar ou subtrair
        let b = Math.floor(Math.random() * 25) + 3;
        let usarSoma = Math.random() > 0.5;
        
        let c; // O resultado do outro lado da igualdade (ax + b = c)
        let signB;
        
        if (usarSoma) {
            c = ax + b;
            signB = `+ ${b}`;
        } else {
            c = ax - b;
            signB = `- ${b}`;
        }
        
        // Retorna a equação estruturada: ax + b = c
        return `${a}x ${signB} = ${c}`;
    }

    // =================================================================
    // NÍVEL: Segundo Grau -> Encontrar o discriminante Delta (Δ)
    // =================================================================
    else {
        // A letra alvo (1-26) será o valor exato do Delta (Δ)
        let delta = targetResult; 
        let a, b, c;
        let encontrado = false;
        let tentativas = 0;

        // Configuração de limites para manter coeficientes desafiadores, mas computáveis
        let maxB = 45;
        let maxA = 6;

        // Loop de Engenharia Reversa para achar coeficientes inteiros perfeitos onde Δ = b² - 4ac
        while (!encontrado && tentativas < 500) {
            tentativas++;
            
            b = Math.floor(Math.random() * (maxB - 5)) + 5;
            a = Math.floor(Math.random() * maxA) + 1;
            
            // Isola o 'c' na fórmula: c = (b² - Δ) / 4a
            let numerador = (b * b) - delta;
            let denominador = 4 * a;
            
            // Se o resto da divisão for 0, encontramos um coeficiente 'c' inteiro exato
            if (numerador % denominador === 0) {
                c = numerador / denominador;
                encontrado = true;
            }
        }

        // Fallback de segurança (Garante b=10, a=2, c=11 => delta=12 se o sorteio falhar)
        if (!encontrado) {
            a = 2; b = 10; c = 11; delta = 12; 
        }

        // Formatação visual da equação: ax² + bx + c = 0
        let signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        let signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
        let termA = a === 1 ? `x²` : `${a}x²`;

        return `${termA} ${signB}x ${signC} = 0`;
    }
}

function buildActivity() {
    const textInput = document.getElementById('userPhrase').value.toUpperCase();
    const cleanText = textInput.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z ]/g, '');

    if (cleanText.trim().length === 0) {
        alert("Por favor, digite uma palavra ou frase contendo letras.");
        return;
    }

    const questionsGrid = document.getElementById('mathQuestions');
    const answerSlots = document.getElementById('answerSlots');
    const nivel = document.getElementById('difficulty').value;

    questionsGrid.innerHTML = '';
    answerSlots.innerHTML = '';

    // Ajusta o texto da dica de acordo com o nível selecionado
    let instrucaoModo = (nivel === 'Primeiro Grau') ? '(Descubra o X)' : '(Calcule o Δ)';

    let questionCount = 1;

    for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];

        if (char === " ") {
            const spaceDiv = document.createElement('div');
            spaceDiv.className = 'slot-space';
            answerSlots.appendChild(spaceDiv);
        } else {
            const charCode = alphabet.indexOf(char) + 1;

            if (charCode > 0) {
                const expression = generateMathExpression(charCode);

                const questionItem = document.createElement('div');
                questionItem.className = 'question-item';

                questionItem.innerHTML = `
                    <div class="question-text" style="font-size: 1.25rem; font-weight: bold;">
                        ${expression} <span style="font-size: 0.85rem; color: #718096; font-weight: normal; margin-left: 8px;">${instrucaoModo}</span>
                    </div>
                    <div class="question-bottom">
                        <div class="question-id">QUESTÃO ${questionCount}</div>
                        <div class="answer-box"></div>
                    </div>
                `;
                questionsGrid.appendChild(questionItem);

                const slotContainer = document.createElement('div');
                slotContainer.className = 'slot-container';

                slotContainer.innerHTML = `
                    <div class="slot-line"></div>
                    <div class="slot-index">${questionCount}</div>
                `;
                answerSlots.appendChild(slotContainer);

                questionCount++;
            }
        }
    }
}

window.onload = buildActivity;
