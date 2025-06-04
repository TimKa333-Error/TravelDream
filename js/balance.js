// Проверяем, авторизован ли пользователь
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
}

// Инициализация переменных
let cardToDelete = null;
let users = JSON.parse(localStorage.getItem('users')) || {};
let userData = users[currentUser.email] || {
    balance: 0,
    transactions: [],
    paymentMethods: []
};

let balance = userData.balance || 0;
let transactions = userData.transactions || [];
let paymentMethods = userData.paymentMethods || [];

// Элементы DOM
const currentBalanceEl = document.getElementById('currentBalance');
const addFundsBtn = document.getElementById('addFundsBtn');
const showHistoryBtn = document.getElementById('showHistoryBtn');
const transactionsHistory = document.getElementById('transactionsHistory');
const transactionsList = document.getElementById('transactionsList');
const methodsList = document.getElementById('methodsList');
const addFundsModal = document.getElementById('addFundsModal');
const closeAddFundsModal = document.getElementById('closeAddFundsModal');
const addFundsForm = document.getElementById('addFundsForm');
const amountInput = document.getElementById('amount');
const paymentOptions = document.getElementById('paymentOptions');
const confirmModal = document.getElementById('confirmModal');
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const addCardModal = document.getElementById('addCardModal');
const closeAddCardModal = document.getElementById('closeAddCardModal');
const addCardForm = document.getElementById('addCardForm');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

function saveUserData() {
    // Обновляем данные пользователя
    userData.balance = balance;
    userData.transactions = transactions;
    userData.paymentMethods = paymentMethods;
    
    // Сохраняем в общий список пользователей
    users[currentUser.email] = userData;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Обновляем текущего пользователя
    localStorage.setItem('currentUser', JSON.stringify(userData));
}

function loadTransactions() {
    if (userData.transactions) {
        try {
            transactions = userData.transactions;
            if (!Array.isArray(transactions)) {
                transactions = [];
                userData.transactions = transactions;
                saveUserData();
            }
        } catch (e) {
            console.error('Error parsing transactions:', e);
            transactions = [];
            userData.transactions = transactions;
            saveUserData();
        }
    } else {
        transactions = [];
        userData.transactions = transactions;
        saveUserData();
    }
}

// Функция загрузки данных профиля 
function loadProfileData() {
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    
    const savedAvatar = localStorage.getItem('profileAvatar') || 
                    userData.avatar || 
                    'https://randomuser.me/api/portraits/men/32.jpg';
    
    // Заполняем данные профиля
    document.getElementById('profileName').textContent = 
        `${userData.firstName} ${userData.lastName}`;
    document.getElementById('profileEmail').textContent = userData.email;
    
    // Устанавливаем аватар с обработкой ошибки
    const avatar = document.getElementById('profileAvatar');
    avatar.src = savedAvatar;
    avatar.onerror = function() {
        this.src = 'https://randomuser.me/api/portraits/men/32.jpg';
        localStorage.setItem('profileAvatar', this.src);
        
        userData.avatar = this.src;
        saveUserData();
    };
}

// Форматирование валюты
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

// При добавлении транзакции сохраняем в localStorage
function addTransaction(transaction) {
    transaction.id = Date.now();
    transaction.timestamp = new Date().toISOString();
    
    transactions.unshift(transaction);
    userData.transactions = transactions;
    saveUserData();
    renderTransactions();
    updateClearButtonVisibility();
}

// Обновление баланса
function updateBalance() {
    currentBalanceEl.textContent = formatCurrency(balance);
    userData.balance = balance;
    saveUserData();
}

// Отображение истории транзакций
function renderTransactions() {
    transactionsList.innerHTML = '';
    
    // Сортируем транзакции по дате (новые сверху)
    const sortedTransactions = [...transactions].sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
        const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
        return dateB - dateA;
    });


    if (sortedTransactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="transaction-item" style="justify-content: center;">
                <p style="color: var(--gray);">Нет операций</p>
            </div>
        `;
        return;
    }
    
    sortedTransactions.forEach(transaction => {
        const transactionEl = document.createElement('div');
        transactionEl.className = 'transaction-item';
        
        const transactionDate = transaction.timestamp ? 
            new Date(transaction.timestamp).toLocaleString('ru-RU') :
            transaction.date;
        
        transactionEl.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-icon">
                    <i class="fas ${transaction.icon || 'fa-exchange-alt'}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transaction.type}</h4>
                    <p>${transactionDate} · ${transaction.method || 'Не указано'}</p>
                </div>
            </div>
            <div class="transaction-amount ${transaction.amount > 0 ? 'positive' : ''}">
                ${transaction.amount > 0 ? '+' : ''}${formatCurrency(Math.abs(transaction.amount))}
            </div>
        `;
        
        transactionsList.appendChild(transactionEl);
        updateClearButtonVisibility();
    });
}

