const incomeDescriptionInput = document.getElementById('income-description');
const incomeAmountInput = document.getElementById('income-amount');
const incomeDateInput = document.getElementById('income-date');

const expenseDescriptionInput = document.getElementById('expense-description');
const expenseCategoryInput = document.getElementById('expense-category');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseDateInput = document.getElementById('expense-date');

const transactionList = document.getElementById('transaction-history');
const totalExpense = document.getElementById('total-expense');
const totalIncome = document.getElementById('total-income');
const balance = document.getElementById('balance');

// Save transaction to localStorage
function saveTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Display transaction in table
function displayTransaction(transaction) {
    const transactionRow = document.createElement('tr');
    transactionRow.innerHTML = `
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td>${transaction.amount.toFixed(2)}</td>
        <td>${transaction.type}</td>
        <td>${transaction.date}</td>
        <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
    `;
    transactionList.appendChild(transactionRow);

    transactionRow.querySelector('.delete-btn').addEventListener('click', function() {
        transactionRow.remove();
        removeTransaction(transaction);
        updateSummary();
    });
}

// Add income
function addIncome() {
    const description = incomeDescriptionInput.value.trim();
    const amount = parseFloat(incomeAmountInput.value.trim());
    const date = incomeDateInput.value;

    if (description === '' || isNaN(amount) || amount <= 0 || !date) {
        alert('Please enter a valid income description, date and amount.');
        return;
    }

    const transaction = {
        description: description,
        category: 'Income',
        amount: amount,
        date: date,
        type: 'Income'
    };

    saveTransaction(transaction);
    displayTransaction(transaction);
    showNotification('Income added successfully!', 'Income');
    updateSummary();
    clearInputs();
}

// Add expense
function addExpense() {
    const description = expenseDescriptionInput.value.trim();
    const category = expenseCategoryInput.value;
    const amount = parseFloat(expenseAmountInput.value.trim());
    const date = expenseDateInput.value;

    if (description === '' || isNaN(amount) || amount <= 0 || !date) {
        alert('Please enter a valid expense description, date and amount.');
        return;
    }

    const transaction = {
        description: description,
        category: category,
        amount: amount,
        date: date,
        type: 'Expense'
    };

    saveTransaction(transaction);
    displayTransaction(transaction);
    showNotification('Expense added successfully!', 'Expense');
    updateSummary();
    clearInputs();
}

// Remove transaction from localStorage
function removeTransaction(transactionToRemove) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(function(transaction) {
        return !(transaction.description === transactionToRemove.description &&
                 transaction.amount === transactionToRemove.amount &&
                 transaction.category === transactionToRemove.category &&
                 transaction.date === transactionToRemove.date &&
                 transaction.type === transactionToRemove.type);
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Load all transactions from localStorage and display them
function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactionList.innerHTML = '';
    transactions.forEach(function(transaction) {
        displayTransaction(transaction);
    });
    updateSummary();
}

// Update summary totals
function updateSummary() {
    let totalExpenses = 0;
    let totalIncomes = 0;

    const rows = transactionList.querySelectorAll('tr');
    rows.forEach(function(row) {
        const amount = parseFloat(row.children[2].textContent);
        const type = row.children[3].textContent;
        if (type === 'Income') {
            totalIncomes += amount;
        } else {
            totalExpenses += amount;
        }
    });

    totalExpense.textContent = totalExpenses.toFixed(2);
    totalIncome.textContent = totalIncomes.toFixed(2);

    const currentBalance = totalIncomes - totalExpenses;
    balance.textContent = currentBalance.toFixed(2);

    if (currentBalance >= 0) {
        balance.classList.remove('negative');
        balance.classList.add('positive');
    } else {
        balance.classList.remove('positive');
        balance.classList.add('negative');
    }
}

// Clear input fields
function clearInputs() {
    incomeDescriptionInput.value = '';
    incomeAmountInput.value = '';
    incomeDateInput.value = '';
    expenseDescriptionInput.value = '';
    expenseCategoryInput.value = 'housing';
    expenseAmountInput.value = '';
    expenseDateInput.value = '';
}

// Show notification
function showNotification(message, type) {
    const notification = document.getElementById(`notification${type}`);
    notification.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(function() {
        notification.classList.add('hidden');
    }, 2000);
}

// Focus on income description when page loads
window.addEventListener('load', function() {
    loadTransactions();
    incomeDescriptionInput.focus();
});