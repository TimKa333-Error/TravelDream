document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
        
        // Загружаем данные профиля
        loadProfileData();
    
    // Элементы
    const avatarFile = document.getElementById('avatarFile');
    const uploadArea = document.getElementById('uploadArea');
    const profileAvatar = document.getElementById('profileAvatar');
    const saveAvatarBtn = document.getElementById('saveAvatarBtn');
    const avatarModal = document.getElementById('avatarModal');
    const editAvatarBtn = document.getElementById('editAvatarBtn');
    const closeAvatarModal = document.getElementById('closeAvatarModal');
    const cancelAvatarBtn = document.getElementById('cancelAvatarBtn');
    const defaultAvatars = document.querySelectorAll('.default-avatars img');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const formActions = document.getElementById('formActions');
    const profileForm = document.getElementById('profileForm');
    const formInputs = profileForm.querySelectorAll('input');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const genderBtns = document.querySelectorAll('.gender-btn');

    function loadProfileData() {
    // Получаем данные из localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const userData = users[currentUser.email] || JSON.parse(localStorage.getItem('userData')) || {};
    
    if (!userData || !userData.email) {
        // Если данных нет - перенаправляем на регистрацию
        window.location.href = 'register.html';
        return;
    }
    
    // Заполняем поля формы
    document.getElementById('firstName').value = userData.firstName || '';
    document.getElementById('lastName').value = userData.lastName || '';
    document.getElementById('middleName').value = userData.middleName || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('phone').value = userData.phone || '';
    document.getElementById('birthday').value = userData.birthday || '';
    document.getElementById('country').value = userData.country || '';
    document.getElementById('city').value = userData.city || '';
    
    // Устанавливаем аватар
    const avatarImg = document.getElementById('profileAvatar');
    if (userData.avatar) {
        avatarImg.src = userData.avatar;
    }
    
    // Обновляем информацию в сайдбаре
    document.getElementById('profileName').textContent = 
        `${userData.firstName} ${userData.lastName}`;
    document.getElementById('profileEmail').textContent = userData.email || '';
    
    return userData;
}

    function saveProfileData(data) {
    // Получаем текущего пользователя
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    // Обновляем данные пользователя
    if (users[currentUser.email]) {
        users[currentUser.email] = {
            ...users[currentUser.email],
            ...data
        };
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Также сохраняем в userData для быстрого доступа
    localStorage.setItem('userData', JSON.stringify(data));
}

// Обновленный обработчик отправки формы
profileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        middleName: document.getElementById('middleName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        birthday: document.getElementById('birthday').value,
        country: document.getElementById('country').value,
        city: document.getElementById('city').value,
        // Сохраняем аватар, если он уже был установлен
        avatar: document.getElementById('profileAvatar').src
    };
    
    // Сохраняем данные
    saveProfileData(userData);
    
    // Обновляем текущего пользователя
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        currentUser.firstName = userData.firstName;
        currentUser.lastName = userData.lastName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    // Отключаем режим редактирования
    formInputs.forEach(input => {
        input.disabled = true;
    });
    formActions.style.display = 'none';
    editProfileBtn.style.display = 'block';
    
    // Обновляем информацию в сайдбаре
    document.getElementById('profileName').textContent = 
        `${userData.firstName} ${userData.lastName}`;
    document.getElementById('profileEmail').textContent = userData.email;
    
    // Показываем уведомление
    showToast('Данные профиля успешно обновлены!');
});

    // Функции для уведомлений
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
        .toast.success { background-color: var(--primary); }
        .toast.error { background-color: #e76f51; }
    `;
    document.head.appendChild(toastStyles);

    // Функции модального окна
    function openModal() {
        avatarModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        avatarModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Переключение вкладок
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Удаляем активный класс у всех кнопок и контента
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Добавляем активный класс текущей кнопке и контенту
            btn.classList.add('active');
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });

    // Фильтрация аватаров по полу
    genderBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const gender = btn.dataset.gender;
            
            // Удаляем активный класс у всех кнопок
            genderBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Показываем/скрываем аватары в зависимости от пола
            defaultAvatars.forEach(avatar => {
                if (gender === 'all' || avatar.dataset.gender === gender) {
                    avatar.style.display = 'block';
                } else {
                    avatar.style.display = 'none';
                }
            });
        });
    });

   // Обработчик загрузки файла
   avatarFile.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        
        if (!file.type.match('image.*')) {
            showToast('Пожалуйста, выберите изображение (JPG, PNG, GIF)', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showToast('Файл слишком большой. Максимальный размер - 5MB.', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Создаем уменьшенное превью (150x150px)
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Устанавливаем размер для уменьшенного изображения
                const size = 150;
                canvas.width = size;
                canvas.height = size;
                
                // Рисуем изображение с уменьшением размера
                ctx.drawImage(img, 0, 0, size, size);
                
                // Сохраняем уменьшенное изображение
                const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
                uploadArea.dataset.fileData = resizedImage;
                
                // Показываем сообщение о успешной загрузке
                uploadArea.innerHTML = `
                    <i class="fas fa-check-circle" style="color: var(--primary); font-size: 2.5rem;"></i>
                    <p>Фото выбрано! (${(file.size/1024).toFixed(1)} KB)</p>
                    <button class="btn-remove-image" id="removeImageBtn">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                `;
                
                // Добавляем обработчик для кнопки удаления
                document.getElementById('removeImageBtn').addEventListener('click', function(e) {
                    e.stopPropagation();
                    uploadArea.innerHTML = `
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Перетащите сюда фото или нажмите для выбора</p>
                    `;
                    avatarFile.value = '';
                    delete uploadArea.dataset.fileData;
                });
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }
});

    // Дроп файла
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary)';
        this.style.backgroundColor = 'rgba(42, 157, 143, 0.1)';
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = '#f9f9f9';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = '#f9f9f9';
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            avatarFile.files = e.dataTransfer.files;
            const event = new Event('change');
            avatarFile.dispatchEvent(event);
        }
    });

    // Выбор аватара из коллекции
    defaultAvatars.forEach(avatar => {
        avatar.addEventListener('click', function() {
            defaultAvatars.forEach(a => a.classList.remove('selected'));
            this.classList.add('selected');
            
            // Сбрасываем загруженный файл, если был
            if (uploadArea.classList.contains('has-image')) {
                uploadArea.classList.remove('has-image');
                uploadArea.innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Перетащите сюда фото или нажмите для выбора</p>
                `;
                avatarFile.value = '';
                delete uploadArea.dataset.fileData;
            }
        });
    });

    // Открытие модального окна
    editAvatarBtn.addEventListener('click', function() {
        openModal();
        
        // Сброс состояния при открытии
        if (uploadArea.classList.contains('has-image')) {
            uploadArea.classList.remove('has-image');
            uploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Перетащите сюда фото или нажмите для выбора</p>
            `;
            avatarFile.value = '';
            delete uploadArea.dataset.fileData;
        }
        
        // Сброс выбранных аватаров
        defaultAvatars.forEach(avatar => {
            avatar.classList.remove('selected');
        });
        
        // Активируем первую вкладку
        document.querySelector('.tab-btn').click();
    });

    // Закрытие модального окна
    closeAvatarModal.addEventListener('click', closeModal);
    cancelAvatarBtn.addEventListener('click', closeModal);
    avatarModal.addEventListener('click', function(e) {
        if (e.target === avatarModal) {
            closeModal();
        }
    });

        // Сохранение аватара
    saveAvatarBtn.addEventListener('click', function() {
        const uploadTabActive = document.getElementById('uploadTab').classList.contains('active');
        let newAvatarUrl = '';

        if (uploadTabActive && uploadArea.dataset.fileData) {
            // Сохраняем загруженное изображение
            newAvatarUrl = uploadArea.dataset.fileData;
        } 
        else if (!uploadTabActive) {
            // Сохраняем выбранный аватар из коллекции
            const selectedAvatar = document.querySelector('.default-avatars img.selected');
            if (selectedAvatar) {
                newAvatarUrl = selectedAvatar.src;
            } else {
                showToast('Пожалуйста, выберите аватар из коллекции', 'error');
                return;
            }
        } else {
            showToast('Пожалуйста, выберите изображение для загрузки', 'error');
            return;
        }

        // Обновляем аватар на странице
        profileAvatar.src = newAvatarUrl;
        
        // Сохраняем в userData
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.avatar = newAvatarUrl;
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Дополнительно сохраняем отдельно для быстрого доступа
        localStorage.setItem('profileAvatar', newAvatarUrl);
        
        closeModal();
        showToast('Аватар успешно обновлен!');
    });

    // Редактирование профиля
    editProfileBtn.addEventListener('click', function() {
        formInputs.forEach(input => {
            input.disabled = false;
        });
        formActions.style.display = 'flex';
        editProfileBtn.style.display = 'none';
    });

    // Отмена редактирования
    cancelEditBtn.addEventListener('click', function() {
        formInputs.forEach(input => {
            input.disabled = true;
        });
        formActions.style.display = 'none';
        editProfileBtn.style.display = 'block';
        loadProfileData(); // Загружаем исходные данные
    });

    // Сохранение профиля
    // Сохранение профиля
profileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Обновляем данные
    userData.firstName = document.getElementById('firstName').value;
    userData.lastName = document.getElementById('lastName').value;
    userData.email = document.getElementById('email').value;
    userData.phone = document.getElementById('phone').value;
    userData.birthday = document.getElementById('birthday').value;
    userData.country = document.getElementById('country').value;
    userData.city = document.getElementById('city').value;
    
    // Сохраняем
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Отключаем режим редактирования
    formInputs.forEach(input => {
        input.disabled = true;
    });
    formActions.style.display = 'none';
    editProfileBtn.style.display = 'block';
    
    // Обновляем информацию в сайдбаре
    document.getElementById('profileName').textContent = 
        `${userData.firstName} ${userData.lastName}`;
    document.getElementById('profileEmail').textContent = userData.email;
    
    // Показываем уведомление
    showToast('Данные профиля успешно обновлены!');
});

    document.querySelector('.profile-menu a[href="login.html"]').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    });

    // Инициализация данных профиля
    loadProfileData();
});