// Функция очистки истории
function clearTransactionsHistory() {
    confirmTitle.textContent = 'Очистить историю операций?';
    confirmMessage.textContent = 'Вы уверены, что хотите удалить всю историю транзакций? Это действие нельзя отменить.';

    const oldHandler = confirmDeleteBtn.onclick;
    
    confirmDeleteBtn.onclick = function() {
        transactions = [];
        userData.transactions = transactions;
        saveUserData();
        renderTransactions();
        confirmModal.style.display = 'none';
        confirmDeleteBtn.onclick = oldHandler;
    };
    
    confirmModal.style.display = 'flex';
    updateClearButtonVisibility();
}

clearHistoryBtn.addEventListener('click', clearTransactionsHistory);

function updateClearButtonVisibility() {
    if (transactions.length === 0) {
        clearHistoryBtn.style.display = 'none';
    } else {
        clearHistoryBtn.style.display = 'inline-flex';
    }
}

// Отображение способов оплаты
function renderPaymentMethods() {
    methodsList.innerHTML = '';
    paymentOptions.innerHTML = '';
    
    if (paymentMethods.length === 0) {
        methodsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-credit-card"></i>
                </div>
                <h4>Нет добавленных карт</h4>
                <p>Добавьте карту для пополнения баланса</p>
                <button class="btn btn-accent" id="addFirstCardBtn">
                    <i class="fas fa-plus"></i> Добавить карту
                </button>
            </div>
        `;
        
        document.getElementById('addFirstCardBtn')?.addEventListener('click', () => {
            addCardModal.style.display = 'flex';
        });
    } else {
        paymentMethods.forEach(method => {
            const methodEl = document.createElement('div');
            methodEl.className = `method-card ${method.isDefault ? 'active' : ''}`;
            methodEl.dataset.id = method.id;
            
            methodEl.innerHTML = `
                <div class="method-info">
                    <div class="method-icon">
                        <i class="fab ${method.icon}"></i>
                    </div>
                    <div class="method-details">
                        <h4>${method.type === 'visa' ? 'Visa' : 'Mastercard'} •••• ${method.last4}</h4>
                        <p>${method.isDefault ? 'Основной способ оплаты' : `Истекает ${method.expires}`}</p>
                    </div>
                </div>
                <button class="btn-remove-method" data-id="${method.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            methodsList.appendChild(methodEl);
            
            const optionEl = document.createElement('label');
            optionEl.className = 'payment-option';
            
            optionEl.innerHTML = `
                <input type="radio" name="paymentMethod" value="${method.id}" ${method.isDefault ? 'checked' : ''}>
                <div class="option-content">
                    <i class="fab ${method.icon}"></i>
                    <span>${method.type === 'visa' ? 'Visa' : 'Mastercard'} •••• ${method.last4}</span>
                </div>
            `;
            
            paymentOptions.appendChild(optionEl);
        });
        
        const addCardBtn = document.createElement('button');
        addCardBtn.className = 'btn btn-outline btn-add-method';
        addCardBtn.innerHTML = '<i class="fas fa-plus"></i> Добавить карту';
        methodsList.appendChild(addCardBtn);
        
        addCardBtn.addEventListener('click', () => {
            addCardModal.style.display = 'flex';
        });
    }
    
    document.querySelectorAll('.btn-remove-method').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const methodId = parseInt(btn.dataset.id);
            confirmCardDelete(methodId);
        });
    });
    
    userData.paymentMethods = paymentMethods;
    saveUserData();
}

