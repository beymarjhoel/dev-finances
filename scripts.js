const Modal = {		/* Definição de um novo objeto*/
    open() {
        /* Abrir Modal */
        /* Adicionar a class active ao modal */
        /* document.querySelector é uma funcionalidade que precisa de um argumento = Faça uma busca no documento inteiro */
        /* classList = Função add com o argumento, irá adicionar a class active que está no documento */
        /* Documento, pesquise dentro de você, pelo seletor que quero colocar agora */
        document.querySelector('.modal-overlay').classList.add('active') 
    },

    close() {
        /* Fechar Modal */
        /* Remover a class active do modal */
        document.querySelector('.modal-overlay').classList.remove('active') 	
  }
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000, /* 500,00 guardar com as casas decimais */
        date: '07/02/2021',
    },
    {
        id: 2,
        description: 'Website',
        amount: 500000, /* 5000,00 guardar com as casas decimais */
        date: '07/02/2021',
    },

    {
        id: 3,
        description: 'Internet',
        amount: -20000, /* 200,00 guardar com as casas decimais */
        date: '07/02/2021',
    },
    {
        id: 4,
        description: 'App',
        amount: 200000, /* 200,00 guardar com as casas decimais */
        date: '07/02/2021',
    }
]

const Transaction = {
        /* Eu preciso somar as entradas
           depois eu preciso somar as saídas e
           remover das entradas o valor das saídas
           assim, eu terei o total  */

    incomes() {  /* Somar as entradas */

    },
    expances() { /* Somar as saídas */
        
    },
    total() {

    }


}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),    
    /* Document Object Model */
    /* transaction = transação que quer adicionar */
    /* index = onde que vai colocar a transação*/
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
    
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction) { /* INTERNO DE UMA TRANSAÇÃO */
        /* Literals ou Crase permite por variáveis dentro dela */
        /* Interpolação ${} por variaveis no literals */

        /* Se o amount for maior que 0, ou seja true, ele recebe a classe "income" | green se não recebe "expense" | red, o famoso ternário */
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)
        // 1:16:10 video 3
        const html = ` 
            <td class="description">${transaction.description}</td> 
            <td class="${CSSclass}">${amount}</td>      
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover Transação">
            </td>
        `
        return html
    }  
}

const Utils = {
    formatCurrency(value) {
        /* Se esse número for menor que 0 ele recebe signal de negativo, se não, não recebe nenhum sinal */
        /* Converte o que for recebido para TIPO número */
        const signal = Number(value) < 0 ? "-" : ""
        
        /* Regra de moedas */
        /* (/0/g, "discover") g = é global | troca todos por discover | (/\D/g, "Discover") = Ache só números */
        /* Converte o que for recebido para o TIPO string */
        value = String(value).replace(/\D/g, "") 

        /* Por isso botava o valor real em transactions[] ex: amount 20000(duzentos) / 100 = 200,00 valor oficial */
        value = Number(value) / 100

        /* Funcionalidade que precisa de argumentos, (que local que estou, opções que tenho como objeto, 2 opções style/currency e tipo/real br)*/
        value = value.toLocaleString("pt-BR", {
            style: "currency", 
            currency: "BRL"
        })

        return signal + value
    }
}

transactions.forEach(function(transaction) { /* Para cada elemento, ele irá executar uma funcionalidade */
    DOM.addTransaction(transaction)
})     