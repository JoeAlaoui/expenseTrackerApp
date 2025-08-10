

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

function addIncome() {
    const description = incomeDescriptionInput.value.trim();
    const amount = parseFloat(incomeAmountInput.value.trim());
    const date = incomeDateInput.value;

    if (description === '' || isNaN(amount) || amount <= 0 || !date) {
        alert('Please enter a valid income description, date and amount.');
        return;
    }

    addTransaction(description, 'Income', amount, date, 'Income');
    showNotification('Income added successfully!', 'Income');
    updateSummary();
    clearInputs();
}

function addExpense() {
    const description = expenseDescriptionInput.value.trim();
    const category = expenseCategoryInput.value;
    const amount = parseFloat(expenseAmountInput.value.trim());
    const date = expenseDateInput.value;

    if (description === '' || isNaN(amount) || amount <= 0 || !date) {
        alert('Please enter a valid expense description, date and amount.');
        return;
    }

    addTransaction(description, category, amount, date, 'Expense');
    showNotification('Expense added successfully!', 'Expense');
    updateSummary();
    clearInputs();
}

function addTransaction(description, category, amount, date, type) {
    const transactionRow = document.createElement('tr');
    transactionRow.innerHTML = `
        <td>${description}</td>
        <td>${category}</td>
        <td>${amount.toFixed(2)}</td>
        <td>${type}</td>
        <td>${date}</td>
        <td><button class="delete-btn">Delete</button></td>
    `;
    transactionList.appendChild(transactionRow);

    transactionRow.querySelector('.delete-btn').addEventListener('click', function() {
        transactionRow.remove();
        updateSummary();
    });
}

function updateSummary() {
    let totalExpenses = 0;
    let totalIncomes = 0;

    const transactions = transactionList.querySelectorAll('tr');
    transactions.forEach(function(transaction) {
        const amount = parseFloat(transaction.children[2].textContent);
        const type = transaction.children[3].textContent;
        if (type === 'Income') {
            totalIncomes += amount;
        } else {
            totalExpenses += amount;
        }
    });

    totalExpense.textContent = totalExpenses.toFixed(2);
    totalIncome.textContent = totalIncomes.toFixed(2);
    balance.textContent = (totalIncomes - totalExpenses).toFixed(2);

     const currentBalance = totalIncomes - totalExpenses;
    balance.textContent = currentBalance.toFixed(2);

    // Apply positive/negative class
    if (currentBalance >= 0) {
        balance.classList.remove('negative');
        balance.classList.add('positive');
    } else {
        balance.classList.remove('positive');
        balance.classList.add('negative');
    }
}

function clearInputs() {
    incomeDescriptionInput.value = '';
    incomeAmountInput.value = '';
    incomeDateInput.value = '';
    expenseDescriptionInput.value = '';
    expenseCategoryInput.value = 'housing';
    expenseAmountInput.value = '';
    expenseDateInput.value = '';
}

function showNotification(message, type) {
    const notification = document.getElementById(`notification${type}`);
    notification.textContent = message;
    notification.classList.remove('hidden');

    setTimeout(function() {
        notification.classList.add('hidden');
    }, 2000); // Notification will disappear after 2 seconds
}