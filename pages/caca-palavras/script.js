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
    // MODO AVANÇADO: Alta complexidade com chaves, colchetes e parênteses
    // =================================================================
    if (difficulty === 'avancado') {
        const expOptions = [
            { b: 2, e: 9 }, { b: 3, e: 6 }, { b: 5, e: 4 }, { b: 6, e: 4 }, { b: 7, e: 3 }
        ];
        const sorteioPot = expOptions[Math.floor(Math.random() * expOptions.length)];
        const valorPotencia = Math.pow(sorteioPot.b, sorteioPot.e);
        const expoenteMatematico = superscripts[sorteioPot.e.toString()];
        const subP1 = Math.floor(Math.random() * 150) + 50; 
        
        const stringP1 = `( ${sorteioPot.b}${expoenteMatematico} - ${subP1} )`;
        const valorP1 = valorPotencia - subP1;

        const divResult = Math.floor(Math.random() * 40) + 20; 
        const divDenom = Math.floor(Math.random() * 12) + 5;   
        const divNum = divResult * divDenom;                   
        const somaP2 = Math.floor(Math.random() * 300) + 100;  
        
        const stringP2 = `( ${divNum} ÷ ${divDenom} + ${somaP2} )`;
        const valorP2 = divResult + somaP2;

        const usarMult = Math.random() > 0.5;
        let stringColchetes = "";
        let valorColchetes = 0;

        if (usarMult) {
            const multGrande = Math.floor(Math.random() * 4) + 2; 
            stringColchetes = `[ ${stringP1} × ${multGrande} ]`;
            valorColchetes = valorP1 * multGrande;
        } else {
            stringColchetes = `[ ${stringP1} + ${stringP2} ]`;
            valorColchetes = valorP1 + valorP2;
        }

        const qtdOpsPosColchete = Math.floor(Math.random() * 3) + 1;
        const extraColchete = generateExtraOperations(valorColchetes, qtdOpsPosColchete);
        
        const stringInternaChaves = `${stringColchetes}${extraColchete.text}`;
        let valorInternoChaves = extraColchete.val;

        const raizesGrandes = [12, 13, 14, 15, 20, 25];
        const raizBase = raizesGrandes[Math.floor(Math.random() * raizesGrandes.length)];
        const raizRadicando = raizBase * raizBase;
        
        let stringChaves = `{ √${raizRadicando} + ${stringInternaChaves} }`;
        let valorChaves = raizBase + valorInternoChaves;

        const qtdOpsPosChaves = Math.floor(Math.random() * 3) + 1;
        const extraChaves = generateExtraOperations(0, qtdOpsPosChaves); 
        
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
        
        if (valorInicial <= 0) {
            valorInicial = Math.abs(valorInicial) + targetResult + valorChaves + 1500;
            return `${valorInicial} - ${stringChaves}${extraChaves.text} - ${valorInicial - targetResult - extraChaves.val - valorChaves}`;
        }

        return `${valorInicial} - ${stringChaves}${extraChaves.text}`;
    }

    // =================================================================
    // MODO DIFÍCIL REVISADO: Linear, sem agrupamentos, com Blindagem total
    // =================================================================
    if (difficulty === 'dificil') {
        // Criamos uma cauda de operações complexas de alta precedência primeiro
        let tokensCauda = [];
        let valorCauda = 0;

        // 1. Sorteamos uma Potência pesada de até 4 algarismos
        const potOptions = [
            { b: 2, e: 10 }, { b: 4, e: 5 }, { b: 5, e: 4 }, { b: 6, e: 4 }, { b: 3, e: 7 }
        ];
        const sorteioPot = potOptions[Math.floor(Math.random() * potOptions.length)];
        const valorPotencia = Math.pow(sorteioPot.b, sorteioPot.e);
        const expoenteMatematico = superscripts[sorteioPot.e.toString()];
        
        tokensCauda.push(`+ ${sorteioPot.b}${expoenteMatematico}`);
        valorCauda += valorPotencia;

        // 2. Adicionamos uma Raiz Quadrada grande
        const raizesDificil = [12, 15, 20, 25, 30];
        const raizBase = raizesDificil[Math.floor(Math.random() * raizesDificil.length)];
        
        tokensCauda.push(`+ √${raizBase * raizBase}`);
        valorCauda += raizBase;

        // 3. Adicionamos uma multiplicação ou bloco controlado de soma/subtração de 3 dígitos
        if (Math.random() > 0.5) {
            const multGrande = Math.floor(Math.random() * 3) + 2; // x2, x3 ou x4
            // Para não quebrar a ordem linear, multiplicamos o termo anterior (a raiz)
            // Transformamos o token da raiz em uma multiplicação conjunta
            tokensCauda.pop();
            tokensCauda.push(`+ √${raizBase * raizBase} × ${multGrande}`);
            valorCauda += (raizBase * multGrande) - raizBase; // ajusta o valor acumulado da cauda
        } else {
            const s = Math.floor(Math.random() * 300) + 100;
            tokensCauda.push(`- ${s}`);
            valorCauda -= s;
        }

        // 4. Adicionamos mais uma operação linear simples de 3 algarismos no final
        const sFinal = Math.floor(Math.random() * 200) + 50;
        if (Math.random() > 0.5) {
            tokensCauda.push(`+ ${sFinal}`);
            valorCauda += sFinal;
        } else {
            tokensCauda.push(`- ${sFinal}`);
            valorCauda -= sFinal;
        }

        // --- ENGENHARIA REVERSA BLINDADA PARA O MODO DIFÍCIL ---
        // Expressão gerada: ValorInicial [Tokens da Cauda] = LetraAlvo
        // Exemplo: ValorInicial + 1024 + 15 - 100 = 4
        // ValorInicial + valorCauda = targetResult  =>  ValorInicial = targetResult - valorCauda
        // Se der negativo, invertemos o sinal do bloco da cauda usando uma estrutura de subtração:
        // ValorInicial - (Tudo que foi calculado na cauda) = LetraAlvo => ValorInicial = targetResult + valorCauda
        
        let stringCorpoCauda = tokensCauda.join(' ');
        let valorInicial = targetResult - valorCauda;

        if (valorInicial > 0) {
            return `${valorInicial} ${stringCorpoCauda}`;
        } else {
            // Se o valor inicial ia dar negativo, nós transformamos a cauda inteira em um bloco subtraído
            // Para manter a linearidade sem parênteses, trocamos os sinais internos da string manualmente!
            let tokensInvertidos = tokensCauda.map(token => {
                if (token.startsWith('+')) return token.replace('+', '-');
                if (token.startsWith('-')) return token.replace('-', '+');
                return token;
            });
            valorInicial = targetResult + valorCauda;
            return `${valorInicial} ${tokensInvertidos.join(' ')}`;
        }
    }

    // =================================================================
    // MODOS LINEARES TRADICIONAIS: FÁCIL E MÉDIO
    // =================================================================
    let operacoesDisponiveis = difficulty === 'facil' ? ['SOMA', 'SUB'] : ['SOMA', 'SUB', 'MULT', 'DIV'];
    const totalOps = Math.floor(Math.random() * 2) + 3; 
    let currentVal = Math.floor(Math.random() * 10) + 5; 
    let tokens = [`${currentVal}`];

    for (let i = 0; i < totalOps; i++) {
        const op = operacoesDisponiveis[Math.floor(Math.random() * operacoesDisponiveis.length)];

        if (op === 'MULT') {
            const m = Math.floor(Math.random() * 2) + 2; 
            if (currentVal < 15) {
                tokens.push(`×`);
                tokens.push(`${m}`);
                currentVal *= m;
            } else {
                const s = Math.floor(Math.random() * 5) + 2;
                tokens.push(`+`);
                tokens.push(`${s}`);
                currentVal += s;
            }
        } 
        else if (op === 'DIV') {
            let divs = [];
            for (let d = 2; d <= 8; d++) {
                if (currentVal % d === 0) divs.push(d);
            }
            if (divs.length > 0) {
                const d = divs[Math.floor(Math.random() * divs.length)];
                tokens.push('÷');
                tokens.push(`${d}`);
                currentVal = currentVal / d;
            } else {
                const s = Math.floor(Math.random() * 4) + 1;
                if (currentVal - s > 0) {
                    tokens.push('-');
                    tokens.push(`${s}`);
                    currentVal -= s;
                }
            }
        }
        else if (op === 'SUB') {
            const s = Math.floor(Math.random() * 6) + 2;
            if (currentVal - s > 2) {
                tokens.push(`-`);
                tokens.push(`${s}`);
                currentVal -= s;
            } else {
                tokens.push(`+`);
                tokens.push(`${s}`);
                currentVal += s;
            }
        } 
        else { 
            const s = Math.floor(Math.random() * 7) + 2;
            tokens.push(`+`);
            tokens.push(`${s}`);
            currentVal += s;
        }
    }
    
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