// Подтверждение удаления карты
function confirmCardDelete(methodId) {
    const method = paymentMethods.find(m => m.id === methodId);
    if (!method) return;
    
    cardToDelete = methodId;
    
    confirmTitle.textContent = `Удалить ${method.type === 'visa' ? 'Visa' : 'Mastercard'} •••• ${method.last4}?`;
    confirmMessage.textContent = method.isDefault 
        ? 'Это ваша основная карта. Вы уверены, что хотите удалить её?' 
        : 'Вы уверены, что хотите удалить эту карту? Это действие нельзя отменить.';
    
    confirmModal.style.display = 'flex';
}

// Удаление карты
function deletePaymentMethod(methodId) {
    if (paymentMethods.length <= 1) {
        alert('Нельзя удалить последнюю карту. Добавьте новую карту перед удалением этой.');
        return false;
    }
    
    const methodIndex = paymentMethods.findIndex(m => m.id === methodId);
    if (methodIndex === -1) return false;
    
    const wasDefault = paymentMethods[methodIndex].isDefault;
    paymentMethods.splice(methodIndex, 1);
    
    if (wasDefault && paymentMethods.length > 0) {
        paymentMethods[0].isDefault = true;
    }
    
    renderPaymentMethods();
    return true;
}

// Определение типа карты
function detectCardType(cardNumber) {
    const visaPattern = /^4/;
    const mastercardPattern = /^5[1-5]/;
    
    if (visaPattern.test(cardNumber)) return 'visa';
    if (mastercardPattern.test(cardNumber)) return 'mastercard';
    return 'unknown';
}

// Подсветка иконки карты
function highlightCardIcon(cardType) {
    const icons = document.querySelectorAll('.card-icons i');
    
    icons.forEach(icon => {
        icon.style.opacity = '0.3';
        icon.style.transform = 'scale(0.9)';
    });
    
    if (cardType === 'visa') {
        document.querySelector('.fa-cc-visa').style.opacity = '1';
        document.querySelector('.fa-cc-visa').style.transform = 'scale(1.1)';
    } else if (cardType === 'mastercard') {
        document.querySelector('.fa-cc-mastercard').style.opacity = '1';
        document.querySelector('.fa-cc-mastercard').style.transform = 'scale(1.1)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProfileData(); 
    updateBalance();
    loadTransactions(); 
    renderTransactions();
    renderPaymentMethods();
    
    const urlParams = new URLSearchParams(window.location.search);
    const returnTo = urlParams.get('return');
    const pendingBooking = localStorage.getItem('pendingBooking');
    
    if (returnTo && pendingBooking) {
        const returnBtn = document.createElement('button');
        returnBtn.className = 'btn btn-accent';
        returnBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Вернуться к бронированию';
        returnBtn.onclick = function() {
            localStorage.removeItem('pendingBooking');
            window.location.href = 'profile-bookings.html';
        };
        
        document.querySelector('.balance-summary').appendChild(returnBtn);
    }
});

// Показать/скрыть историю операций
showHistoryBtn.addEventListener('click', () => {
    loadTransactions(); 
    renderTransactions();
    const isHidden = transactionsHistory.style.display === 'none' || !transactionsHistory.style.display;
    transactionsHistory.style.display = isHidden ? 'block' : 'none';
    showHistoryBtn.innerHTML = isHidden ? 
        '<i class="fas fa-times"></i> Скрыть историю' : 
        '<i class="fas fa-history"></i> История операций';
});

// Управление модальным окном пополнения
addFundsBtn.addEventListener('click', () => {
    if (paymentMethods.length === 0) {
        alert('Пожалуйста, сначала добавьте карту');
        addCardModal.style.display = 'flex';
        return;
    }
    addFundsModal.style.display = 'flex';
    amountInput.focus();
});

closeAddFundsModal.addEventListener('click', () => {
    addFundsModal.style.display = 'none';
});

addFundsModal.addEventListener('click', (e) => {
    if (e.target === addFundsModal) {
        addFundsModal.style.display = 'none';
    }
});

// Управление модальным окном добавления карты
closeAddCardModal.addEventListener('click', () => {
    addCardModal.style.display = 'none';
});

addCardModal.addEventListener('click', (e) => {
    if (e.target === addCardModal) {
        addCardModal.style.display = 'none';
    }
});

