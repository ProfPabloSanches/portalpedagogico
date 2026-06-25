const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Dicionário nativo para os caracteres matemáticos de potência
const superscripts = {
    '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '10': '¹⁰'
};

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

// Auxiliar para gerar operações lineares e retornar o texto e o impacto no valor de forma estrita
function generateExtraOperations(currentValue, count) {
    let text = "";
    let val = currentValue;
    const ops = ['+', '-']; 

    for (let i = 0; i < count; i++) {
        const op = ops[Math.floor(Math.random() * ops.length)];
        // No modo avançado, as operações extras usam números de até 3 algarismos para aumentar o desafio
        const num = Math.floor(Math.random() * 250) + 50; 
        
        text += ` ${op} ${num}`;
        if (op === '+') val += num;
        else val -= num;
    }
    return { text, val };
}

// Gerador matemático adaptivo
function generateMathExpression(targetResult) {
    const difficultySelect = document.getElementById('difficulty');
    const difficulty = difficultySelect ? difficultySelect.value : 'medio';
    
    // =================================================================
    // MODO AVANÇADO: Alta complexidade com números de até 4 algarismos
    // =================================================================
    if (difficulty === 'avancado') {
        // 1. Primeiro bloco de parênteses: Potenciação maior e Subtração substancial
        // Sorteia bases e expoentes que resultem em números de 3 a 4 algarismos (Ex: 5⁴ = 625, 3⁶ = 729, 2⁹ = 512)
        const expOptions = [
            { b: 2, e: 9 },  // 512
            { b: 3, e: 6 },  // 729
            { b: 5, e: 4 },  // 625
            { b: 6, e: 4 },  // 1296
            { b: 7, e: 3 }   // 343
        ];
        const sorteioPot = expOptions[Math.floor(Math.random() * expOptions.length)];
        const valorPotencia = Math.pow(sorteioPot.b, sorteioPot.e);
        const expoenteMatematico = superscripts[sorteioPot.e.toString()];
        const subP1 = Math.floor(Math.random() * 150) + 50; // Subtração de até 3 algarismos
        
        const stringP1 = `( ${sorteioPot.b}${expoenteMatematico} - ${subP1} )`;
        const valorP1 = valorPotencia - subP1;

        // 2. Segundo bloco de parênteses: Divisão exata com números de 3 algarismos e Soma alta
        const divResult = Math.floor(Math.random() * 40) + 20; // Resultado entre 20 e 59
        const divDenom = Math.floor(Math.random() * 12) + 5;   // Denominador entre 5 e 16
        const divNum = divResult * divDenom;                   // Dividendo alcança facilmente 3 algarismos
        const somaP2 = Math.floor(Math.random() * 300) + 100;  // Soma de 3 algarismos
        
        const stringP2 = `( ${divNum} ÷ ${divDenom} + ${somaP2} )`;
        const valorP2 = divResult + somaP2;

        // 3. Montando o Colchete: Multiplicação com multiplicadores maiores ou Soma de grandes blocos
        const usarMult = Math.random() > 0.5;
        let stringColchetes = "";
        let valorColchetes = 0;

        if (usarMult) {
            const multGrande = Math.floor(Math.random() * 4) + 2; // Multiplicador de 2 a 5
            stringColchetes = `[ ${stringP1} × ${multGrande} ]`;
            valorColchetes = valorP1 * multGrande;
        } else {
            stringColchetes = `[ ${stringP1} + ${stringP2} ]`;
            valorColchetes = valorP1 + valorP2;
        }

        // Extensão de 1 a 3 operações APÓS fechar os Colchetes (Dentro das Chaves)
        const qtdOpsPosColchete = Math.floor(Math.random() * 3) + 1;
        const extraColchete = generateExtraOperations(valorColchetes, qtdOpsPosColchete);
        
        const stringInternaChaves = `${stringColchetes}${extraColchete.text}`;
        let valorInternoChaves = extraColchete.val;

        // 4. Montando as Chaves: Raiz Quadrada de quadrados maiores (Ex: √144, √225, √400)
        const raizesGrandes = [12, 13, 14, 15, 20, 25];
        const raizBase = raizesGrandes[Math.floor(Math.random() * raizesGrandes.length)];
        const raizRadicando = raizBase * raizBase;
        
        let stringChaves = `{ √${raizRadicando} + ${stringInternaChaves} }`;
        let valorChaves = raizBase + valorInternoChaves;

        // Extensão de 1 a 3 operações APÓS fechar as Chaves
        const qtdOpsPosChaves = Math.floor(Math.random() * 3) + 1;
        const extraChaves = generateExtraOperations(0, qtdOpsPosChaves); 
        
        // --- BLINDAGEM MATEMÁTICA PARA NÚMEROS GRANDES ---
        let y = targetResult;
        let partesCauda = extraChaves.text.trim().split(/\s+/);
        
        if (partesCauda.length >= 2) {
            for (let i = 0; i < partesCauda.length; i += 2) {
                let op = partesCauda[i];
                let num = parseInt(partesCauda[i+1]);
                if (op === '+') y -= num;
                if (op === '-') y += num;
            }
        }
        
        // O valor inicial absorve o impacto dos milhares, estabilizando a expressão na casa dos 4 algarismos
        let valorInicial = y + valorChaves;
        
        // Fallback de segurança caso os desvios randômicos gerem números negativos
        if (valorInicial <= 0) {
            valorInicial = Math.abs(valorInicial) + targetResult + valorChaves + 1500;
            return `${valorInicial} - ${stringChaves}${extraChaves.text} - ${valorInicial - targetResult - extraChaves.val - valorChaves}`;
        }

        return `${valorInicial} - ${stringChaves}${extraChaves.text}`;
    }

    // =================================================================
    // MODOS LINEARES: FÁCIL, MÉDIO E DIFÍCIL
    // =================================================================
    let operacoesDisponiveis = [];
    if (difficulty === 'facil') {
        operacoesDisponiveis = ['SOMA', 'SUB'];
    } else if (difficulty === 'medio') {
        operacoesDisponiveis = ['SOMA', 'SUB', 'MULT', 'DIV'];
    } else { // 'dificil'
        operacoesDisponiveis = ['RAIZ', 'POT', 'MULT', 'SOMA', 'SUB', 'DIV'];
    }
    
    // Configura tamanho de partida do Modo Difícil modificado
    const totalOps = Math.floor(Math.random() * 2) + 4; // 4 a 5 operações lineares
    
    // Se for o nível difícil, o número inicial já começa alto (3 algarismos)
    let currentVal = difficulty === 'dificil' ? Math.floor(Math.random() * 400) + 200 : Math.floor(Math.random() * 10) + 5;
    let tokens = [`${currentVal}`];

    for (let i = 0; i < totalOps; i++) {
        const op = operacoesDisponiveis[Math.floor(Math.random() * operacoesDisponiveis.length)];

        if (op === 'RAIZ') {
            // No difícil, usamos raízes quadradas maiores (Ex: √144 = 12, √400 = 20, √900 = 30)
            const raizesDificil = [10, 12, 15, 20, 25, 30];
            const base = difficulty === 'dificil' ? raizesDificil[Math.floor(Math.random() * raizesDificil.length)] : Math.floor(Math.random() * 4) + 2;
            tokens.push(`+`);
            tokens.push(`√${base * base}`);
            currentVal += base; 
        } 
        else if (op === 'POT') {
            // No difícil, potências geram números de até 4 algarismos (Ex: 4⁵ = 1024, 6⁴ = 1296, 2¹⁰ = 1024)
            let base = 2, exp = 3;
            if (difficulty === 'dificil') {
                const potOptions = [
                    { b: 2, e: 10 }, { b: 4, e: 5 }, { b: 5, e: 4 }, { b: 6, e: 4 }, { b: 3, e: 7 }
                ];
                const sorteio = potOptions[Math.floor(Math.random() * potOptions.length)];
                base = sorteio.b;
                exp = sorteio.e;
            } else {
                exp = Math.floor(Math.random() * 2) + 2;
                base = exp === 2 ? Math.floor(Math.random() * 3) + 2 : 2;
            }
            
            const resultadoPotencia = Math.pow(base, exp);
            const expoenteMatematico = superscripts[exp.toString()] || `^${exp}`;

            tokens.push(`+`);
            tokens.push(`${base}${expoenteMatematico}`);
            currentVal += resultadoPotencia;
        } 
        else if (op === 'MULT') {
            // Multiplicadores maiores para o modo difícil impulsionarem milhares rápido
            const m = difficulty === 'dificil' ? Math.floor(Math.random() * 4) + 3 : Math.floor(Math.random() * 2) + 2; 
            
            // Permite multiplicar se ainda não tiver estourado 2500 no modo difícil
            const limiteMult = difficulty === 'dificil' ? 2500 : 15;
            if (currentVal < limiteMult) {
                tokens.push(`×`);
                tokens.push(`${m}`);
                currentVal *= m;
            } else {
                const s = Math.floor(Math.random() * 150) + 50;
                tokens.push(`+`);
                tokens.push(`${s}`);
                currentVal += s;
            }
        } 
        else if (op === 'DIV') {
            // Varredura dinâmica para encontrar divisores exatos de números grandes
            let divs = [];
            let maxDiv = difficulty === 'dificil' ? 20 : 8;
            for (let d = 2; d <= maxDiv; d++) {
                if (currentVal % d === 0) divs.push(d);
            }
            if (divs.length > 0) {
                const d = divs[Math.floor(Math.random() * divs.length)];
                tokens.push('÷');
                tokens.push(`${d}`);
                currentVal = currentVal / d;
            } else {
                const s = difficulty === 'dificil' ? Math.floor(Math.random() * 100) + 10 : Math.floor(Math.random() * 4) + 1;
                if (currentVal - s > 0) {
                    tokens.push('-');
                    tokens.push(`${s}`);
                    currentVal -= s;
                }
            }
        }
        else if (op === 'SUB') {
            const s = difficulty === 'dificil' ? Math.floor(Math.random() * 300) + 50 : Math.floor(Math.random() * 6) + 2;
            if (currentVal - s > 10) {
                tokens.push(`-`);
                tokens.push(`${s}`);
                currentVal -= s;
            } else {
                tokens.push(`+`);
                tokens.push(`${s}`);
                currentVal += s;
            }
        } 
        else { // SOMA
            const s = difficulty === 'dificil' ? Math.floor(Math.random() * 400) + 100 : Math.floor(Math.random() * 7) + 2;
            tokens.push(`+`);
            tokens.push(`${s}`);
            currentVal += s;
        }
    }
    
    // Ajuste em engenharia reversa na extrema direita garante o resultado inteiro estável (1-26)
    const ajusteFinal = targetResult - currentVal;
    if (ajusteFinal >= 0) {
        tokens.push(`+`);
        tokens.push(`${ajusteFinal}`);
    } else {
        tokens.push(`-`);
        tokens.push(`${Math.abs(ajusteFinal)}`);
    }

    return tokens.join(' ');
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

    questionsGrid.innerHTML = '';
    answerSlots.innerHTML = '';

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
                    <div class="question-text">${expression}</div>
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
