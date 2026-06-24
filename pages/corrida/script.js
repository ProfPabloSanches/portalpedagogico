let posicoesCaminhoAtual = [];
let totalCasasAtual = 0;

function gerarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcularCorCasa(index, total, modo) {
    if (modo === "pb") return "#ffffff";
    
    // Modificação Modo RGB: Cores alternadas e puras sem gradiente
    if (modo === "rgb") {
        const resto = index % 3;
        if (resto === 0) return "#ff0000"; // Vermelho
        if (resto === 1) return "#00ff00"; // Verde
        return "#0000ff";                  // Azul
    }
    
    // Mantém o gradiente padrão para o modo arco-íris
    const hue = (index / (total - 1)) * 300;
    return `hsl(${hue}, 85%, 45%)`;
}

function gerarCaminhoExtremidades(totalCasas) {
    const GRID_TAMANHO = 10;
    let caminho = [];
    let sucesso = false;
    
    while (!sucesso) {
        caminho = [];
        const visitados = Array(GRID_TAMANHO + 1).fill(0).map(() => Array(GRID_TAMANHO + 1).fill(false));
        
        let atual = { linha: gerarNumeroAleatorio(1, GRID_TAMANHO), coluna: 1 };
        caminho.push({ ...atual });
        visitados[atual.linha][atual.coluna] = true;
        
        let forcaSaida = 0;

        while (caminho.length < totalCasas && forcaSaida < 300) {
            forcaSaida++;
            const movimentos = [
                { l: -1, c: 0 }, { l: 1, c: 0 }, { l: 0, c: -1 }, { l: 0, c: 1 }
            ];
            
            const opcoesValidas = movimentos.filter(m => {
                const novaL = atual.linha + m.l;
                const novaC = atual.coluna + m.c;
                return (novaL >= 1 && novaL <= GRID_TAMANHO && novaC >= 1 && novaC <= GRID_TAMANHO && !visitados[novaL][novaC]);
            });
            
            if (opcoesValidas.length === 0) break;
            
            const escolha = opcoesValidas[Math.floor(Math.random() * opcoesValidas.length)];
            atual.linha += escolha.l;
            atual.coluna += escolha.c;
            
            caminho.push({ ...atual });
            visitados[atual.linha][atual.coluna] = true;
        }

        if (caminho.length === totalCasas && caminho[caminho.length - 1].coluna === GRID_TAMANHO) {
            sucesso = true;
        }
    }
    return caminho;
}

function obterSetaDirecao(atual, proxima) {
    if (!proxima) return "";
    if (proxima.linha < atual.linha) return "↑";
    if (proxima.linha > atual.linha) return "↓";
    if (proxima.coluna < atual.coluna) return "←";
    if (proxima.coluna > atual.coluna) return "→";
    return "";
}

function renderizarTabuleiro() {
    const tabuleiro = document.getElementById('tabuleiro');
    const modoSelecionado = document.getElementById('selectModo').value;
    
    tabuleiro.innerHTML = '';

    posicoesCaminhoAtual.forEach((pos, index) => {
        const casa = document.createElement('div');
        casa.classList.add('cell');

        casa.style.gridRow = pos.linha;
        casa.style.gridColumn = pos.coluna;
        
        const corDeFundo = calcularCorCasa(index, totalCasasAtual, modoSelecionado);
        casa.style.backgroundColor = corDeFundo;

        if (modoSelecionado === "pb") casa.classList.add('white-mode');

        const proximaPosicao = posicoesCaminhoAtual[index + 1];
        const caractereSeta = obterSetaDirecao(pos, proximaPosicao);

        if (index === 0) {
            casa.innerHTML = `<span>Início</span><span class="arrow">${caractereSeta}</span>`;
            casa.classList.add('special');
            if (modoSelecionado !== "pb") casa.style.backgroundColor = "#e74c3c"; 
        } else if (index === totalCasasAtual - 1) {
            casa.innerHTML = `<span>Chegada</span>`;
            casa.classList.add('special');
            // Permite que o fundo da chegada mude apenas se for o modo arcoíris
            if (modoSelecionado !== "pb" && modoSelecionado === "arcoiris") casa.style.backgroundColor = "#9b59b6";
        } else {
            if (!pos.numeroMatematico) pos.numeroMatematico = gerarNumeroAleatorio(10, 99);
            casa.innerHTML = `<span>${pos.numeroMatematico}</span><span class="arrow">${caractereSeta}</span>`;
        }

        casa.addEventListener('click', function() {
            this.classList.toggle('active');
        });

        tabuleiro.appendChild(casa);
    });
}

function fluxoNovoTabuleiro() {
    const contador = document.getElementById('contadorCasas');
    totalCasasAtual = gerarNumeroAleatorio(25, 40);
    contador.innerText = `Casas nesta rodada: ${totalCasasAtual}`;
    
    posicoesCaminhoAtual = gerarCaminhoExtremidades(totalCasasAtual);
    renderizarTabuleiro();
}

window.addEventListener('DOMContentLoaded', () => {
    // Redirecionamento configurado para a URL externa correta
    document.getElementById('btnHome').addEventListener('click', () => {
        window.location.href = 'https://profpablosanches.github.io/portalpedagogico/'; 
    });

    document.getElementById('btnGerar').addEventListener('click', fluxoNovoTabuleiro);
    document.getElementById('selectModo').addEventListener('change', renderizarTabuleiro);
    document.getElementById('btnImprimir').addEventListener('click', () => { window.print(); });

    fluxoNovoTabuleiro();
});
