const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Gerador linear puramente randômico SEM PARÊNTESES (4 a 7 operações)
function generateMathExpression(targetResult) {
    const operacoesDisponiveis = ['RAIZ', 'POT', 'MULT', 'SOMA', 'SUB'];
    
    // Sorteia o número total de operações (entre 4 e 7)
    const totalOps = Math.floor(Math.random() * 4) + 4;
    
    // Começa com um valor base inicial
    let currentVal = Math.floor(Math.random() * 5) + 3; // 3 a 7
    let tokens = [`${currentVal}`];

    // Loop para criar a expressão linearmente (deixa a última para o ajuste final)
    for (let i = 0; i < totalOps - 1; i++) {
        // Embaralha/sorteia uma operação
        const op = operacoesDisponiveis[Math.floor(Math.random() * operacoesDisponiveis.length)];

        if (op === 'RAIZ') {
            const base = Math.floor(Math.random() * 3) + 2; // 2 a 4
            tokens.push(`+`);
            tokens.push(`√${base * base}`);
            currentVal += base;
        } 
        else if (op === 'POT') {
            const base = Math.floor(Math.random() * 2) + 2; // 2 ou 3
            tokens.push(`+`);
            tokens.push(`${base}²`);
            currentVal += (base * base);
        } 
        else if (op === 'MULT' && currentVal < 25) {
            // Como não há parênteses, a multiplicação afeta apenas o último termo gerado.
            // Para manter o controle simples do valor real sem criar árvores complexas,
            // geramos uma multiplicação direta baseada no valor acumulado atual.
            const m = Math.floor(Math.random() * 2) + 2; // 2 ou 3
            tokens.push(`×`);
            tokens.push(`${m}`);
            currentVal *= m;
        } 
        else if (op === 'SUB' && currentVal > 10) {
            const s = Math.floor(Math.random() * 5) + 2;
            tokens.push(`-`);
            tokens.push(`${s}`);
            currentVal -= s;
        } 
        else {
            // Padrão: SOMA
            const s = Math.floor(Math.random() * 6) + 2;
            tokens.push(`+`);
            tokens.push(`${s}`);
            currentVal += s;
        }
    }

    // --- AJUSTE FINAL PARA CRAVAR A LETRA CORRETA ---
    const ajuste = targetResult - currentVal;
    if (ajuste >= 0) {
        tokens.push(`+`);
        tokens.push(`${ajuste}`);
    } else {
        tokens.push(`-`);
        tokens.push(`${Math.abs(ajuste)}`);
    }

    // Retorna todos os elementos juntos separados por espaço, sem nenhum parênteses
    return tokens.join(' ');
}

// Reconstrói a folha de forma totalmente dinâmica mantendo a formatação HTML anti-corte
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
