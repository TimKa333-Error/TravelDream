// Проверяем статус авторизации
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });
    
    // Авторизация - теперь используем email из currentUser
    const authButtons = document.getElementById('authButtons');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const username = currentUser.email || 'Профиль';
    
    if (isLoggedIn) {
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
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Данные о турах
const toursData = {
    1: {
        title: "Анталия - все включено",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        days: "10 дней",
        people: "2 взрослых",
        rating: "4.8",
        price: "650$",
        features: `
            <div class="feature-item"><i class="fas fa-check"></i> 5-звездочный отель Lara Beach Resort & Spa</div>
            <div class="feature-item"><i class="fas fa-check"></i> Питание по системе "Все включено"</div>
            <div class="feature-item"><i class="fas fa-check"></i> Собственный песчаный пляж</div>
            <div class="feature-item"><i class="fas fa-check"></i> 3 бассейна, включая детский</div>
            <div class="feature-item"><i class="fas fa-check"></i> Бесплатный Wi-Fi на всей территории</div>
            <div class="feature-item"><i class="fas fa-check"></i> Анимационная программа</div>
        `,
        fullDescription: `Этот тур предлагает незабываемый отдых в одном из лучших отелей Анталии. Lara Beach Resort & Spa расположен на первой линии пляжа Лара, в 15 км от центра Анталии. 

Отель предлагает:
- Просторные номера с видом на море или сад
- Все необходимое для комфортного отдыха
- Питание "Все включено"
- Медицинскую страховку

Дополнительные экскурсии:
- Древний город Перге
- Водопад Куршунлу
- Парк "Земля легенд"`
    },
    2: {
        title: "Пхукет - экзотический отдых",
        image: "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        days: "14 дней",
        people: "2 взрослых",
        rating: "4.9",
        price: "1100$",
        features: `
            <div class="feature-item"><i class="fas fa-check"></i> Отель The Kee Resort & Spa 4*</div>
            <div class="feature-item"><i class="fas fa-check"></i> Завтраки "шведский стол"</div>
            <div class="feature-item"><i class="fas fa-check"></i> Расположение на пляже Ката</div>
            <div class="feature-item"><i class="fas fa-check"></i> 2 экскурсии включены в стоимость</div>
            <div class="feature-item"><i class="fas fa-check"></i> СПА-центр с тайским массажем</div>
            <div class="feature-item"><i class="fas fa-check"></i> Бесплатный трансфер из аэропорта</div>
        `,
        fullDescription: `Этот комбинированный тур на Пхукет сочетает пляжный отдых с насыщенной экскурсионной программой. 

Включено:
- Проживание в отеле The Kee Resort & Spa
- 2 экскурсии (острова Пхи-Пхи и национальный парк Кхао Сок)
- Трансферы и питание

Рекомендуем посетить:
- Шоу Фантазия
- Храм Большого Будды
- Морскую прогулку на яхте`
    },
    3: {
        title: "Рим - Венеция - Флоренция",
        image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        days: "8 дней",
        people: "2 взрослых",
        rating: "4.7",
        price: "850$",
        features: `
            <div class="feature-item"><i class="fas fa-check"></i> Проживание в отелях 3-4* в центре городов</div>
            <div class="feature-item"><i class="fas fa-check"></i> Завтраки "шведский стол"</div>
            <div class="feature-item"><i class="fas fa-check"></i> 3 гастрономических мастер-класса</div>
            <div class="feature-item"><i class="fas fa-check"></i> 5 дегустаций итальянских вин</div>
            <div class="feature-item"><i class="fas fa-check"></i> Обзорные экскурсии по всем городам</div>
            <div class="feature-item"><i class="fas fa-check"></i> Ж/д билеты между городами</div>
        `,
        fullDescription: `Этот гастрономический тур познакомит вас с кулинарными традициями Италии. 

        Программа включает:
        - Мастер-классы по приготовлению итальянских блюд
        - Дегустации вин
        - Посещение главных достопримечательностей:
        * Колизей и Римский форум
        * Собор Санта-Мария-дель-Фьоре
        * Галерея Уффици
        * Площадь Сан-Марко
        * Дворец дожей`
    }
};

// Функция для показа деталей тура
function showTourDetails(tourId) {
    const tour = toursData[tourId];
    const modal = document.getElementById('tourModal');
    
    document.getElementById('modalTourTitle').textContent = tour.title;
    document.getElementById('modalTourImage').src = tour.image;
    document.getElementById('modalTourImage').alt = tour.title;
    document.getElementById('modalTourDays').textContent = tour.days;
    document.getElementById('modalTourPeople').textContent = tour.people;
    document.getElementById('modalTourRating').textContent = tour.rating;
    document.getElementById('modalTourPrice').textContent = tour.price;
    document.getElementById('modalTourFeatures').innerHTML = tour.features;
    document.getElementById('modalTourFullDescription').textContent = tour.fullDescription;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Функция для закрытия модального окна
function closeModal() {
    document.getElementById('tourModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    const modal = document.getElementById('tourModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Функция для бронирования тура
function bookTour() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || {});
    
    if (isLoggedIn && currentUser.email) {
        // Получаем данные о текущем туре из модального окна
        const tourTitle = document.getElementById('modalTourTitle').textContent;
        const tourImage = document.getElementById('modalTourImage').src;
        const tourDays = document.getElementById('modalTourDays').textContent;
        const tourPeople = document.getElementById('modalTourPeople').textContent;
        const tourPrice = document.getElementById('modalTourPrice').textContent;
        
        // Создаем новое бронирование
        const newBooking = {
            id: 'TD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
            title: tourTitle,
            image: tourImage,
            date: getFutureDate(7) + ' - ' + getFutureDate(parseInt(tourDays) + 7),
            duration: parseInt(tourDays),
            people: parseInt(tourPeople),
            hotel: 'Отель из тура',
            price: parseInt(tourPrice.replace(/\D/g, '')),
            status: 'confirmed',
            description: document.getElementById('modalTourFullDescription').textContent,
            userEmail: currentUser.email // Добавляем email пользователя к бронированию
        };
        
        // Сохраняем бронирование в localStorage
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.unshift(newBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Перенаправляем на страницу бронирований
        window.location.href = 'profile-bookings.html?new_booking=true';
    } else {
        if (confirm('Для бронирования тура необходимо войти в систему. Хотите перейти на страницу входа?')) {
            window.location.href = 'login.html';
        }
    }
}

// Вспомогательная функция для генерации даты
function getFutureDate(daysToAdd) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('ru-RU');
}

const player = new Plyr('#player');