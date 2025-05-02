// =============================================
// ПАГИНАЦИЯ
// =============================================
const toursPerPage = 6;
let currentPage = 1;
const tourCards = Array.from(document.querySelectorAll('#toursContainer .tour-card'));
const totalPages = Math.ceil(tourCards.length / toursPerPage);

function updatePagination() {
    // Обновляем активную страницу
    document.querySelectorAll('.page-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page == currentPage) {
            link.classList.add('active');
        }
    });

    // Показываем/скрываем кнопки "назад" и "вперед"
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    if (prevPageBtn && nextPageBtn) {
        prevPageBtn.style.display = currentPage === 1 ? 'none' : 'flex';
        nextPageBtn.style.display = currentPage === totalPages ? 'none' : 'flex';
    }

    // Показываем только туры для текущей страницы
    tourCards.forEach((card, index) => {
        const startIndex = (currentPage - 1) * toursPerPage;
        const endIndex = startIndex + toursPerPage;

        card.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
    });
}

// Обработчики для кнопок пагинации
document.querySelectorAll('.page-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (this.classList.contains('prev')) {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
            }
        } else if (this.classList.contains('next')) {
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
            }
        } else if (this.dataset.page) {
            currentPage = parseInt(this.dataset.page);
            updatePagination();
        }
    });
});

// =============================================
// ПРОФИЛЬ: Управление данными и аватаром
// =============================================

