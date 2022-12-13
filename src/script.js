let lastSelected = null;
let originalTable = null;

window.onload = function () {
    const getTabuleiro = async () => {
        const baseURL = "http://localhost:5000/tabueleiroJogavel"
        const data = await fetch(baseURL)
            .then(res => res.json())
            .catch(e => tratarErroRetorno(e))
        
        originalTable = data;
        return data;
    };

    function tratarErroRetorno(e) {
        readTextFile("src/tabuleiroPadrao.json", function(text) {
            addValores(JSON.parse(text))
        });
    }

    const buildTabuleiro = async () => {
        const tabuleiro = await getTabuleiro();
        if(tabuleiro) {
            addValores(tabuleiro);
        }
        document.getElementById("main").classList.remove("escondido");
        document.getElementById("carregando").classList.add("escondido");
    };

    buildTabuleiro();
} 

function insertCell(classe=1, numero=0, bloco=0, i=0, j=0) {
    const container = document.getElementById(`bloco-${bloco+1}`);
    const cell = document.createElement("div");
    const elementoOriginal = document.getElementsByClassName("input-number")[classe];
    const input = elementoOriginal.cloneNode(false);
    if (classe) {
        input.classList.add("default-number");
        input.setAttribute('readonly', true);
        input.value = numero;
        input.classList.add(`valor-${numero}`);
        cell.classList.add("cell");
    } else {
        cell.classList.add("input-cell");
    }
    input.classList.add(`linha-${i}`);
    input.classList.add(`coluna-${j}`);
    input.classList.add(`bloco-${bloco}`);
    cell.appendChild(input);
    container.appendChild(cell);
}

function removeInput() {
    const input0 = document.getElementsByClassName("input-number")[0];
    const input1 = document.getElementsByClassName("input-number")[1];
    input0.parentNode.removeChild(input0);
    input1.parentNode.removeChild(input1);
}

function addValores(data) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if(data.retorno[i][j].valor !== '') {
                insertCell(1, data.retorno[i][j].valor, data.retorno[i][j].bloco, i, j);
            } else {
                insertCell(0, " ",data.retorno[i][j].bloco, i, j);
            }
        }
    }
    removeInput()
}

