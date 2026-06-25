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

// Gerador matemático adaptivo
function generateMathExpression(targetResult) {
    const difficultySelect = document.getElementById('difficulty');
    const difficulty = difficultySelect ? difficultySelect.value : 'medio';
    
    // --- MODO AVANÇADO: Contém obrigatoriamente +, -, ×, ÷, √, potências, (), [] e {} ---
    if (difficulty === 'avancado') {
        // 1. Núcleo Interno (Parênteses): Potenciação e Divisão Exata
        // Sorteia expoente de 2 a 9. Para manter o controle pedagógico, base fixa em 2 para expoentes altos.
        const exp = Math.floor(Math.random() * 8) + 2; 
        const base = exp <= 3 ? 3 : 2; 
        const valorPotencia = Math.pow(base, exp);
        const expoenteMatematico = superscripts[exp.toString()];

        // Criamos uma divisão que resulte em um número inteiro simples (ex: 12 ÷ 3 = 4)
        const divIdenom = Math.floor(Math.random() * 3) + 2; // 2 a 4
        const divResult = Math.floor(Math.random() * 3) + 2; // 2 a 4
        const divNum = divResult * divIdenom;

        // Valor dentro dos parênteses: ( Base^Exp - Num ÷ Denom )
        const valorParenteses = valorPotencia - divResult;

        // 2. Nível Intermediário (Colchetes): Adiciona a Raiz Quadrada
        // Sorteia uma raiz exata (√4, √9, √16 ou √25)
        const raizBase = Math.floor(Math.random() * 4) + 2; // 2 a 5
        const raizRadicando = raizBase * raizBase; 
        
        // Bloco dos Colchetes: [ √Radicando + ( Parênteses ) ]
        const valorColchetes = raizBase + valorParenteses;

        // 3. Nível Externo (Chaves): Adiciona a Multiplicação
        const mult = 2; // Multiplicador controlado para o número não estourar
        const valorChaves = mult * valorColchetes;

        // 4. Ajuste Final de Escopo: Garante que a conta bata exatamente na Letra (1 a 26)
        const a = targetResult - valorChaves;
        
        if (a >= 0) {
            return `${a} + { ${mult} × [ √${raizRadicando} + ( ${base}${expoenteMatematico} - ${divNum} ÷ ${divIdenom} ) ] }`;
        } else {
            const valorInicial = targetResult + valorChaves;
            return `${valorInicial} - { ${mult} × [ √${raizRadicando} + ( ${base}${expoenteMatematico} - ${divNum} ÷ ${divIdenom} ) ] }`;
        }
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
