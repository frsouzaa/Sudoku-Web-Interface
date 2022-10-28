window.onload = function () {
    const baseURL = "http://localhost:5000/tabueleiroJogavel"

    const getTabuleiro = async () => {
        const data = await fetch(baseURL)
            .then(res => res.json())
            .catch(e => teste(e))

        return data;
    };

    function teste(e) {
        console.log(e);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                insertCell("cell", 0, i);
            }
        }
        removeInput()
    }

    const buildTabuleiro = async () => {
        const tabuleiro = await getTabuleiro();
        console.log(tabuleiro.retorno);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if(tabuleiro.retorno[i][j].valor !== ' ') {
                    insertCell("cell", tabuleiro.retorno[i][j].valor, tabuleiro.retorno[i][j].bloco);
                } else {
                    insertCell("input-cell", " ",bloco=tabuleiro.retorno[i][j].bloco);
                }
            }
        }
        removeInput()
    };

    function removeInput() {
        const input = document.getElementsByClassName("input-number")[0];
        input.parentNode.removeChild(input);
    }

    function insertCell(classe="cell", numero=0, bloco=0) {
        const container = document.getElementById(`bloco-${bloco+1}`);
        const cell = document.createElement("div");
        const elementoOriginal = document.getElementsByClassName("input-number")[0];
        const input = elementoOriginal.cloneNode(false);
        if (classe === "cell") {
            input.classList.add("default-number");
            input.setAttribute('readonly', true);
            input.value = numero;
        } else {
            input.classList.add("input-number");

        }
        input.classList.add("dark-mode");
        cell.appendChild(input);
        cell.classList.add(classe);
        container.appendChild(cell);
    }

    buildTabuleiro();
} 

function allowJustNumbers(event) {
    if(event.srcElement.value.length > 0) return false
    return event.charCode >= 49 && event.charCode <= 57;
}

function addClassSelected(event) {
    const selecioando = document.getElementsByClassName("selected");
    for(let i = 0; i< selecioando.length; i++) {
        selecioando[i].classList.remove("selected")
    }
    event.srcElement.classList.add("selected")
}

function removeClassSelected() {
    const selecioando = document.getElementsByClassName("selected");
    for(let i = 0; i< selecioando.length; i++) {
        selecioando[i].classList.remove("selected")
    }
}

function preencherCampo(event) {
    const selecioando = document.getElementsByClassName("selected")[0];
    selecioando.value = event.srcElement.id[3]
    selecioando.classList.remove("selected")
}

function removerValor(event) {
    event.srcElement.value = ""
}

function mudarCor() {
    const titulo = document.getElementById("title");
    const main = document.getElementById("main");
    const conteudo = document.getElementById("content");
    const enviar = document.getElementById("submit");
    const cabecalho = document.getElementById("cabecalho");
    const mudarTema = document.getElementById("btn-tema");
    const grid = document.getElementById("grid");
    const icone = document.getElementById("mudar-tema");
    
    
    titulo.classList.toggle("dark-mode");
    main.classList.toggle("dark-mode");
    enviar.classList.toggle("dark-mode");
    grid.classList.toggle("dark-mode");
    cabecalho.classList.toggle("dark-mode");
    conteudo.classList.toggle("dark-mode");
    mudarTema.classList.toggle("dark-mode");
    icone.classList.toggle("dark-mode");

    titulo.classList.toggle("light-mode");
    main.classList.toggle("light-mode");
    enviar.classList.toggle("light-mode");
    grid.classList.toggle("light-mode");
    cabecalho.classList.toggle("light-mode");
    conteudo.classList.toggle("light-mode");
    mudarTema.classList.toggle("light-mode");
    icone.classList.toggle("light-mode");

    const teclado = document.getElementsByClassName("btn-preencher");
    const inputs = document.getElementsByClassName("input-number");
    const bloco = document.getElementsByClassName("bloco-grid");

    for(let i = 0; i< teclado.length; i++) {
        teclado[i].classList.toggle("dark-mode");
        teclado[i].classList.toggle("light-mode");
    }

    for(let i = 0; i< inputs.length; i++) {
        inputs[i].classList.toggle("dark-mode");
        inputs[i].classList.toggle("light-mode");
    }

    for(let i = 0; i< bloco.length; i++) {
        bloco[i].classList.toggle("dark-mode");
        bloco[i].classList.toggle("light-mode");
    }
}