
const fotoInput = document.getElementById("foto");
const previewFoto = document.getElementById("preview-foto");
const textoFoto = document.getElementById("texto-foto");

const listaCapitulos = document.getElementById("lista-capitulos");

// Dados provisórios para simular o retorno do futuro back-end.
const estudante = {
    nome: "Nome do estudante",
    escolaridade: "Ensino Superior"
};

const progresso = {
    capituloAtual: 2,

    capitulos: [
        {
            numero: 1,
            liberado: true,
            palavras: ["book", "house", "school"]
        },
        {
            numero: 2,
            liberado: true,
            palavras: []
        },
        {
            numero: 3,
            liberado: false,
            palavras: []
        }
    ]
};

// Exibe os dados temporários do estudante.
document.getElementById("nome-estudante").textContent =
    estudante.nome;

document.getElementById("escolaridade").textContent =
    estudante.escolaridade;

// Permite visualizar uma foto selecionada no computador.
fotoInput.addEventListener("change", function () {
    const arquivo = fotoInput.files[0];

    if (!arquivo || !arquivo.type.startsWith("image/")) {
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function () {
        previewFoto.src = leitor.result;
        previewFoto.style.display = "block";
        textoFoto.style.display = "none";
    };

    leitor.readAsDataURL(arquivo);
});

// Cria o cartão de um capítulo liberado.
function criarCapitulo(capitulo) {
    const artigo = document.createElement("article");
    artigo.classList.add("capitulo");

    const cabecalho = document.createElement("button");
    cabecalho.type = "button";
    cabecalho.classList.add("capitulo-cabecalho");
    cabecalho.setAttribute("aria-expanded", "false");

    const id = `capitulo-${capitulo.numero}`;
    cabecalho.id = `botao-${id}`;

    const titulo = document.createElement("span");
    titulo.textContent = `Capítulo ${capitulo.numero}`;

    const indicador = document.createElement("span");
    indicador.textContent = "+";
    indicador.setAttribute("aria-hidden", "true");

    cabecalho.append(titulo, indicador);

    const conteudo = document.createElement("section");
    conteudo.classList.add("capitulo-conteudo");
    conteudo.id = id;
    conteudo.hidden = true;
    conteudo.setAttribute("aria-labelledby", cabecalho.id);

    const subtitulo = document.createElement("h3");
    subtitulo.textContent = "Palavras aprendidas";

    conteudo.appendChild(subtitulo);

    if (capitulo.palavras.length > 0) {
        const lista = document.createElement("ul");

        capitulo.palavras.forEach(function (palavra) {
            const item = document.createElement("li");
            item.textContent = palavra;
            lista.appendChild(item);
        });

        conteudo.appendChild(lista);
    } else {
        const mensagem = document.createElement("p");
        mensagem.textContent =
            "Nenhuma palavra registrada neste capítulo.";

        conteudo.appendChild(mensagem);
    }

    cabecalho.addEventListener("click", function () {
        const aberto =
            cabecalho.getAttribute("aria-expanded") === "true";

        cabecalho.setAttribute("aria-expanded", String(!aberto));
        conteudo.hidden = aberto;
        indicador.textContent = aberto ? "+" : "−";
    });

    artigo.append(cabecalho, conteudo);
    listaCapitulos.appendChild(artigo);
}

// Exibe somente os capítulos liberados.
function carregarCapitulos() {
    listaCapitulos.innerHTML = "";

    const liberados = progresso.capitulos
        .filter(function (capitulo) {
            return capitulo.liberado &&
                capitulo.numero <= progresso.capituloAtual;
        })
        .sort(function (a, b) {
            return a.numero - b.numero;
        });

    liberados.forEach(function (capitulo) {
        criarCapitulo(capitulo);
    });
}

carregarCapitulos();