// Управление модальным окном подтверждения удаления
cancelDeleteBtn.addEventListener('click', () => {
    confirmModal.style.display = 'none';
    cardToDelete = null;
});

confirmDeleteBtn.addEventListener('click', () => {
    if (cardToDelete !== null) {
        const success = deletePaymentMethod(cardToDelete);
        if (success) {
            const deletedMethod = paymentMethods.find(m => m.id === cardToDelete) || 
                { type: 'card', last4: '****' };
            
            const newTransaction = {
                id: transactions.length + 1,
                type: 'Удаление карты',
                amount: 0,
                date: new Date().toLocaleDateString('ru-RU'),
                method: `${deletedMethod.type === 'visa' ? 'Visa' : 'Mastercard'} •••• ${deletedMethod.last4}`,
                icon: 'fa-trash-alt'
            };
            
            transactions.unshift(newTransaction);
            userData.transactions = transactions;
            saveUserData();
            renderTransactions();
        }
        
        confirmModal.style.display = 'none';
        cardToDelete = null;
    }
});

confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        confirmModal.style.display = 'none';
        cardToDelete = null;
    }
});

// Обработка пополнения баланса
addFundsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const amount = parseFloat(amountInput.value);
    const paymentMethodId = document.querySelector('input[name="paymentMethod"]:checked').value;
    const paymentMethod = paymentMethods.find(m => m.id === parseInt(paymentMethodId));
    
    if (amount < 10) {
        alert('Минимальная сумма пополнения - $10');
        return;
    }
    
    if (!paymentMethod) {
        alert('Ошибка: выбранный способ оплаты не найден');
        return;
    }
    
    balance += amount;
    updateBalance();
    
    const newTransaction = {
        type: 'Пополнение баланса',
        amount: amount,
        method: `${paymentMethod.type === 'visa' ? 'Visa' : 'Mastercard'} •••• ${paymentMethod.last4}`,
        icon: 'fa-plus-circle',
        source: 'manual'
    };
    
    addTransaction(newTransaction);
    
    addFundsModal.style.display = 'none';
    addFundsForm.reset();
    amountInput.value = '100';
    
    alert(`Баланс успешно пополнен на ${formatCurrency(amount)}`);
});

// Маска для номера карты
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
        e.target.value = parts.join(' ');
    } else {
        e.target.value = value;
    }
    
    const cardType = detectCardType(value);
    highlightCardIcon(cardType);
});

// Маска для срока действия
document.getElementById('cardExpiry').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
});

// Маска для CVC
document.getElementById('cardCvc').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/[^0-9]/gi, '');
});

// Обработка формы добавления карты
addCardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCvc = document.getElementById('cardCvc').value;
    const cardName = document.getElementById('cardName').value;
    const makeDefault = document.getElementById('makeDefault').checked;
    const cardType = detectCardType(cardNumber);
    
    if (cardNumber.length < 16) {
        alert('Номер карты должен содержать 16 цифр');
        return;
    }
    
    if (!cardExpiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
        alert('Введите корректный срок действия (MM/ГГ)');
        return;
    }
    
    if (cardCvc.length < 3) {
        alert('CVC/CVV должен содержать 3 цифры');
        return;
    }
    
    if (cardName.length < 2) {
        alert('Введите имя владельца карты');
        return;
    }
    
    const newCard = {
        id: paymentMethods.length > 0 ? Math.max(...paymentMethods.map(m => m.id)) + 1 : 1,
        type: cardType === 'visa' ? 'visa' : 'mastercard',
        last4: cardNumber.slice(-4),
        isDefault: paymentMethods.length === 0 || makeDefault,
        expires: cardExpiry,
        icon: cardType === 'visa' ? 'fa-cc-visa' : 'fa-cc-mastercard'
    };
    
    if (newCard.isDefault) {
        paymentMethods.forEach(method => method.isDefault = false);
    }
    
    paymentMethods.push(newCard);
    userData.paymentMethods = paymentMethods;
    saveUserData();
    renderPaymentMethods();
    
    addCardModal.style.display = 'none';
    addCardForm.reset();
    
    alert(`Карта •••• ${newCard.last4} успешно добавлена`);
});

window.addEventListener('beforeunload', function() {
    saveUserData();
});