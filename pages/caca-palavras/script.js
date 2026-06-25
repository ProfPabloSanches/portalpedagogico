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

// Auxiliar para gerar operações lineares controladas dentro de blocos isolados (Avançado)
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

// Gerador matemático adaptivo e totalmente debugado
function generateMathExpression(targetResult) {
    const difficultySelect = document.getElementById('difficulty');
    const difficulty = difficultySelect ? difficultySelect.value : 'medio';
    
    // =================================================================
    // 1. MODO AVANÇADO: Alta complexidade (Chaves, colchetes, parênteses e milhares)
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
    // 2. MODO DIFÍCIL: Linear, Alta Precedência Blindada (Até 4 algarismos)
    // =================================================================
    if (difficulty === 'dificil') {
        let tokensCauda = [];
        let valorCauda = 0;

        // Bloco 1: Potência acoplada diretamente a uma multiplicação
        const potOptions = [
            { b: 2, e: 10 }, { b: 4, e: 5 }, { b: 5, e: 4 }, { b: 6, e: 4 }, { b: 3, e: 7 }
        ];
        const sorteioPot = potOptions[Math.floor(Math.random() * potOptions.length)];
        const valorPotencia = Math.pow(sorteioPot.b, sorteioPot.e);
        const expoenteMatematico = superscripts[sorteioPot.e.toString()];
        const multGrande = Math.floor(Math.random() * 3) + 2; 

        tokensCauda.push(`+ ${sorteioPot.b}${expoenteMatematico} × ${multGrande}`);
        valorCauda += (valorPotencia * multGrande);

        // Bloco 2: Raiz Quadrada isolada
        const raizesDificil = [12, 15, 20, 25, 30];
        const raizBase = raizesDificil[Math.floor(Math.random() * raizesDificil.length)];
        tokensCauda.push(`+ √${raizBase * raizBase}`);
        valorCauda += raizBase;

        // Bloco 3: Termos de ajuste lineares pesados
        const s1 = Math.floor(Math.random() * 300) + 100;
        tokensCauda.push(`- ${s1}`);
        valorCauda -= s1;

        const s2 = Math.floor(Math.random() * 200) + 50;
        tokensCauda.push(`+ ${s2}`);
        valorCauda += s2;

        // Engenharia Reversa Injetável na Extrema Esquerda
        let valorInicial = targetResult - valorCauda;

        if (valorInicial > 0) {
            return `${valorInicial} ${tokensCauda.join(' ')}`;
        } else {
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
    // 3. MODOS LINEARES: FÁCIL E MÉDIO (Com Multiplicação/Divisão no Médio)
    // =================================================================
    let tokens = [];
    let acumulado = 0;

    if (difficulty === 'medio') {
        const usarOp = Math.random() > 0.5 ? 'MULT' : 'DIV';

        if (usarOp === 'MULT') {
            const n1 = Math.floor(Math.random() * 8) + 2; 
            const n2 = Math.floor(Math.random() * 5) + 2; 
            tokens.push(`( ${n1} × ${n2} )`);
            acumulado = n1 * n2;
        } else {
            const divisor = Math.floor(Math.random() * 6) + 2;  
            const quociente = Math.floor(Math.random() * 8) + 2; 
            const dividendo = divisor * quociente;
            tokens.push(`( ${dividendo} ÷ ${divisor} )`);
            acumulado = quociente;
        }

        const totalOpsExtra = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < totalOpsExtra; i++) {
            const op = Math.random() > 0.5 ? '+' : '-';
            const num = Math.floor(Math.random() * 20) + 2;

            if (Math.random() > 0.5) {
                tokens.push(`${op}`);
                tokens.push(`${num}`);
                if (op === '+') acumulado += num;
                else acumulado -= num;
            } else {
                tokens.unshift(`${num}`);
                tokens.splice(1, 0, `${op}`);
                if (op === '+') acumulado += num;
                else acumulado = num - acumulado; 
            }
        }
    } else {
        // MODO FÁCIL: Apenas somas e subtrações puras
        const nInicial = Math.floor(Math.random() * 15) + 5;
        tokens.push(`${nInicial}`);
        acumulado = nInicial;

        const totalOpsFacil = 3;
        for (let i = 0; i < totalOpsFacil; i++) {
            const op = Math.random() > 0.5 ? '+' : '-';
            const num = Math.floor(Math.random() * 10) + 1;
            
            tokens.push(`${op}`);
            tokens.push(`${num}`);
            if (op === '+') acumulado += num;
            else acumulado -= num;
        }
    }

    // Ajuste Final Estrito na Ponta Direita
    const ajusteFinal = targetResult - acumulado;
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
