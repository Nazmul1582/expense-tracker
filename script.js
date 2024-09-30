// Get references to DOM elements
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const historySection = document.getElementById('history-section');

let transactions = [];
let isEditing = false;
let currentTransactionId = null;

// Add transaction or edit
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please enter a description and amount');
        return;
    }

    const transaction = {
        id: isEditing ? currentTransactionId : generateID(),
        text: text.value,
        amount: +amount.value
    };

    if (isEditing) {
        // Update the existing transaction
        const index = transactions.findIndex(tran => tran.id === currentTransactionId);
        transactions[index] = transaction;
        isEditing = false;
        currentTransactionId = null;
        form.querySelector('.btn').innerText = 'Add Transaction';
    } else {
        // Add new transaction
        transactions.push(transaction);
    }

    // Clear form fields after adding/updating
    text.value = '';
    amount.value = '';

    updateUI();
    toggleHistoryVisibility();
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
    const sign = transaction.amount > 0 ? '+' : '-';
    const item = document.createElement('li');

    item.classList.add(transaction.amount > 0 ? 'plus' : 'minus');
    item.innerHTML = `
        ${transaction.text} 
        <span>${sign}৳${Math.abs(transaction.amount).toFixed(2)}</span>
        <div class="actions">
            <button class="edit-btn" onclick="editTransaction(${transaction.id})"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})"><i class="fas fa-trash"></i></button>
        </div>
    `;

    transactionList.appendChild(item);
}

// Edit transaction
function editTransaction(id) {
    const transaction = transactions.find(tran => tran.id === id);
    text.value = transaction.text;
    amount.value = transaction.amount;
    isEditing = true;
    currentTransactionId = id;
    form.querySelector('.btn').innerText = 'Update Transaction';
}

// Remove transaction
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateUI();
    toggleHistoryVisibility();
}

// Update balance, income, and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const incomeAmount = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expenseAmount = (
        amounts
            .filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `৳${total}`;
    income.innerText = `৳${incomeAmount}`;
    expense.innerText = `৳${expenseAmount}`;
}

// Initialize app
function init() {
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
    toggleHistoryVisibility();
}

// Toggle visibility of history section
function toggleHistoryVisibility() {
    if (transactions.length === 0) {
        historySection.classList.add('hidden');
    } else {
        historySection.classList.remove('hidden');
    }
}

// Update the UI after adding, editing, or deleting transactions
function updateUI() {
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Event listener for form submission
form.addEventListener('submit', addTransaction);

// Initialize the app
init();