// Сохранение данных профиля
function saveProfileData(data) {
    try {
        localStorage.setItem('profileData', JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Ошибка сохранения профиля:', e);
        return false;
    }
}

// Загрузка данных профиля
function loadProfileData() {
    const defaultData = {
        firstName: 'Иван',
        lastName: 'Петrov',
        email: 'ivan.petrov@example.com',
        phone: '+7 (123) 456-78-90',
        birthday: '1990-05-15',
        country: 'Россия',
        city: 'Москва',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    };

    try {
        const savedData = JSON.parse(localStorage.getItem('profileData')) || {};
        return {...defaultData, ...savedData};
    } catch (e) {
        console.error('Ошибка загрузки профиля:', e);
        return defaultData;
    }
}

// Инициализация аватара
function initProfileAvatar() {
    const avatarElement = document.getElementById('profileAvatar');
    if (!avatarElement) return;

    const profileData = loadProfileData();
    avatarElement.src = profileData.avatar;

    // Обработка ошибки загрузки изображения
    avatarElement.onerror = function() {
        this.src = 'https://randomuser.me/api/portraits/men/32.jpg';
        saveProfileData({...profileData, avatar: this.src});
    };
}

// =============================================
// МОДАЛЬНОЕ ОКНО СМЕНЫ АВАТАРА
// =============================================

function setupAvatarModal() {
    const modal = document.getElementById('avatarModal');
    if (!modal) return;

    // Элементы модального окна
    const editAvatarBtn = document.getElementById('editAvatarBtn');
    const saveAvatarBtn = document.getElementById('saveAvatarBtn');
    const closeAvatarModal = document.getElementById('closeAvatarModal');
    const cancelAvatarBtn = document.getElementById('cancelAvatarBtn');
    const defaultAvatars = document.querySelectorAll('.default-avatars img');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('avatarFile');
    const previewImg = document.getElementById('previewImg');

    // Toast-уведомления
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    // Стили для toast
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1100;
        }
        .toast.show { opacity: 1; }
        .toast.success { background-color: #2a9d8f; }
        .toast.error { background-color: #e76f51; }
    `;
    document.head.appendChild(toastStyles);

    // Управление модальным окном
    function openModal() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Открытие модального окна
    if (editAvatarBtn) editAvatarBtn.addEventListener('click', openModal);

    // Выбор аватара из галереи
    if (defaultAvatars.length) {
        defaultAvatars.forEach(avatar => {
            avatar.addEventListener('click', function() {
                defaultAvatars.forEach(a => a.classList.remove('selected'));
                this.classList.add('selected');
                if (previewImg) previewImg.src = this.src;
            });
        });
    }

    // Загрузка своего аватара
    if (uploadArea && fileInput && previewImg) {
        uploadArea.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.match('image.*')) {
                if (file.size > 5 * 1024 * 1024) {
                    showToast('Файл слишком большой. Максимальный размер - 5MB.', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(event) {
                    previewImg.src = event.target.result;
                    defaultAvatars.forEach(a => a.classList.remove('selected'));
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.match('image.*')) {
                fileInput.files = e.dataTransfer.files;
                const event = new Event('change');
                fileInput.dispatchEvent(event);
            }
        });
    }

    // Сохранение аватара
    if (saveAvatarBtn) {
        saveAvatarBtn.addEventListener('click', function() {
            const profileData = loadProfileData();
            let newAvatar;

            // Проверяем выбранный аватар из галереи
            const selectedAvatar = document.querySelector('.default-avatars img.selected');
            if (selectedAvatar) {
                newAvatar = selectedAvatar.src;
            } 
            // Проверяем загруженный аватар
            else if (previewImg?.src) {
                newAvatar = previewImg.src;
            }
            // Используем стандартный, если ничего не выбрано
            else {
                newAvatar = 'https://randomuser.me/api/portraits/men/32.jpg';
            }

            if (saveProfileData({...profileData, avatar: newAvatar})) {
                initProfileAvatar(); // Обновляем аватар на странице
                closeModal();
                showToast('Аватар успешно изменен!');
            } else {
                showToast('Ошибка при сохранении аватара', 'error');
            }
        });
    }

    // Закрытие модального окна
    if (closeAvatarModal) closeAvatarModal.addEventListener('click', closeModal);
    if (cancelAvatarBtn) cancelAvatarBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

// =============================================
// БРОНИРОВАНИЯ
// =============================================

// Проверка, забронирован ли тур
function isTourBooked(tourId) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    return bookings.some(booking => 
        booking.tourId === tourId && 
        booking.status !== 'cancelled'
    );
}

// Обновление отображения туров
function updateToursDisplay() {
    const tourCards = document.querySelectorAll('#toursContainer .tour-card');
    
    tourCards.forEach(card => {
        const tourId = card.dataset.tourId;
        if (isTourBooked(tourId)) {
            card.style.display = 'none';
        } else {
            card.style.display = 'block';
        }
    });
}

// =============================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    // Пагинация
    if (document.querySelector('#toursContainer')) {
        updatePagination();
        updateToursDisplay();
    }

    // Профиль и аватар
    initProfileAvatar();
    setupAvatarModal();

    // Загрузка данных профиля в форму
    const profileData = loadProfileData();
    if (document.getElementById('firstName')) {
        document.getElementById('firstName').value = profileData.firstName;
        document.getElementById('lastName').value = profileData.lastName;
        document.getElementById('email').value = profileData.email;
        document.getElementById('phone').value = profileData.phone;
        document.getElementById('birthday').value = profileData.birthday;
        document.getElementById('country').value = profileData.country;
        document.getElementById('city').value = profileData.city;
    }

    // Обновление информации в профиле
    if (document.getElementById('profileName')) {
        document.getElementById('profileName').textContent = `${profileData.firstName} ${profileData.lastName}`;
    }

    if (document.getElementById('profileEmail')) {
        document.getElementById('profileEmail').textContent = profileData.email;
    }
    // Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.innerHTML = mainNav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('#navMenu a').forEach(link => {
        link.addEventListener('click', function() {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Адаптация видео-плеера
    function adaptVideoPlayer() {
        const playerContainer = document.querySelector('.video-container');
        if (playerContainer && window.innerWidth < 768) {
            playerContainer.style.width = '100%';
        }
    }
    
    adaptVideoPlayer();
    window.addEventListener('resize', adaptVideoPlayer);
    
    // Оптимизация загрузки видео для мобильных
    if (window.innerWidth < 768) {
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            heroVideo.setAttribute('playsinline', '');
            heroVideo.setAttribute('muted', '');
            heroVideo.setAttribute('autoplay', '');
            heroVideo.setAttribute('loop', '');
        }
    }
    
    // Улучшенная обработка касаний для мобильных
    document.querySelectorAll('.destination-card, .tour-card').forEach(card => {
        card.style.cursor = 'pointer';
        let tapTimer;
        
        card.addEventListener('touchstart', function() {
            tapTimer = setTimeout(() => {
                this.classList.add('tap-effect');
            }, 100);
        });
        
        card.addEventListener('touchend', function(e) {
            clearTimeout(tapTimer);
            if (this.classList.contains('tap-effect')) {
                this.classList.remove('tap-effect');
                window.location.href = this.querySelector('a').href;
            }
        });
        
        card.addEventListener('touchmove', function() {
            clearTimeout(tapTimer);
            this.classList.remove('tap-effect');
        });
    });
});

// Добавляем стиль для tap-effect
const tapEffectStyle = document.createElement('style');
tapEffectStyle.textContent = `
    .tap-effect {
        transform: scale(0.98) !important;
        opacity: 0.9 !important;
        transition: all 0.2s ease;
    }
    
    @media (hover: none) {
        .destination-card:hover,
        .tour-card:hover {
            transform: none !important;
            box-shadow: none !important;
        }
    }
`;
document.head.appendChild(tapEffectStyle);
});