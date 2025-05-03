const App = {
    bookings: [],
    currentBooking: null,
    
    init: function() {
        this.loadProfile();
        this.loadBookingsFromStorage();
        this.setupEventListeners();
        this.loadBookings('current');

        // Проверяем успешную оплату
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment') === 'success') {
            this.markLastBookingAsPaid();
            window.history.replaceState({}, '', 'profile-bookings.html');
        }
    },

    loadProfile: function() {
        // Получаем данные из единого источника (userData)
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
    },

    markLastBookingAsPaid: function() {
        const lastUnpaidBooking = this.bookings.find(b => b.status === 'confirmed');
        if (lastUnpaidBooking) {
            lastUnpaidBooking.status = 'completed';
            localStorage.setItem('bookings', JSON.stringify(this.bookings));
            this.loadBookings('current');
        }
    },
    
    loadBookingsFromStorage: function() {
        let storedBookings = localStorage.getItem('bookings');
        
        if (!storedBookings || storedBookings === "undefined") {
           
            this.bookings = [];
            return;
        }
        
        try {
            this.bookings = JSON.parse(storedBookings) || [];
        } catch (e) {
            console.error("Ошибка при разборе данных бронирований:", e);
            this.bookings = [];
        }
    },
    
    setupEventListeners: function() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
        
        document.getElementById('closeBookingModal')?.addEventListener('click', () => {
            this.closeModal('bookingDetailsModal');
        });
        
        document.getElementById('cancelBookingDetails')?.addEventListener('click', () => {
            this.closeModal('bookingDetailsModal');
        });
        
        document.getElementById('closeConfirmCancelModal')?.addEventListener('click', () => {
            this.closeModal('confirmCancelModal');
        });
        
        document.getElementById('cancelCancelBooking')?.addEventListener('click', () => {
            this.closeModal('confirmCancelModal');
        });
        
        document.getElementById('confirmCancelBooking')?.addEventListener('click', () => {
            this.cancelBooking();
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('bookingDetailsModal')) {
                this.closeModal('bookingDetailsModal');
            }
            if (e.target === document.getElementById('confirmCancelModal')) {
                this.closeModal('confirmCancelModal');
            }
        });
    },
    
    switchTab: function(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            }
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            if (content.id === tab) {
                content.classList.add('active');
            }
        });
        
        this.loadBookings(tab);
    },
    
    loadBookings: function(tab) {
        const filteredBookings = this.bookings.filter(b => {
            if (!b || !b.status) return false;
            if (tab === 'current') return b.status === 'confirmed';
            if (tab === 'completed') return b.status === 'completed';
            if (tab === 'cancelled') return b.status === 'cancelled';
            return false;
        });
        
        const tabContent = document.getElementById(tab);
        
        if (filteredBookings.length > 0) {
            tabContent.innerHTML = filteredBookings.map(booking => this.createBookingCard(booking)).join('');
            this.setupBookingEventListeners();
        } else {
            tabContent.innerHTML = this.createEmptyState(tab);
        }
    },
    
    createBookingCard: function(booking) {
        if (!booking || !booking.id || !booking.title) {
            return '';
        }
        
        const price = booking.price || 0;
        const people = booking.people || 1;
        // Используем сохраненную текстовую цену за человека, если она есть
        const pricePerText = booking.pricePerText || `${Math.round(price / people)} $/чел`;
        const hotel = booking.hotel || 'Отель не указан';
        const image = booking.image || 'https://via.placeholder.com/150';
        const date = booking.date || 'Даты не указаны';
        const duration = booking.duration || 0;
        
        return `
            <div class="booking-card" data-id="${booking.id}">
                <div class="booking-header">
                    <div class="booking-id">Бронирование №${booking.id}</div>
                    <div class="booking-status ${booking.status}">
                        ${this.getStatusText(booking.status)}
                    </div>
                </div>
                <div class="booking-content">
                    <div class="booking-image">
                        <img src="${image}" alt="${booking.title}">
                    </div>
                    <div class="booking-details">
                        <h3>${booking.title}</h3>
                        <div class="booking-meta">
                            <div class="meta-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${date} (${duration} ${this.getDaysText(duration)})</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-users"></i>
                                <span>${people} ${this.getPeopleText(people)}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-hotel"></i>
                                <span>${hotel}</span>
                            </div>
                        </div>
                    </div>
                    <div class="booking-price">
                        <div class="price-total">${this.formatCurrency(price)}</div>
                        <div class="price-per">${pricePerText}</div>
                    </div>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-outline btn-details">
                        <i class="fas fa-info-circle"></i> Подробности
                    </button>
                    ${booking.status === 'confirmed' ? `
                    <button class="btn btn-success btn-pay">
                        <i class="fas fa-credit-card"></i> Оплатить
                    </button>
                    <button class="btn btn-outline btn-cancel">
                        <i class="fas fa-times"></i> Отменить
                    </button>
                    ` : booking.status === 'completed' ? `
                    <button class="btn btn-success" disabled>
                        <i class="fas fa-check"></i> Оплачено
                    </button>
                    <button class="btn btn-outline btn-delete-completed" title="Удалить тур">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : booking.status === 'cancelled' ? `
                    <button class="btn btn-outline btn-delete-cancelled" title="Удалить тур">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    // Метод для удаления отмененных туров
    deleteCancelledBooking: function(e) {
        const bookingId = e.target.closest('.booking-card').dataset.id;
        if (confirm('Вы уверены, что хотите удалить этот отмененный тур? Действие нельзя отменить.')) {
            this.bookings = this.bookings.filter(b => b.id !== bookingId);
            localStorage.setItem('bookings', JSON.stringify(this.bookings));
            this.loadBookings('cancelled');
        }
    },
    // Функция для склонения "дней"
    getDaysText: function(days) {
        days = days || 0;
        const lastDigit = days % 10;
        const lastTwoDigits = days % 100;
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'дней';
        if (lastDigit === 1) return 'день';
        if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
        return 'дней';
    },

    // Метод для удаления оплаченных туров
    deleteCompletedBooking: function(e) {
        const bookingId = e.target.closest('.booking-card').dataset.id;
        if (confirm('Вы уверены, что хотите удалить этот оплаченный тур? Действие нельзя отменить.')) {
            this.bookings = this.bookings.filter(b => b.id !== bookingId);
            localStorage.setItem('bookings', JSON.stringify(this.bookings));
            this.loadBookings('completed');
        }
    },
    
    createEmptyState: function(tab) {
        const icons = {
            'current': 'suitcase',
            'completed': 'check-circle',
            'cancelled': 'ban'
        };
        
        const titles = {
            'current': 'Нет текущих бронирований',
            'completed': 'Нет оплаченных бронирований',
            'cancelled': 'Нет отмененных бронирований'
        };
        
        const texts = {
            'current': 'Здесь будут отображаться ваши активные бронирования',
            'completed': 'Здесь будут отображаться ваши оплаченные туры',
            'cancelled': 'Здесь будут отображаться ваши отмененные бронирования'
        };
        
        return `
            <div class="empty-state">
                <i class="fas fa-${icons[tab]}"></i>
                <h3>${titles[tab]}</h3>
                <p>${texts[tab]}</p>
                ${tab === 'current' ? '<a href="tours.html" class="btn btn-primary">Найти тур</a>' : ''}
            </div>
        `;
    },
    
    setupBookingEventListeners: function() {
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', (e) => this.showBookingDetails(e));
        });
        
        document.querySelectorAll('.btn-pay').forEach(btn => {
            btn.addEventListener('click', (e) => this.processPayment(e));
        });
        
        document.querySelectorAll('.btn-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => this.showCancelConfirmation(e));
        });
        
        document.querySelectorAll('.btn-delete-completed').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteCompletedBooking(e));
        });

        document.querySelectorAll('.btn-delete-cancelled').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteCancelledBooking(e));
        });
    },
    
    showBookingDetails: function(e) {
        const bookingId = e.target.closest('.booking-card').dataset.id;
        const booking = this.bookings.find(b => b.id === bookingId);
        
        if (!booking) return;
        
        const price = booking.price || 0;
        const people = booking.people || 1;
        // Используем сохраненную текстовую цену за человека
        const pricePerText = booking.pricePerText || `${Math.round(price / people)} $/чел`;
        const hotel = booking.hotel || 'Не указан';
        const image = booking.image || 'https://via.placeholder.com/600x400';
        
        document.getElementById('bookingDetailsContent').innerHTML = `
            <div class="booking-details-modal">
                <div class="booking-image-large">
                    <img src="${image}" alt="${booking.title}">
                </div>
                <h3>${booking.title}</h3>
                <div class="details-grid">
                    <div><strong>Номер бронирования:</strong></div>
                    <div>${booking.id}</div>
                    
                    <div><strong>Статус:</strong></div>
                    <div class="booking-status ${booking.status}">${this.getStatusText(booking.status)}</div>
                    
                    <div><strong>Даты:</strong></div>
                    <div>${booking.date || 'Не указаны'} (${booking.duration || 0} дней)</div>
                    
                    <div><strong>Участники:</strong></div>
                    <div>${people} ${this.getPeopleText(people)}</div>
                    
                    <div><strong>Отель:</strong></div>
                    <div>${hotel}</div>
                    
                    <div><strong>Стоимость:</strong></div>
                    <div>${this.formatCurrency(price)} (${pricePerText})</div>
                </div>
                ${booking.description ? `<div class="booking-description"><p>${booking.description}</p></div>` : ''}
            </div>
        `;
        
        this.openModal('bookingDetailsModal');
    },
    
    showCancelConfirmation: function(e) {
        this.currentBooking = e.target.closest('.booking-card').dataset.id;
        this.openModal('confirmCancelModal');
    },
    
    cancelBooking: function() {
        if (!this.currentBooking) return;
        
        this.bookings = this.bookings.map(b => 
            b.id === this.currentBooking ? {...b, status: 'cancelled'} : b
        );
        
        localStorage.setItem('bookings', JSON.stringify(this.bookings));
        this.loadBookings('current');
        this.closeModal('confirmCancelModal');
        alert('Бронирование отменено');
        
        this.currentBooking = null;
    },
    
    deleteBooking: function(e) {
        const bookingId = e.target.closest('.booking-card').dataset.id;
        if (confirm('Вы уверены, что хотите удалить это бронирование? Это действие нельзя отменить.')) {
            this.bookings = this.bookings.filter(b => b.id !== bookingId);
            localStorage.setItem('bookings', JSON.stringify(this.bookings));
            this.loadBookings('cancelled');
        }
    },
    
    processPayment: function(e) {
        const bookingId = e.target.closest('.booking-card').dataset.id;
        const booking = this.bookings.find(b => b.id === bookingId);
        
        if (!booking) return;
        
        // Загружаем баланс из localStorage
        const balance = parseFloat(localStorage.getItem('userBalance') || 0);
        const price = booking.price || 0;
        
        if (balance < price) {
            if (confirm('Недостаточно средств на балансе. Хотите пополнить баланс?')) {
                // Сохраняем ID бронирования для возврата
                localStorage.setItem('pendingBooking', bookingId);
                window.location.href = 'balance.html?return=bookings';
            }
            return;
        }
        
        // Списываем средства
        const newBalance = balance - price;
        localStorage.setItem('userBalance', newBalance.toString());
        
        // Обновляем статус бронирования
        booking.status = 'completed';
        localStorage.setItem('bookings', JSON.stringify(this.bookings));
        
        // Добавляем транзакцию в историю
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        transactions.unshift({
        id: Date.now(),
        type: 'Оплата тура: ' + booking.title,
        amount: -price,
        date: new Date().toLocaleDateString('ru-RU'),
        method: 'Списание с баланса',
        icon: 'fa-plane'
        });
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        // Обновляем отображение
        this.loadBookings('current');
        alert('Оплата прошла успешно! Спасибо за покупку.');
    },
    
    openModal: function(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    },
    
    closeModal: function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    },
    
    getStatusText: function(status) {
        const statuses = {
            'confirmed': 'Подтверждено',
            'completed': 'Оплачено',
            'cancelled': 'Отменено'
        };
        return statuses[status] || status;
    },
    
    getPeopleText: function(count) {
        count = count || 1;
        const lastDigit = count % 10;
        if (count >= 11 && count <= 19) return 'человек';
        if (lastDigit === 1) return 'человек';
        if (lastDigit >= 2 && lastDigit <= 4) return 'человека';
        return 'человек';
    },
    
    formatCurrency: function(amount) {
        // Проверяем, что amount - число
        amount = parseFloat(amount);
        if (isNaN(amount)) {
            amount = 0;
        }
        // Округляем до целых
        amount = Math.round(amount);
        // Форматируем с разделителями тысяч
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' $';
    }
    
};

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});