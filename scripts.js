const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');   
const dummyTransactions = [
    {id:1, text:'Flower', amount:-20, date:'2023-10-01'},
    {id:2, text:'Salary', amount:300, date:'2023-10-02'},
    {id:3, text:'Book', amount:-10, date:'2023-10-03'},
    {id:4, text:'Camera', amount:150, date:'2023-10-04'},
];
let transactions = JSON.parse(localStorage.getItem('transactions')) || dummyTransactions;
function addTransactionDOM(transaction){
    if (!transaction.date) {
        transaction.date = new Date().toISOString().split('T')[0];
    }
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <span class="date">${transaction.date}</span>
    `;
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'x';
    deleteBtn.addEventListener('click', () => removeTransaction(transaction.id));
    item.appendChild(deleteBtn);
    list.appendChild(item);
}
function updateValues(){
    const amounts = transactions.map(transaction => transaction.amount);    
    const total = amounts.reduce((acc,item) => (acc += item),0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc,item) => (acc += item),0).toFixed(2);
    const expense = (
        amounts
        .filter(item => item < 0)
        .reduce((acc,item) => (acc += item),0) * -1
    ).toFixed(2);
    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}        
function removeTransaction(id){
    console.log('Removing transaction with id:', id);
    transactions = transactions.filter(transaction => transaction.id !== id);
    console.log('Transactions after filter:', transactions);
    updateValues();
    updateLocalStorage();
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
}
function addTransaction(e){
    e.preventDefault();
    if(text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
            date: new Date().toISOString().split('T')[0],
        };
        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        text.value = '';
        amount.value = '';
    }
}

function updateLocalStorage(){
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function generateID(){
    return Math.floor(Math.random() * 100000000);
}

function init(){
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener('submit', addTransaction);