function readTextFile(file, callback) { 
    var rawFile = new XMLHttpRequest(); 
    rawFile.overrideMimeType("application/json"); 
    rawFile.open("GET", file, true); 
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function allowJustNumbers(event) {
    if(event.srcElement.value.length > 0) return false
    return event.charCode >= 49 && event.charCode <= 57;
}

function limpaSelecionados() {
    let selecioando = document.getElementsByClassName("selected");
    let auxiliares = document.getElementsByClassName("selecionado-auxiliar");
    const lenSel = selecioando.length;
    const lenAux = auxiliares.length;
    for(let i = 0; i < lenSel; i++) {
        selecioando[0].classList.remove("selected");
    }
    for(let i = 0; i < lenAux; i++) {
        auxiliares[0].classList.remove("selecionado-auxiliar");
    }
}

function addSelecionadoAuxiliar(elemento) {
    const linha = elemento.classList.value[elemento.classList.value.indexOf("linha-")+6];
    const coluna = elemento.classList.value[elemento.classList.value.indexOf("coluna-")+7];
    const bloco = elemento.classList.value[elemento.classList.value.indexOf("bloco-")+6];
    const ElementosNalinha = document.getElementsByClassName(`linha-${linha}`);
    const ElementosNaColuna = document.getElementsByClassName(`coluna-${coluna}`);
    const ElementosNoBloco = document.getElementsByClassName(`bloco-${bloco}`);
    for(let i = 0; i < 9; i++) {
        ElementosNalinha[i].classList.add("selecionado-auxiliar");
        ElementosNaColuna[i].classList.add("selecionado-auxiliar");
        ElementosNoBloco[i].classList.add("selecionado-auxiliar");
    }
}

function addClassSelected(elemento) {
    if(elemento.classList.value.indexOf("valor-") != -1) {
        const valor = elemento.classList.value[elemento.classList.value.indexOf("valor-")+6];
        const ElementosComValor = document.getElementsByClassName(`valor-${valor}`);
        for(let i = 0; i < ElementosComValor.length; i++) {
            ElementosComValor[i].classList.add("selected");
        }
        
    }
}

function selecionaAuxiliares(event) {
    lastSelected = event.srcElement;
    limpaSelecionados();
    event.srcElement.classList.add("selected");
    addSelecionadoAuxiliar(event.srcElement);
    addClassSelected(event.srcElement);
}

function preencherCampo(valor) {
    if(!lastSelected.classList.contains("default-number")) {
        if(lastSelected.classList.value.indexOf("valor-") != -1) {
            const valorAtual = lastSelected.classList.value[lastSelected.classList.value.indexOf("valor-")+6];
            lastSelected.classList.remove(`valor-${valorAtual}`);
        }
        if(lastSelected.value == valor) {
            lastSelected.value = "";
        } else {
            lastSelected.value = valor;
            lastSelected.classList.add(`valor-${valor}`);
        }
        limpaSelecionados();
        addSelecionadoAuxiliar(lastSelected);
        addClassSelected(lastSelected);
    }
}

function removerValor(event) {
    event.srcElement.value = "";
    if(event.srcElement.classList.value.indexOf("valor-") != -1) {
        const valorAtual = event.srcElement.classList.value[event.srcElement.classList.value.indexOf("valor-")+6];
        event.srcElement.classList.remove(`valor-${valorAtual}`);
    }
    limpaSelecionados();
    addSelecionadoAuxiliar(event.srcElement);
    addClassSelected(event.srcElement);
}

function mudarCor() {
    const elemetos = [
        document.getElementById("mudar-tema"),
        document.getElementById("title"),
        document.getElementById("main"),
        document.getElementById("content"),
        document.getElementById("validar"),
        document.getElementById("cabecalho"),
        document.getElementById("btn-tema"),
        document.getElementById("grid"),
        document.getElementById("preencher"),
        document.getElementById("limpar"),
        document.getElementById("contatos"),
        document.getElementById("rodape"),
        document.getElementsByClassName("btn-preencher"),
        document.getElementsByClassName("input-number"),
        document.getElementsByClassName("bloco-grid"),
        document.getElementsByClassName("contato")
    ];
    
    for(let i = 0; i < elemetos.length; i++) {
        if(elemetos[i].length > 1) {
            for(let j = 0; j < elemetos[i].length; j++) {
                elemetos[i][j].classList.toggle("dark-mode");
                elemetos[i][j].classList.toggle("light-mode");
            }
        } else {
            elemetos[i].classList.toggle("dark-mode");
            elemetos[i].classList.toggle("light-mode");
        }
    }
    elemetos[0].classList.toggle("fa-moon");
    elemetos[0].classList.toggle("fa-sun");
}

function criarTabuleiroApi() {
    let linhas = [[],[],[],[],[],[],[],[],[]];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            linhas[i].push(document.getElementsByClassName(`linha-${i} coluna-${j}`)[0].value);
        }
    }
    console.log(linhas)
    return linhas;
}

const validarApi = async () => {
    const baseURL = "http://localhost:5000/validaTabuleiro";
    const linhas = criarTabuleiroApi();
    const data = await fetch(baseURL, {
            method: "POST",
            body: JSON.stringify({"linhas": linhas}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(res => res.json())
        .catch(e => console.log(e))
    return data
}

const validaTabuleiro = async () => {
    const tabuleiro = await validarApi();
    const h2 = document.getElementById("status");
    if(tabuleiro.status === "ok") {
        h2.classList.remove("invalido");
        h2.classList.add("valido");
        h2.innerHTML = "Você Venceu <i class='fa-solid fa-face-laugh-wink'</i>";
    } else {
        h2.classList.remove("valido");
        h2.classList.add("invalido");
        h2.innerHTML = "Você Perdeu <i class='fa-solid fa-face-sad-tear'></i>";
    }
}

const preencheApi = async () => {
    const baseURL = "http://localhost:5000/preencheTabuleiro";
    const linhas = criarTabuleiroApi();
    const data = await fetch(baseURL, {
            method: "POST",
            body: JSON.stringify({"linhas": linhas}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(res => res.json())
        .catch(e => console.log(e))
    return data
}

const preencheTabuleiro = async () => {
    const tabuleiro = await preencheApi();
    const inputs = document.getElementsByClassName("input-number");
    for (let l = 0; l < 9; l++) {
        let k = 0;
        let limite = Math.trunc(l/3) * 3;   
        for(let i = limite; i < limite+3; i++) {
            let limite2 = Math.trunc(l%3)*3;
            for(let j = limite2; j < limite2+3; j++) {
                inputs[(i*9)+j].value = tabuleiro.retorno[l][k].valor;
                k++;
            }
        }
    }
    return(tabuleiro);
}

function limparTabuleiro() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            document.getElementsByClassName(`linha-${i} coluna-${j}`)[0].value = originalTable.retorno[i][j].valor
        }
    }
    const h2 = document.getElementById("status");
    h2.innerHTML = "";
}
