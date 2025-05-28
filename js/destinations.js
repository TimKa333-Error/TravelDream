    // Данные о направлениях
const destinationsData = [
    // Страница 1
    [
        {
            id: 1,
            title: "Турция",
            description: "Солнечные пляжи",
            price: 450,
            continent: "europe",
            season: "summer",
            type: "beach",
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Европа/Азия"
        },
        {
            id: 2,
            title: "Италия",
            description: "Романтика Венеции",
            price: 700,
            continent: "europe",
            season: "spring",
            type: "excursion",
            image: "https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Европа"
        },
        {
            id: 3,
            title: "Таиланд",
            description: "Тропические острова",
            price: 600,
            continent: "asia",
            season: "winter",
            type: "beach",
            image: "https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Азия"
        },
        {
            id: 4,
            title: "ОАЭ",
            description: "Роскошные отели",
            price: 800,
            continent: "asia",
            season: "winter",
            type: "beach",
            image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Азия"
        },
        {
            id: 5,
            title: "Греция",
            description: "Античные руины",
            price: 550,
            continent: "europe",
            season: "summer",
            type: "beach",
            image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Европа"
        },
        {
            id: 6,
            title: "Мальдивы",
            description: "Райские острова",
            price: 1200,
            continent: "asia",
            season: "winter",
            type: "beach",
            image: "https://pandatur.md/files/31e6b9ef20ecf0317414e5a257dc0241.webp",
            badge: "Азия"
        }
    ],
    // Страница 2
    [
        {
            id: 7,
            title: "Франция",
            description: "Париж и Лазурный берег",
            price: 750,
            continent: "europe",
            season: "summer",
            type: "excursion",
            image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Европа"
        },
        {
            id: 8,
            title: "Египет",
            description: "Пирамиды и Красное море",
            price: 400,
            continent: "africa",
            season: "winter",
            type: "beach",
            image: "https://avatars.mds.yandex.net/i?id=0a8522862042f0469c968fdf11dba5a8_l-8507274-images-thumbs&n=13",
            badge: "Африка"
        },
        {
            id: 9,
            title: "Испания",
            description: "Барселона и Коста-Брава",
            price: 650,
            continent: "europe",
            season: "summer",
            type: "beach",
            image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Европа"
        },
        {
            id: 10,
            title: "Вьетнам",
            description: "Бухта Халонг",
            price: 500,
            continent: "asia",
            season: "winter",
            type: "beach",
            image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Азия"
        },
        {
            id: 11,
            title: "Бали",
            description: "Джунгли и пляжи",
            price: 900,
            continent: "asia",
            season: "summer",
            type: "beach",
            image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Азия"
        },
        {
            id: 12,
            title: "Чехия",
            description: "Прага и замки",
            price: 550,
            continent: "europe",
            season: "spring",
            type: "excursion",
            image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Европа"
        }
    ],
    // Страница 3
    [
        {
            id: 13,
            title: "Япония",
            description: "Токио и Фудзияма",
            price: 950,
            continent: "asia",
            season: "spring",
            type: "excursion",
            image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Азия"
        },
        {
            id: 14,
            title: "Куба",
            description: "Гавана и пляжи",
            price: 700,
            continent: "america",
            season: "winter",
            type: "beach",
            image: "https://images.unsplash.com/photo-1514897575457-c4db467cf78e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Америка"
        },
        {
            id: 15,
            title: "Норвегия",
            description: "Фьорды и северное сияние",
            price: 850,
            continent: "europe",
            season: "winter",
            type: "excursion",
            image: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Европа"
        },
        {
            id: 16,
            title: "Мексика",
            description: "Канкун и пирамиды",
            price: 750,
            continent: "america",
            season: "winter",
            type: "beach",
            image: "https://i.pinimg.com/originals/05/fa/d3/05fad3eec2d5d8349a63e263d8a7ee5e.jpg",
            badge: "Америка"
        },
        {
            id: 17,
            title: "Австралия",
            description: "Сидней и Барьерный риф",
            price: 1100,
            continent: "oceania",
            season: "summer",
            type: "beach",
            image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            badge: "Океания"
        },
        {
            id: 18,
            title: "Швейцария",
            description: "Альпы и озёра",
            price: 900,
            continent: "europe",
            season: "winter",
            type: "ski",
            image: "https://avatars.mds.yandex.net/i?id=4905512dc6a0add55dc0fd19944a1f5f_l-5231719-images-thumbs&n=13",
            badge: "Европа"
        }
    ]
];

