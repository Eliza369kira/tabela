// ===== CONFIG =====
const clientes = [
    "Cliente 1","Cliente 2","Cliente 3","Cliente 4",
    "Cliente 5","Cliente 6","Cliente 7","Cliente 8",
    "Cliente 9","Cliente 10","Cliente 11","Cliente 12"
];

const produtos = [
    "Abacate","Abobrinha","Alface","Berinjela","Chuchu",
    "Gengibre","Graviola","Jiló","Maracujá","Maxixe",
    "Pepino","Pimentão","Repolho roxo","Repolho verde",
    "Tangerina","Tomate","Vagem","Limão","Goiaba"
];

const container = document.getElementById("clientes-container");

let modoRemoverLinha = false;


// ===== CRIAR TABELA =====
function criarTabela(nomeCliente) {

    const card = document.createElement("div");
    card.className = "tabela-cliente";

    const menu = document.createElement("div");
    menu.className = "menu-acoes";
    menu.innerHTML = `
        <button data-acao="excluir">Excluir Tabela</button>
        <button data-acao="linha">Remover Linha</button>
    `;

    const titulo = document.createElement("h3");
    titulo.textContent = nomeCliente;
    titulo.contentEditable = true;

    const tabela = document.createElement("table");

    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Quant.</th>
            <th>Produto</th>
        </tr>
    `;

    const tbody = document.createElement("tbody");

    produtos.forEach(produto => {
        const tr = document.createElement("tr");

        const tdQtd = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        tdQtd.appendChild(input);

        const tdProduto = document.createElement("td");
        tdProduto.textContent = produto;
        tdProduto.contentEditable = true;

        tr.appendChild(tdQtd);
        tr.appendChild(tdProduto);
        tbody.appendChild(tr);
    });

    tabela.appendChild(thead);
    tabela.appendChild(tbody);

    // ===== EVENTOS =====
    thead.addEventListener("click", (e) => {
        e.stopPropagation();

        document.querySelectorAll(".menu-acoes")
            .forEach(m => m.style.display = "none");

        menu.style.display = "flex";
    });

    menu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    menu.addEventListener("click", (e) => {

        const acao = e.target.dataset.acao;

        if (acao === "excluir") {
            if (confirm("Excluir cliente inteiro?")) {
                card.remove();
            }
        }

        if (acao === "linha") {
            modoRemoverLinha = true;
            document.body.style.cursor = "crosshair";
            alert("Clique na linha que deseja remover");
        }

        menu.style.display = "none";
    });

    tbody.addEventListener("click", (e) => {

        if (!modoRemoverLinha) return;

        e.preventDefault();
        e.stopPropagation();

        const linha = e.target.closest("tr");
        if (linha) linha.remove();

        modoRemoverLinha = false;
        document.body.style.cursor = "default";
    });

    card.addEventListener("click", () => {
        document.querySelectorAll(".tabela-cliente")
            .forEach(c => c.classList.remove("ativa"));

        card.classList.add("ativa");
    });

    card.appendChild(menu);
    card.appendChild(titulo);
    card.appendChild(tabela);

    return card;
}


// ===== INICIAR =====
clientes.forEach(nome => {
    container.appendChild(criarTabela(nome));
});


// ===== BOTÕES =====

// adicionar cliente
document.getElementById("btnAddCliente").addEventListener("click", () => {
    container.appendChild(criarTabela("Novo Cliente"));
});

// adicionar produto
document.getElementById("btnAddProduto").addEventListener("click", () => {

    const nome = prompt("Nome do produto:");
    if (!nome) return;

    document.querySelectorAll(".tabela-cliente tbody")
        .forEach(tbody => {

            const tr = document.createElement("tr");

            const tdQtd = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";

            const tdProduto = document.createElement("td");
            tdProduto.textContent = nome;
            tdProduto.contentEditable = true;

            tdQtd.appendChild(input);
            tr.appendChild(tdQtd);
            tr.appendChild(tdProduto);

            tbody.appendChild(tr);
        });
});


// ===== FECHAR MENU =====
document.addEventListener("click", () => {
    document.querySelectorAll(".menu-acoes")
        .forEach(m => m.style.display = "none");
});


// ===== IMPRESSÃO PROFISSIONAL AJUSTADA =====

document.getElementById("btnPrint").addEventListener("click", () => {
    const tabelas = document.querySelectorAll(".tabela-cliente");
    
    // 1. Sincroniza os valores dos inputs para que apareçam na cópia
    document.querySelectorAll("input").forEach(inp => {
        inp.setAttribute('value', inp.value);
    });

    let paginas = "";

    for (let i = 0; i < tabelas.length; i++) {
        // Inicia nova página a cada 8 tabelas
        if (i % 8 === 0) {
            if (i !== 0) paginas += `</div>`;
            paginas += `<div class="pagina">`;
        }

        // Clona a tabela e remove o menu de ações
        const cloneTabela = tabelas[i].cloneNode(true);
        const menuParaRemover = cloneTabela.querySelector(".menu-acoes");
        if (menuParaRemover) menuParaRemover.remove();

        paginas += cloneTabela.outerHTML;
    }

    paginas += `</div>`; // Fecha a última página

    const win = window.open("", "", "width=1000,height=800");

   
   
       win.document.write(`
        <html>
        <head>
            <title>Impressão de Pedidos</title>
            <style>
                @page { size: A4 portrait; margin: 5mm; }
                body { font-family: sans-serif; margin: 0; padding: 0; background: #fff !important; }
                
                .pagina {
                    width: 210mm;
                    height: 290mm;
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    grid-template-rows: repeat(2, 1fr); 
                    gap: 4px;
                    padding: 4px;
                    page-break-after: always;
                    box-sizing: border-box;
                }

                .tabela-cliente {
                    border: 1px solid #000;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden;
                    box-sizing: border-box;
                    background: #fff !important;
                }

                .tabela-cliente h3 {
                    margin: 0;
                    background: #fff !important; /* Branco para economizar tinta */
                    color: #000 !important;      /* Letra preta */
                    border-bottom: 1.5px solid #000; /* Linha divisória para destacar o nome */
                    font-size: 10px;
                    padding: 3px;
                    text-align: center;
                    text-transform: uppercase;
                    font-weight: bold;
                }

                .tabela-cliente table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    flex: 1; 
                }
                
                .tabela-cliente th, .tabela-cliente td {
                    border: 1px solid #000;
                    font-size: 9px;
                    padding: 1px 2px;
                    text-align: center;
                    color: #000 !important;
                }

                .tabela-cliente th { 
                    background: #fff !important; /* Retirado o cinza para economia total */
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 8px;
                }
                
                .tabela-cliente input {
                    border: none;
                    width: 100%;
                    text-align: center;
                    font-size: 10px;
                    font-weight: bold;
                    background: transparent;
                    color: #000 !important;
                }

                /* Força o navegador a respeitar a ausência de cores (economia) */
                * { 
                    -webkit-print-color-adjust: exact !important; 
                    print-color-adjust: exact !important; 
                }
            </style>
        </head>
        <body>${paginas}</body>
        </html>
    `);

   
   

        win.document.close();

    win.onload = function() {
        setTimeout(() => {
            win.focus(); // Dá foco na nova aba
            win.print(); // Dispara a impressão
            
            // Opcional: fechar a aba após imprimir (ajuda no celular)
            // win.onafterprint = () => win.close(); 
        }, 800); // Um delay levemente maior para o celular processar o HTML pesado
    };

});