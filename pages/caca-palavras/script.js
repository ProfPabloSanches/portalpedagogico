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

function generateMathExpression(targetResult) {
    const difficultySelect = document.getElementById('difficulty');
    const difficulty = difficultySelect ? difficultySelect.value : 'medio';
    
    let operacoesDisponiveis = [];
    if (difficulty === 'facil') {
        operacoesDisponiveis = ['SOMA', 'SUB'];
    } else if (difficulty === 'medio') {
        operacoesDisponiveis = ['SOMA', 'SUB', 'MULT', 'DIV'];
    } else { 
        operacoesDisponiveis = ['RAIZ', 'POT', 'MULT', 'SOMA', 'SUB', 'DIV'];
    }
    
    const totalOps = Math.floor(Math.random() * 4) + 4; 
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
            const exp = Math.floor(Math.random() * 8) + 2; 
            let base = 2;
            if (exp === 2) {
                base = Math.floor(Math.random() * 4) + 2; 
            } else if (exp === 3) {
                base = Math.floor(Math.random() * 2) + 2; 
            } else {
                base = 2; 
            }

            const resultadoPotencia = Math.pow(base, exp);
            const expoenteMatematico = superscripts[exp.toString()];

            tokens.push(`+`);
            tokens.push(`${base}${expoenteMatematico}`);
            currentVal += resultadoPotencia;
        } 
        else if (op === 'MULT' && currentVal < 25) {
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
        else if (op === 'SUB' && currentVal > 10) {
            const s = Math.floor(Math.random() * 5) + 2;
            tokens.push(`-`);
            tokens.push(`${s}`);
            currentVal -= s;
        } 
        else {
            const s = Math.floor(Math.random() * 6) + 2;
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

    if (difficulty === 'avancado' && tokens.length >= 7) {
        let v1 = tokens[0];
        let op1 = tokens[1];
        let v2 = tokens[2];
        let op2 = tokens[3];
        let v3 = tokens[4];
        let op3 = tokens[5];
        let v4 = tokens[6];
        
        let blocoAgrupado = `${v1} ${op1} [ ${v2} ${op2} ( ${v3} ${op3} ${v4} ) ]`;
        
        let restoTokens = tokens.slice(7);
        if (restoTokens.length > 0) {
            return blocoAgrupado + " " + restoTokens.join(' ');
        }
        return blocoAgrupado;
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