// Текущая страница
let currentPage = 1;
let filteredData = [...destinationsData];

// DOM элементы
const destinationsContainer = document.getElementById('destinationsContainer');
const filterBtn = document.getElementById('filterBtn');
const continentSelect = document.getElementById('continent');
const seasonSelect = document.getElementById('season');
const typeSelect = document.getElementById('type');
const pageLinks = document.querySelectorAll('.page-link[data-page]');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');

// Функция отображения карточек
function renderDestinations(page) {
    destinationsContainer.innerHTML = '';
    
    const destinations = filteredData[page - 1] || [];
    
    destinations.forEach(dest => {
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.innerHTML = `
            <div class="card-img">
                <img src="${dest.image}" alt="${dest.title}">
                <div class="card-badge">${dest.badge}</div>
            </div>
            <div class="card-content">
                <h3>${dest.title}</h3>
                <p>${dest.description}</p>
                <div class="card-footer">
                    <div class="price">от ${dest.price}$</div>
                    <button class="btn btn-small book-btn" data-country="${dest.title}" data-price="${dest.price}">Забронировать</button>
                </div>
            </div>
        `;
        destinationsContainer.appendChild(card);
    });
    
    // Обновляем активную страницу в пагинации
    pageLinks.forEach(link => {
        link.classList.toggle('active', parseInt(link.dataset.page) === page);
    });
    
    // Активируем/деактивируем кнопки "Назад" и "Вперед"
    prevPageBtn.classList.toggle('disabled', page === 1);
    nextPageBtn.classList.toggle('disabled', page === filteredData.length);
}

// Функция фильтрации
function applyFilters() {
    const continent = continentSelect.value;
    const season = seasonSelect.value;
    const type = typeSelect.value;
    
    filteredData = destinationsData
        .map(page => 
            page.filter(dest => 
                (continent === '' || dest.continent === continent) &&
                (season === '' || dest.season === season) &&
                (type === '' || dest.type === type)
            )
        )
        .filter(page => page.length > 0); // Удаляем пустые страницы
    
    currentPage = 1;
    renderDestinations(currentPage);
}

// Инициализация
renderDestinations(currentPage);

// Обработчики событий
filterBtn.addEventListener('click', applyFilters);

pageLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        currentPage = parseInt(this.dataset.page);
        renderDestinations(currentPage);
    });
});

prevPageBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        renderDestinations(currentPage);
    }
});

nextPageBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (currentPage < filteredData.length) {
        currentPage++;
        renderDestinations(currentPage);
    }
});

// Обработка бронирования 
const modal = document.getElementById('bookingModal');
const closeModal = document.querySelector('.close-modal');
const modalCountry = document.getElementById('modalCountry');
const modalPrice = document.getElementById('modalPrice');
const bookingForm = document.getElementById('bookingForm');

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('book-btn')) {
        const country = e.target.getAttribute('data-country');
        const price = e.target.getAttribute('data-price');
        
        modalCountry.textContent = country;
        modalPrice.textContent = price;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Заполняем данные пользователя, если он авторизован
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (currentUser) {
            document.getElementById('name').value = `${currentUser.firstName} ${currentUser.lastName}`.trim();
            document.getElementById('email').value = currentUser.email || '';
            document.getElementById('phone').value = currentUser.phone || '';
        }
    }
});

closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Функция валидации email
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Функция валидации формы бронирования
function validateBookingForm(formData) {
    if (!formData.name || !formData.email || !formData.phone || !formData.date) {
        return 'Пожалуйста, заполните все обязательные поля';
    }
    
    if (!validateEmail(formData.email)) {
        return 'Введите корректный email';
    }
    
    return null;
}

bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Попытка бронирования...');

    // Проверяем авторизацию
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!isLoggedIn || !currentUser) {
        alert('Для бронирования необходимо войти в систему');
        window.location.href = 'login.html?redirect=destinations.html';
        return;
    }

    // Собираем данные формы
    const bookingData = {
        userId: currentUser.email, // Используем email как идентификатор пользователя
        username: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        date: document.getElementById('date').value,
        people: document.getElementById('people').value,
        country: modalCountry.textContent,
        price: modalPrice.textContent,
        id: 'TD-' + Date.now().toString().slice(-6),
        title: modalCountry.textContent,
        image: getTourImage(modalCountry.textContent),
        duration: 7,
        hotel: 'Отель 4*',
        status: 'confirmed',
        description: 'Тур в ' + modalCountry.textContent,
        bookingDate: new Date().toLocaleString()
    };

    // Валидация
    const validationError = validateBookingForm(bookingData);
    if (validationError) {
        alert(validationError);
        return;
    }

    try {
        // Сохраняем бронирование
        saveBooking(bookingData);
        
        // Обновляем данные пользователя (если изменились)
        if (currentUser) {
            currentUser.phone = bookingData.phone; // Обновляем телефон
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Обновляем в общем хранилище пользователей
            const users = JSON.parse(localStorage.getItem('users') || {});
            if (users[currentUser.email]) {
                users[currentUser.email].phone = bookingData.phone;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
        
        // Закрываем модальное окно
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Показываем сообщение об успехе
        alert(`Бронирование тура в ${bookingData.country} успешно оформлено!`);
        
        // Перенаправляем
        window.location.href = 'profile-bookings.html?new_booking=true';
    } catch (error) {
        console.error('Ошибка бронирования:', error);
        alert('Произошла ошибка при бронировании. Пожалуйста, попробуйте еще раз.');
    }
});

// Функция для получения изображения тура по названию страны
function getTourImage(country) {
    const tour = destinationsData.flat().find(d => d.title === country);
    return tour ? tour.image : 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80';
}

// Функция для сохранения бронирования
function saveBooking(bookingData) {
    try {
        // Получаем текущие бронирования из localStorage
        let bookings = JSON.parse(localStorage.getItem('bookings')) || {};
        
        // Если для этого пользователя еще нет бронирований, создаем массив
        if (!bookings[bookingData.userId]) {
            bookings[bookingData.userId] = [];
        }
        
        // Добавляем новое бронирование
        bookings[bookingData.userId].push(bookingData);
        
        // Сохраняем обновленный список
        localStorage.setItem('bookings', JSON.stringify(bookings));
        console.log('Бронирование сохранено в localStorage:', bookingData);
        return true;
    } catch (error) {
        console.error('Ошибка при сохранении в localStorage:', error);
        throw error;
    }
}
// Проверяем статус авторизации
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });
    
    // Авторизация
    const authButtons = document.getElementById('authButtons');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const username = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Профиль';
    
    if (isLoggedIn && currentUser) {
        // Если пользователь вошел, показываем кнопку профиля
        authButtons.innerHTML = `
            <a href="profile.html" class="btn-profile">
                <i class="fas fa-user"></i>
                ${username}
            </a>
            <button class="btn-logout" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i> Выход
            </button>
        `;
        
        // Обработчик выхода
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    } else {
        // Если не вошел, показываем кнопки входа и регистрации
        authButtons.innerHTML = `
            <button class="btn-login" id="loginBtn">
                <i class="fas fa-sign-in-alt"></i> Вход
            </button>
            <button class="btn-register" id="registerBtn">
                <i class="fas fa-user-plus"></i> Регистрация
            </button>
        `;
        
        // Обработчики кнопок
        document.getElementById('loginBtn').addEventListener('click', function() {
            window.location.href = 'login.html';
        });
        
        document.getElementById('registerBtn').addEventListener('click', function() {
            window.location.href = 'register.html';
        });
    }
});