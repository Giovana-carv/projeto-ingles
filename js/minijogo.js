
"use strict";

// ========================================
// 1. Elementos HTML
// ========================================

const botaoPalavras = document.getElementById("botao-palavras");
const listaPalavras = document.getElementById("lista-palavras");
const indicadorMenu = document.getElementById("indicador-menu");

const lista = document.getElementById("palavras");
const mensagemPalavras = document.getElementById("mensagem-palavras");

const tituloCapitulo = document.getElementById("capitulo");
const nivelCapitulo = document.getElementById("nivel");

const numeroQuestao = document.getElementById("numero-questao");
const tituloQuestao = document.getElementById("titulo-questao");
const textoQuestao = document.getElementById("texto-questao");

const formQuestao = document.getElementById("form-questao");
const opcoesQuestao = document.getElementById("opcoes-questao");
const botaoResponder = document.getElementById("botao-responder");
const mensagemResposta = document.getElementById("mensagem-resposta");

const alternativas = Array.from(
    opcoesQuestao.querySelectorAll('input[name="resposta"]')
);


// ========================================
// 2. Dados provisórios
// ========================================

// Futuramente, estes dados virão do back-end.

const dadosCapitulo = {
    numero: 1,
    nivel: "Iniciante"
};

let questaoAtual = null;
let palavrasConsultadas = [];


// ========================================
// 3. Identificação do capítulo
// ========================================

function carregarCapitulo(capitulo) {
    tituloCapitulo.textContent =
        `Capítulo ${capitulo.numero}`;

    nivelCapitulo.textContent =
        `Nível ${capitulo.nivel.toLowerCase()}`;
}

carregarCapitulo(dadosCapitulo);


// ========================================
// 4. Menu consultar palavras
// ========================================

botaoPalavras.addEventListener("click", function () {
    const estaAberto =
        botaoPalavras.getAttribute("aria-expanded") === "true";

    const novoEstado = !estaAberto;

    botaoPalavras.setAttribute(
        "aria-expanded",
        String(novoEstado)
    );

    listaPalavras.hidden = !novoEstado;

    indicadorMenu.textContent =
        novoEstado ? "⌃" : "⌄";
});


// ========================================
// 5. Carregar palavras
// ========================================

function carregarPalavras(palavras = []) {
    lista.replaceChildren();

    palavrasConsultadas = palavras;

    if (palavrasConsultadas.length === 0) {
        mensagemPalavras.textContent =
            "Nenhuma palavra consultada ainda.";

        mensagemPalavras.hidden = false;
        return;
    }

    mensagemPalavras.hidden = true;

    palavrasConsultadas.forEach(function (palavra) {
        const item = document.createElement("li");

        item.textContent = palavra;

        lista.appendChild(item);
    });
}

// Inicialmente, a lista fica vazia.
carregarPalavras(palavrasConsultadas);


// ========================================
// 6. Seleção das alternativas
// ========================================

alternativas.forEach(function (input) {
    input.addEventListener("change", function () {
        // Remove o destaque de todas as opções.
        alternativas.forEach(function (alternativa) {
            const rotulo = alternativa.closest(".opcao");

            rotulo.classList.remove("selecionada");
        });

        // Destaca somente a alternativa escolhida.
        const rotuloSelecionado = input.closest(".opcao");

        if (rotuloSelecionado) {
            rotuloSelecionado.classList.add("selecionada");
        }

        mensagemResposta.textContent = "";
    });
});


// ========================================
// 7. Carregar uma questão
// ========================================

function carregarQuestao(questao) {
    const letras = ["A", "B", "C", "D"];

    const questaoValida =
        questao &&
        typeof questao.enunciado === "string" &&
        questao.alternativas &&
        letras.every(function (letra) {
            return typeof questao.alternativas[letra] === "string";
        });

    if (!questaoValida) {
        mensagemResposta.textContent =
            "Não foi possível carregar a questão.";

        return;
    }

    questaoAtual = questao;

    numeroQuestao.textContent = questao.numero
        ? `QUESTÃO ${questao.numero}`
        : "QUESTÃO";

    tituloQuestao.textContent = "Resolva a questão";

    textoQuestao.textContent = questao.enunciado;

    alternativas.forEach(function (input) {
        input.checked = false;

        const rotulo = input.closest(".opcao");

        rotulo.classList.remove("selecionada");

        rotulo.querySelector(".texto-opcao").textContent =
            questao.alternativas[input.value];
    });

    mensagemResposta.textContent = "";
}


// ========================================
// 8. Confirmar resposta
// ========================================

formQuestao.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const resposta = alternativas.find(function (input) {
        return input.checked;
    });

    if (!resposta) {
        mensagemResposta.textContent =
            "Selecione uma alternativa antes de continuar.";

        return;
    }

    if (!questaoAtual) {
        mensagemResposta.textContent =
            "Alternativa selecionada. Ainda não existe uma questão cadastrada para correção.";

        return;
    }

    if (!questaoAtual.respostaCorreta) {
        mensagemResposta.textContent =
            "Esta questão ainda não possui gabarito disponível.";

        return;
    }

    const acertou =
        resposta.value === questaoAtual.respostaCorreta;

    mensagemResposta.textContent = acertou
        ? "Resposta correta!"
        : "Resposta incorreta. Tente novamente.";
});


// ========================================
// 9. Estado inicial
// ========================================

// Não desabilitamos o fieldset.
// Assim, as alternativas permanecem selecionáveis
// mesmo antes da integração com o banco de dados.

botaoResponder.disabled = false;


// ========================================
// 10. Exemplos de integração futura
// ========================================

// Para testar a lista de palavras:
//
// carregarPalavras(["book", "house", "school"]);
//
// Para testar uma questão:
//
// carregarQuestao({
//     numero: 1,
//     enunciado: "Qual é a tradução da palavra 'book'?",
//     alternativas: {
//         A: "Livro",
//         B: "Casa",
//         C: "Escola",
//         D: "Mesa"
//     },
//     respostaCorreta: "A"
// });
