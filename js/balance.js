if (!localStorage.getItem('userBalance')) {
    localStorage.setItem('userBalance', '0');
    localStorage.setItem('transactions', JSON.stringify([]));
    localStorage.setItem('paymentMethods', JSON.stringify([]));
}

// Инициализация переменных
let cardToDelete = null;
let balance = parseFloat(localStorage.getItem('userBalance')) || 0;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let paymentMethods = JSON.parse(localStorage.getItem('paymentMethods')) || [];

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


function loadTransactions() {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        try {
            transactions = JSON.parse(savedTransactions);
            // Проверка на случай поврежденных данных
            if (!Array.isArray(transactions)) {
                transactions = [];
                localStorage.setItem('transactions', JSON.stringify([]));
            }
        } catch (e) {
            console.error('Error parsing transactions:', e);
            transactions = [];
            localStorage.setItem('transactions', JSON.stringify([]));
        }
    } else {
        transactions = [];
        localStorage.setItem('transactions', JSON.stringify([]));
    }
}
loadTransactions();

    // Функция загрузки данных профиля 
    function loadProfileData() {
        // Получаем данные 
        const userData = JSON.parse(localStorage.getItem('userData'));
        
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
            // Если аватар не загрузился, ставим дефолтный и сохраняем
            this.src = 'https://randomuser.me/api/portraits/men/32.jpg';
            localStorage.setItem('profileAvatar', this.src);
            
            // Обновляем в userData
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            userData.avatar = this.src;
            localStorage.setItem('userData', JSON.stringify(userData));
        };
    }

// Форматирование валюты
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

// При добавлении транзакции сохраняем в localStorage
function addTransaction(transaction) {
    // Генерируем уникальный ID с временной меткой
    transaction.id = Date.now();
    transaction.timestamp = new Date().toISOString(); // Добавляем точное время
    
    transactions.unshift(transaction);
    saveTransactions();
    renderTransactions();
    updateClearButtonVisibility();
}

function saveTransactions() {
    try {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (e) {
        console.error('Error saving transactions:', e);
        // Попробуем сохранить только последние 50 транзакций, если не хватает места
        if (e.name === 'QuotaExceededError') {
            const reducedTransactions = transactions.slice(0, 50);
            localStorage.setItem('transactions', JSON.stringify(reducedTransactions));
        }
    }
}

// Обновление баланса
function updateBalance() {
    currentBalanceEl.textContent = formatCurrency(balance);
    localStorage.setItem('userBalance', balance.toString());
}

// Отображение истории транзакций
function renderTransactions() {
    transactionsList.innerHTML = '';
    
    // Сортируем транзакции по времени (новые сначала)
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
    );

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
        
        // Форматируем дату более точно
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
        localStorage.setItem('transactions', JSON.stringify([]));
        renderTransactions();
        confirmModal.style.display = 'none';
        confirmDeleteBtn.onclick = oldHandler; // Восстанавливаем старый обработчик
    };
    
    confirmModal.style.display = 'flex';
    updateClearButtonVisibility();
}

// Назначаем обработчик для кнопки очистки
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
        // Рендерим существующие карты
        paymentMethods.forEach(method => {
            // Карточка в списке методов оплаты
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
            
            // Опция в модальном окне пополнения
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
        
        // Добавляем кнопку "Добавить карту" внизу списка
        const addCardBtn = document.createElement('button');
        addCardBtn.className = 'btn btn-outline btn-add-method';
        addCardBtn.innerHTML = '<i class="fas fa-plus"></i> Добавить карту';
        methodsList.appendChild(addCardBtn);
        
        addCardBtn.addEventListener('click', () => {
            addCardModal.style.display = 'flex';
        });
    }
    
    // Назначаем обработчики для кнопок удаления
    document.querySelectorAll('.btn-remove-method').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const methodId = parseInt(btn.dataset.id);
            confirmCardDelete(methodId);
        });
    });
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
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
    
    // Если удалили карту по умолчанию, назначаем новую
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

    // Обработчики событий
    document.addEventListener('DOMContentLoaded', () => {
        loadProfileData(); 
        updateBalance();
        loadTransactions(); 
        renderTransactions();
        renderPaymentMethods();
        
        // Проверяем параметры URL для возврата
        const urlParams = new URLSearchParams(window.location.search);
        const returnTo = urlParams.get('return');
        const pendingBooking = localStorage.getItem('pendingBooking');
        
        if (returnTo && pendingBooking) {
            // Показываем сообщение о необходимости оплаты
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
    
    // Обновляем баланс
    balance += amount;
    updateBalance();
    
    // Добавляем транзакцию с дополнительными метаданными
    const newTransaction = {
        type: 'Пополнение баланса',
        amount: amount,
        method: `${paymentMethod.type === 'visa' ? 'Visa' : 'Mastercard'} •••• ${paymentMethod.last4}`,
        icon: 'fa-plus-circle',
        source: 'manual' // Добавляем источник операции
    };
    
    addTransaction(newTransaction); // Используем нашу новую функцию
    
    // Закрываем модальное окно
    addFundsModal.style.display = 'none';
    addFundsForm.reset();
    amountInput.value = '100';
    
    // Уведомление
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
    
    // Определяем тип карты
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
    
    // Валидация
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
    
    // Создаем новую карту
    const newCard = {
        id: paymentMethods.length + 1,
        type: cardType === 'visa' ? 'visa' : 'mastercard',
        last4: cardNumber.slice(-4),
        isDefault: paymentMethods.length === 0 || makeDefault, // Первая карта всегда основная
        expires: cardExpiry,
        icon: cardType === 'visa' ? 'fa-cc-visa' : 'fa-cc-mastercard'
    };
    
    // Если новая карта - основная, снимаем флаг с других карт
    if (newCard.isDefault) {
        paymentMethods.forEach(method => method.isDefault = false);
    }
    
    // Добавляем карту
    paymentMethods.push(newCard);
    renderPaymentMethods();
    
    // Закрываем модальное окно
    addCardModal.style.display = 'none';
    addCardForm.reset();
    
    // Показываем уведомление
    alert(`Карта •••• ${newCard.last4} успешно добавлена`);

    document.addEventListener('DOMContentLoaded', function() {
        // Проверяем параметры URL для возврата
        const urlParams = new URLSearchParams(window.location.search);
        const returnTo = urlParams.get('return');
        const pendingBooking = localStorage.getItem('pendingBooking');
        
        if (returnTo && pendingBooking) {
            // Показываем сообщение о необходимости оплаты
            const returnBtn = document.createElement('button');
            returnBtn.className = 'btn btn-accent';
            returnBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Вернуться к бронированию';
            returnBtn.onclick = function() {
                localStorage.removeItem('pendingBooking');
                window.location.href = 'profile-bookings.html';
            };
            
            document.querySelector('.balance-summary').appendChild(returnBtn);
        }
        window.addEventListener('beforeunload', function() {
            localStorage.setItem('transactions', JSON.stringify(transactions));
            localStorage.setItem('userBalance', balance.toString());
            localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
        });

        window.addEventListener('pagehide', () => {
            saveTransactions();
        });
        
        window.addEventListener('beforeunload', () => {
            saveTransactions();
        });
    });
});