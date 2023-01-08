let lastSelected = null;
let originalTable = null;
let API = null;
if (document.URL.includes("127.0.0.1:5500")) {
    API = "http://localhost:8080";
} else {
    API = "http://54.211.171.147:8080/";
}
window.onload = function () {
    const getTabuleiro = async () => {
        const baseURL = `${API}/tabueleiroJogavel`;
        const data = await fetch(baseURL, {
            method: "GET"
        })
            .then(res => res.json())
            .catch(e => tratarErroRetorno(e));
        
        originalTable = data;
        return data;
    };

    const tratarErroRetorno = async (e) => {
        const data = await fetch("https://sudokuapi.s3.amazonaws.com/tabuleiroPadrao.json")
            .then(res => res.json())
            .catch(e => console.log(e));
        addValores(data);
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

    document.addEventListener('keydown', function(event) {
        if(event.key === "Escape") {
            tirarOFoco();
        }
    });
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

function allowJustNumbers(event) {
    if(lastSelected.value === (event.charCode - 48).toString()) {
        lastSelected.value = "";
        return false;
    }
    if(event.charCode >= 49 && event.charCode <= 57) {
        lastSelected.value = event.charCode - 48;
        return false;
    }
    return false;
}

function tirarOFoco() {
    limpaSelecionados();
    lastSelected.blur();
    lastSelected = null;
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
    if(elemento.classList.value.indexOf("valor-") === -1) {
        return;
    }
    const valor = elemento.classList.value[elemento.classList.value.indexOf("valor-")+6];
    const ElementosComValor = document.getElementsByClassName(`valor-${valor}`);
    for(let i = 0; i < ElementosComValor.length; i++) {
        ElementosComValor[i].classList.add("selected");
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
    if(!lastSelected ||
        lastSelected.classList.contains("default-number")) {
        return;
    }
    if(lastSelected.classList.value.indexOf("valor-") !== -1) {
        const valorAtual = lastSelected.classList.value[lastSelected.classList.value.indexOf("valor-")+6];
        lastSelected.classList.remove(`valor-${valorAtual}`);
    }
    if(lastSelected.value === valor) {
        lastSelected.value = "";
    } else {
        lastSelected.value = valor;
        lastSelected.classList.add(`valor-${valor}`);
    }
    limpaSelecionados();
    addSelecionadoAuxiliar(lastSelected);
    addClassSelected(lastSelected);
    lastSelected.select()
}

function removerValor(event) {
    event.srcElement.value = "";
    if(event.srcElement.classList.value.indexOf("valor-") !== -1) {
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
        document.getElementById("preencher"),
        document.getElementById("limpar"),
        document.getElementById("contatos"),
        document.getElementById("rodape"),
        document.getElementById("grid"),
        document.getElementsByClassName("btn-preencher"),
        document.getElementsByClassName("contato"),
        document.getElementsByClassName("bloco-grid"),
        document.getElementsByClassName("input-number"),
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
    return linhas;
}

const validarApi = async () => {
    const baseURL = `${API}/validaTabuleiro`;
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
        h2.innerHTML = "Você Venceu <i class='fa-regular fa-face-smile'></i>";
    } else {
        h2.classList.remove("valido");
        h2.classList.add("invalido");
        h2.innerHTML = "Você Perdeu <i class='fa-regular fa-face-sad-tear'></i>";
    }
    setTimeout(() => {
        h2.innerHTML = "";
    }, 5000);
}

const preencheApi = async () => {
    const baseURL = `${API}/preencheTabuleiro`;
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
    const h2 = document.getElementById("status");
    if(tabuleiro.status === "invalido") {
        h2.classList.remove("valido");
        h2.classList.add("invalido");
        h2.innerHTML = "Não foi possível preencher a partir das respostas informadas <i class='fa-regular fa-face-sad-tear'></i>";
        setTimeout(() => {
            h2.innerHTML = "";
        }, 7000);
        return;
    }
    h2.classList.remove("invalido");
    h2.classList.add("valido");
    h2.innerHTML = "Preenchido com sucesso <i class='fa-regular fa-face-smile'</i>";
    setTimeout(() => {
        h2.innerHTML = "";
    }, 5000);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let input = document.getElementsByClassName(`linha-${i} coluna-${j}`)[0];
            let valor = tabuleiro.retorno[i][j].valor;
            input.value = valor;
            input.classList.add(`valor-${valor}`);
        }
    }
    addClassSelected(lastSelected);
    lastSelected.select();
}

function limparTabuleiro() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            input = document.getElementsByClassName(`linha-${i} coluna-${j}`)[0];
            input.value = originalTable.retorno[i][j].valor
            if(!originalTable.retorno[i][j].valor &&
                input.classList.value.indexOf("valor-") !== -1) {
                const valorAtual = input.classList.value[input.classList.value.indexOf("valor-")+6];
                input.classList.remove(`valor-${valorAtual}`);
            }
        }
    }
    const h2 = document.getElementById("status");
    h2.innerHTML = "";
    tirarOFoco();
}
