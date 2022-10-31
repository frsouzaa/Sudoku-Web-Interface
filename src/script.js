window.onload = function () {
    const getTabuleiro = async () => {
        const baseURL = "http://localhost:5000/tabueleiroJogavel"
        const data = await fetch(baseURL)
            .then(res => res.json())
            .catch(e => tratarErroRetorno(e))
        return data;
    };

    function tratarErroRetorno(e) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                insertCell("cell", " ", i, i, j);
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
                    insertCell("cell", tabuleiro.retorno[i][j].valor, tabuleiro.retorno[i][j].bloco, tabuleiro.retorno[i][j].linha, tabuleiro.retorno[i][j].coluna);
                } else {
                    insertCell("input-cell", " ",bloco=tabuleiro.retorno[i][j].bloco, i, j);
                }
            }
        }
        removeInput()
    };

    function removeInput() {
        const input = document.getElementsByClassName("input-number")[0];
        input.parentNode.removeChild(input);
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
    const ElementosNalinha = document.getElementsByClassName(`linha-${linha}`);
    const ElementosNaColuna = document.getElementsByClassName(`coluna-${coluna}`);
    for(let i = 0; i < ElementosNalinha.length; i++){
        ElementosNalinha[i].classList.add("selecionado-auxiliar");
    }
    for(let i = 0; i < ElementosNaColuna.length; i++){
        ElementosNaColuna[i].classList.add("selecionado-auxiliar");
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
    console.log(event.srcElement.classList[0]);
    event.srcElement.value = ""
}

function mudarCor() {
    const elemetos = [
        document.getElementById("title"),
        document.getElementById("main"),
        document.getElementById("content"),
        document.getElementById("submit"),
        document.getElementById("cabecalho"),
        document.getElementById("btn-tema"),
        document.getElementById("grid"),
        document.getElementById("mudar-tema"),
        document.getElementsByClassName("btn-preencher"),
        document.getElementsByClassName("input-number"),
        document.getElementsByClassName("bloco-grid")
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

const validarApi = async () => {
    const baseURL = "http://localhost:5000/validaTabuleiro";
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
    const data = await fetch(baseURL, {
            method: "POST",
            body: JSON.stringify({"linha": linhas}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(res => res.json())
        .catch(e => console.log(e))
    return data
}

const validaTabuleiro = async () => {
    const tabuleiro = await validarApi();
    console.log(tabuleiro)
    return(tabuleiro)
}
