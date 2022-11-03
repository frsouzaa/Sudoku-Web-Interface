window.onload = function () {
    const getTabuleiro = async () => {
        const baseURL = "http://localhost:5000/tabueleiroJogavel"
        const data = await fetch(baseURL)
            .then(res => res.json())
            .catch(e => tratarErroRetorno(e))
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

function insertCell(classe="cell", numero=0, bloco=0, i=0, j=0) {
    const container = document.getElementById(`bloco-${bloco+1}`);
    const cell = document.createElement("div");
    const elementoOriginal = document.getElementsByClassName("input-number")[0];
    const input = elementoOriginal.cloneNode(false);
    if (classe === "cell") {
        input.classList.add("default-number");
        input.setAttribute('disabled', true);
        input.value = numero;
    } else {
        input.classList.add("input-number");

    }
    input.classList.add(`linha-${i}`);
    input.classList.add(`coluna-${j}`);
    input.classList.add(`bloco-${bloco}`);
    input.classList.add("dark-mode");
    cell.appendChild(input);
    cell.classList.add(classe);
    container.appendChild(cell);
}

function removeInput() {
    const input = document.getElementsByClassName("input-number")[0];
    input.parentNode.removeChild(input);
}

function addValores(data) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if(data.retorno[i][j].valor !== '') {
                insertCell("cell", data.retorno[i][j].valor, data.retorno[i][j].bloco, i, j);
            } else {
                insertCell("input-cell", " ",data.retorno[i][j].bloco, i, j);
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

function addClassSelected(event) {
    const selecioando = document.getElementsByClassName("selected");
    const auxiliares = document.getElementsByClassName("selecionado-auxiliar");
    for(let i = 0; i < selecioando.length; i++) {
        selecioando[i].classList.remove("selected");
    }
    const len = auxiliares.length
    for(let i = 0; i < len; i++) {
        auxiliares[0].classList.remove("selecionado-auxiliar");
    }
    event.srcElement.classList.add("selected")
    const linha = event.srcElement.classList.value[event.srcElement.classList.value.indexOf("linha-")+6];
    const coluna = event.srcElement.classList.value[event.srcElement.classList.value.indexOf("coluna-")+7];
    const bloco = event.srcElement.classList.value[event.srcElement.classList.value.indexOf("bloco-")+6];
    const ElementosNalinha = document.getElementsByClassName(`linha-${linha}`);
    const ElementosNaColuna = document.getElementsByClassName(`coluna-${coluna}`);
    const ElementosNoBloco = document.getElementsByClassName(`bloco-${bloco}`);
    for(let i = 0; i < ElementosNalinha.length; i++){
        ElementosNalinha[i].classList.add("selecionado-auxiliar");
        ElementosNaColuna[i].classList.add("selecionado-auxiliar");
        ElementosNoBloco[i].classList.add("selecionado-auxiliar");
    }
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
    const elemetos = [
        document.getElementById("title"),
        document.getElementById("main"),
        document.getElementById("content"),
        document.getElementById("validar"),
        document.getElementById("cabecalho"),
        document.getElementById("btn-tema"),
        document.getElementById("grid"),
        document.getElementById("mudar-tema"),
        document.getElementById("preencher"),
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
    elemetos[7].classList.toggle("fa-moon");
    elemetos[7].classList.toggle("fa-sun");
}

function criarTabuleiroApi() {
    const inputs = document.getElementsByClassName("input-number");
    let linhas = [[],[],[],[],[],[],[],[],[]];
    for (let l = 0; l < 9; l++) {
        let limite = Math.trunc(l/3) * 3;   
        for(let i = limite; i < limite+3; i++) {
            let limite2 = Math.trunc(l%3)*3;
            for(let j = limite2; j < limite2+3; j++) {
                linhas[l].push(inputs[(i*9)+j].value);
            }
        }
    }
    return linhas
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
        h2.classList.add("valido");
        h2.classList.remove("invalido");
        h2.innerHTML = "Você Venceu!!!";
    } else {
        h2.classList.add("invalido");
        h2.classList.remove("valido");
        h2.innerHTML = "Você Perdeu";
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