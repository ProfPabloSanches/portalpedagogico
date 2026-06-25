const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Dicionário nativo para os caracteres matemáticos de potência
const superscripts = {
    '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
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
        const num = Math.floor(Math.random() * 4) + 1; // números pequenos (1 a 4)
        
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
    
    // --- MODO AVANÇADO: Hierarquia Perfeita e Simulação Real de Sinais ---
    if (difficulty === 'avancado') {
        // 1. Primeiro bloco de parênteses: Potenciação e Subtração
        const exp = Math.floor(Math.random() * 2) + 2; // Expoente 2 ou 3
        const base = 2; 
        const valorPotencia = Math.pow(base, exp);
        const expoenteMatematico = superscripts[exp.toString()];
        const subP1 = Math.floor(Math.random() * 2) + 1;
        
        const stringP1 = `( ${base}${expoenteMatematico} - ${subP1} )`;
        const valorP1 = valorPotencia - subP1;

        // 2. Segundo bloco de parênteses: Divisão exata e Soma
        const divDenom = Math.floor(Math.random() * 2) + 2; // 2 ou 3
        const divResult = Math.floor(Math.random() * 3) + 2; // 2 a 4
        const divNum = divResult * divDenom;
        const somaP2 = Math.floor(Math.random() * 3) + 1;
        
        const stringP2 = `( ${divNum} ÷ ${divDenom} + ${somaP2} )`;
        const valorP2 = divResult + somaP2;

        // 3. Montando o Colchete: Junta os dois parênteses
        const usarMult = Math.random() > 0.5;
        let stringColchetes = "";
        let valorColchetes = 0;

        if (usarMult && valorP1 * valorP2 < 40) {
            stringColchetes = `[ ${stringP1} × ${stringP2} ]`;
            valorColchetes = valorP1 * valorP2;
        } else {
            stringColchetes = `[ ${stringP1} + ${stringP2} ]`;
            valorColchetes = valorP1 + valorP2;
        }

        // Extensão de 1 a 3 operações APÓS fechar os Colchetes (Ainda dentro das Chaves)
        const qtdOpsPosColchete = Math.floor(Math.random() * 3) + 1;
        const extraColchete = generateExtraOperations(valorColchetes, qtdOpsPosColchete);
        
        const stringInternaChaves = `${stringColchetes}${extraColchete.text}`;
        let valorInternoChaves = extraColchete.val;

        // 4. Montando as Chaves: Raiz Quadrada + Bloco Interno
        const raizBase = Math.floor(Math.random() * 3) + 2; // 2 a 4
        const raizRadicando = raizBase * raizBase;
        
        let stringChaves = `{ √${raizRadicando} + ${stringInternaChaves} }`;
        let valorChaves = raizBase + valorInternoChaves;

        // Extensão de 1 a 3 operações APÓS fechar as Chaves
        const qtdOpsPosChaves = Math.floor(Math.random() * 3) + 1;
        const extraChaves = generateExtraOperations(0, qtdOpsPosChaves); 
        
        // --- BLINDAGEM MATEMÁTICA DEFINITIVA ---
        // Vamos descobrir qual é o valor exato resultante de resolver da esquerda para a direita após abrir a expressão.
        // Simulamos a cauda a partir do valor acumulado das chaves.
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
        
        let valorInicial = y + valorChaves;
        
        // Se o valor inicial for menor ou igual a zero (o que quebraria a lógica), 
        // simplificamos removendo a cauda externa para garantir integridade.
        if (valorInicial <= 0) {
            valorInicial = targetResult + valorChaves;
            return `${valorInicial} - ${stringChaves}`;
        }

        return `${valorInicial} - ${stringChaves}${extraChaves.text}`;
    }

    // --- MODOS LINEARES: Fácil, Médio e Difícil ---
    let operacoesDisponiveis = [];
    if (difficulty === 'facil') {
        operacoesDisponiveis = ['SOMA', 'SUB'];
    } else if (difficulty === 'medio') {
        operacoesDisponiveis = ['SOMA', 'SUB', 'MULT', 'DIV'];
    } else { 
        operacoesDisponiveis = ['RAIZ', 'POT', 'MULT', 'SOMA', 'SUB', 'DIV'];
    }
    
    const totalOps = Math.floor(Math.random() * 3) + 3; 
    let currentVal = Math.floor(Math.random() * 5) + 3; 
    let tokens = [`${currentVal}`];

    for (let i = 0; i < totalOps - 1; i++) {
        const op = operacoesDisponiveis[Math.floor(Math.random() * operacoesDisponiveis.length)];

        if (op === 'RAIZ') {
            const base = Math.floor(Math.random() * 3) + 2; 
            tokens.push(`+`);
            tokens.push(`√${base * base}`);
            currentVal += base;
        } 
        else if (op === 'POT') {
            const exp = Math.floor(Math.random() * 4) + 2; 
            let base = 2;
            if (exp === 2) base = Math.floor(Math.random() * 3) + 2;
            
            const resultadoPotencia = Math.pow(base, exp);
            const expoenteMatematico = superscripts[exp.toString()];

            tokens.push(`+`);
            tokens.push(`${base}${expoenteMatematico}`);
            currentVal += resultadoPotencia;
        } 
        else if (op === 'MULT' && currentVal < 20) {
            const m = Math.floor(Math.random() * 2) + 2; 
            tokens.push(`×`);
            tokens.push(`${m}`);
            currentVal *= m;
        } 
        else if (op === 'DIV') {
            let divs = [];
            for (let d = 2; d <= 6; d++) {
                if (currentVal % d === 0) divs.push(d);
            }
            if (divs.length > 0) {
                const d = divs[Math.floor(Math.random() * divs.length)];
                tokens.push('÷');
                tokens.push(`${d}`);
                currentVal = Math.floor(currentVal / d);
            } else {
                const s = Math.floor(Math.random() * 4) + 2;
                tokens.push('+');
                tokens.push(`${s}`);
                currentVal += s;
            }
        }
        else if (op === 'SUB' && currentVal > 15) {
            const s = Math.floor(Math.random() * 5) + 2;
            tokens.push(`-`);
            tokens.push(`${s}`);
            currentVal -= s;
        } 
        else {
            const s = Math.floor(Math.random() * 5) + 2;
            tokens.push(`+`);
            tokens.push(`${s}`);
            currentVal += s;
        }
    }

    const ajuste = targetResult - currentVal;
    if (ajuste >= 0) {
        tokens.push(`+`);
        tokens.push(`${ajuste}`);
    } else {
        tokens.push(`-`);
        tokens.push(`${Math.abs(ajuste)}`);
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
