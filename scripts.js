//Definição de um novo objeto
const Modal = {	
    //Abrir Modal
    open() {
        //Adicionar a class active ao modal
        // document.querySelector é uma funcionalidade que precisa de um argumento = Faça uma busca no documento inteiro
        // classList = Função add com o argumento, irá adicionar a class active que está no documento
        // Documento, pesquise dentro de você, pelo seletor que quero colocar agora
        document.querySelector('.modal-overlay').classList.add('active')
    },

    //Fechar Modal
    close() {
        //Remover a class active do modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

const Storage = {
    //localStorage sempre vai guardar String 
    //Pegar as informações
    get() {
        //Transformar uma String para array 
        //JSON.parse = responsavel para tranformar de string para array(ou objeto se quiser), inserir o nome do item "dev.finances:transactions", ou se não tiver essa chave no localStorage, devolve um array vazio no get 
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    }, 
    //Guardar as informações, no caso de transactions
    set(transactions) {
        //Essa funcionalidade vai receber dois argumentos, a chave(qualquer nome que você quer identificar no seu localStorage) e o valor
        //JSON.stringify(transactions) é para transformar um array em uma String, como um valor 
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    //Criando um atalho dentro desse objeto Transaction para todas as transactions(TRANSAÇÕES)
    all: Storage.get(),

    add(transaction) {
        //push é uma funcionalidade atrelada a listas(array) push vai COLOCAR algo dentro do array, no caso a transaction
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        //Procurar dentro do array pelo index desse array
        //splice é um método que aplicamos em arrays, no caso ele espera o número do index, ou seja sua posição || e depois quantos elementos quer deletar
        Transaction.all.splice(index, 1)

        //Atualizar para remover da tela
        App.reload()  
    },

    //Somar as entradas
    incomes() {
        //Eu preciso somar as entradas depois, somar as saídas e remover das entradas o valor das saídas assim, eu terei o total
        let income = 0

        //Somar as entradas
        //transactions.forEach(function (transaction) {}) = pode usar a arrow no lugar de function e tirar as () se é só 1 argumento
        Transaction.all.forEach(transaction => {
            //Para cada transação, se ela for maior que 0, somar a uma variável e retornar variável
            if (transaction.amount > 0) {
                //income = income + transaction.amount
                income += transaction.amount
            }
        })

        return income
    },

    //Somar as saídas
    expenses() { 
        let expense = 0

        //Somar as saídas
        //transactions.forEach(function (transaction) {}) = pode usar a arrow no lugar de function e tirar as () se é só 1 argumento
        Transaction.all.forEach(transaction => {
            //Para cada transação, se ela for maior que 0 somar a uma variável e retornar variável
            if (transaction.amount < 0) {
                //income = income + transaction.amount
                expense += transaction.amount
            }
        })

        return expense
    },

    total() {
        return Transaction.incomes() + Transaction.expenses()
    }


}

//Document Object Model
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    //(transaction) = transação que quer adicionar | (index) = onde que vai colocar a transação, posição do array que ele vai ficar guardado no nosso objeto
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    //INTERNO DE UMA TRANSAÇÃO
    innerHTMLTransaction(transaction, index) {  

        //Se o amount for maior que 0, ou seja true, ele recebe a classe "income" | green se não recebe "expense" | red, o famoso ternário
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        //Literals ou Crase permite por variáveis dentro dela, Interpolação ${} por variaveis no literals
        const html = ` 
            <td class="description">${transaction.description}</td> 
            <td class="${CSSclass}">${amount}</td>      
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
            </td>
        `
        return html
    },

    //Mostrar pra gente os valores atuais
    updateBalance() { 
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    //Formatação de um valor
    formatAmount(value) {
        //value = Number(value.replace(/\,\./g, "")) * 100
        value = Number(value) * 100

        //Retorno de um valor formatado
        return value
    },

    formatDate(date) {
        //Tratamento de data, porque esta retornando ex: 1999-06-06
        const splittedDate = date.split("-")
        //removeu os " - "
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
        //formato de data correto 06/06/1999, só alterou as posições da array e adicionou com " / "
    },

    //Formatação de regras para a moeda
    formatCurrency(value) {
        //Converte para TIPO número, se esse número for menor que 0 ele recebe signal de negativo, se não, não recebe nenhum sinal 
        const signal = Number(value) < 0 ? "-" : ""

        //Regra de moedas 
        //Converte o que for recebido para o TIPO string (/0/g, "discover") g = é global | troca todos por discover | (/\D/g, "Discover") = Ache só números
        value = String(value).replace(/\D/g, "")

        //Por isso botava o valor real em transactions[] ex: amount 20000(duzentos) / 100 = 200,00 valor oficial, famosa tricks de virgula
        value = Number(value) / 100 

        //(toLocaleString) Funcionalidade que precisa de argumentos, (que local que estou, opções que tenho como objeto, 2 opções style/currency e tipo/real br)
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    //Elemento inteiro 
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    //Valores 
    getValues() {
        //Retornar um objeto 
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }

        //Ou seja, quando acessar Form.getValues() = esta recebendo um objeto com os valores
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()
        
        if (
            //trim() = Serve para fazer uma limpeza dos espaços vazios que existe na sua string
            description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "") {
                // se tiver um vazio entrar no erro
                throw new Error("Por favor, preencha todos os campos")
        } 

    },

    formatValues() {
        let { description, amount, date } = Form.getValues()
        
        amount = Utils.formatAmount(amount) 
    
        date = Utils.formatDate(date)

        //return de um objeto, truque, quando o nome da chave que vou retornar é o mesmo nome da variável não precisa por description:description, sendo assim retornando os dados já formatados 
        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        //Limpar os campos 
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        //Interronpendo o comportamento padrão, para assim realizar as funções criadas
        event.preventDefault()

        try {
            // Verificar se todas as informações foram preenchidas
            Form.validateFields()
            
            //pegar como transaction(nova transação) já formatada
            const transaction = Form.formatValues()

            // Salvar/Adicionar uma transação
            Transaction.add(transaction)

            // Apagar os dados do formulário
            Form.clearFields()
            
            // Fechar Modal
            Modal.close()

        } catch (error) {
            alert(error.message)
        }

    }
}

const App = {
    init() {
        //Alimentando as transações
        //Para cada elemento, ele irá executar uma funcionalidade, adicionando na DOM
        //Transaction.all.forEach((transaction, index) => { 
        //    DOM.addTransaction(transaction, index)
        //}) ou 
        Transaction.all.forEach(DOM.addTransaction)

        //Atualizando parte dos cartões
        DOM.updateBalance()
        
        //Atualizando a localStorage(onde estão guardados os dados)
        Storage.set(Transaction.all)
    },

    reload() {
        //Função para fazer a releitura das coisas
        DOM.clearTransactions()
        App.init()

    },  
    
}

App.init()      //3:03:11 video 3