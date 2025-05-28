// Функция загрузки данных профиля из localStorage 
function loadProfileData() {
    // Получаем текущего пользователя из localStorage
    const currentUserEmail = JSON.parse(localStorage.getItem('currentUser'))?.email;
    if (!currentUserEmail) {
        window.location.href = 'login.html';
        return;
    }
    
    // Загружаем данные всех пользователей
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userData = users[currentUserEmail];
    
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
   
    const avatarUrl = localStorage.getItem('profileAvatar') || 
                     userData.avatar || 
                     'https://randomuser.me/api/portraits/men/32.jpg';
    
    // Обновляем данные на странице
    document.getElementById('profileName').textContent = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('profileEmail').textContent = userData.email;
    
    // Устанавливаем аватар с обработкой ошибки
    const avatar = document.getElementById('profileAvatar');
    avatar.src = avatarUrl;
    avatar.onerror = function() {
        this.src = 'https://randomuser.me/api/portraits/men/32.jpg';
        localStorage.setItem('profileAvatar', this.src);
        
        // Обновляем в userData
        const users = JSON.parse(localStorage.getItem('users') || {});
        if (users[currentUserEmail]) {
            users[currentUserEmail].avatar = this.src;
            localStorage.setItem('users', JSON.stringify(users));
            
            // Обновляем currentUser если это текущий пользователь
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.email === currentUserEmail) {
                currentUser.avatar = this.src;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
    };
    
    // Заполняем форму изменения имени
    document.getElementById('firstName').value = userData.firstName || '';
    document.getElementById('lastName').value = userData.lastName || '';
}

// Обработка формы изменения имени 
const nameForm = document.getElementById('nameForm');
if (nameForm) {
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const currentUserEmail = JSON.parse(localStorage.getItem('currentUser'))?.email;
        
        if (!firstName || !lastName) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        if (!currentUserEmail) {
            alert('Ошибка: пользователь не авторизован');
            return;
        }
        
        // Обновляем данные в хранилище
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[currentUserEmail]) {
            users[currentUserEmail].firstName = firstName;
            users[currentUserEmail].lastName = lastName;
            localStorage.setItem('users', JSON.stringify(users));
            
            // Обновляем currentUser если это текущий пользователь
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.email === currentUserEmail) {
                currentUser.firstName = firstName;
                currentUser.lastName = lastName;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
        
        // Обновляем отображение
        document.getElementById('profileName').textContent = `${firstName} ${lastName}`;
        document.getElementById('currentNameDisplay').textContent = `${firstName} ${lastName}`;
        
        alert('Имя успешно изменено');
        nameModal.style.display = 'none';
    });
}

// Обработка удаления аккаунта 
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentUserEmail = JSON.parse(localStorage.getItem('currentUser'))?.email;
        
        if (!currentUserEmail) {
            alert('Ошибка: пользователь не авторизован');
            return;
        }
        
        if (confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить. Все ваши данные будут безвозвратно удалены.')) {
            // Удаляем пользователя из хранилища
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            delete users[currentUserEmail];
            localStorage.setItem('users', JSON.stringify(users));
            
            // Очищаем другие данные
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('profileAvatar');
            localStorage.removeItem('bookings');
            localStorage.removeItem('userBalance');
            localStorage.removeItem('transactions');
            
            alert('Аккаунт удален. Перенаправляем на главную страницу...');
            window.location.href = 'index.html';
        }
    });
}

const passwordModal = document.getElementById('passwordModal');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const closePasswordModal = document.getElementById('closePasswordModal');

const nameModal = document.getElementById('nameModal');
const editNameBtn = document.getElementById('editNameBtn');
const closeNameModal = document.getElementById('closeNameModal');

// Управление модальными окнами
if (changePasswordBtn && passwordModal && closePasswordModal) {
    changePasswordBtn.addEventListener('click', () => {
        passwordModal.style.display = 'flex';
    });
    
    closePasswordModal.addEventListener('click', () => {
        passwordModal.style.display = 'none';
    });
    
    passwordModal.addEventListener('click', (e) => {
        if (e.target === passwordModal) {
            passwordModal.style.display = 'none';
        }
    });
}

if (editNameBtn && nameModal && closeNameModal) {
    editNameBtn.addEventListener('click', () => {
        nameModal.style.display = 'flex';
    });
    
    closeNameModal.addEventListener('click', () => {
        nameModal.style.display = 'none';
    });
    
    nameModal.addEventListener('click', (e) => {
        if (e.target === nameModal) {
            nameModal.style.display = 'none';
        }
    });
}

// Обработка формы смены пароля
const passwordForm = document.getElementById('passwordForm');
if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        const currentUserEmail = JSON.parse(localStorage.getItem('currentUser'))?.email;
        
        if (!currentUserEmail) {
            alert('Ошибка: пользователь не авторизован');
            return;
        }
        
        // Получаем данные пользователя
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const userData = users[currentUserEmail];
        
        if (!userData) {
            alert('Ошибка: данные пользователя не найдены');
            return;
        }
        
        if (userData.password !== currentPassword) {
            alert('Текущий пароль неверен');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            alert('Новый пароль и подтверждение не совпадают');
            return;
        }
        
        if (newPassword.length < 8) {
            alert('Пароль должен содержать не менее 8 символов');
            return;
        }
        
        // Обновляем пароль в хранилище
        users[currentUserEmail].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Обновляем currentUser если это текущий пользователь
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.email === currentUserEmail) {
            currentUser.password = newPassword;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        alert('Пароль успешно изменен');
        passwordModal.style.display = 'none';
        passwordForm.reset();
    });
}

// Обработка переключателей
const twoFactorToggle = document.getElementById('twoFactorToggle');
const emailNotifications = document.getElementById('emailNotifications');
const smsNotifications = document.getElementById('smsNotifications');

if (twoFactorToggle) {
    twoFactorToggle.addEventListener('change', function() {
        const currentUserEmail = JSON.parse(localStorage.getItem('currentUser'))?.email;
        if (!currentUserEmail) return;
        
        // Сохраняем настройку в хранилище
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[currentUserEmail]) {
            users[currentUserEmail].twoFactorEnabled = this.checked;
            localStorage.setItem('users', JSON.stringify(users));
            
            // Обновляем currentUser если это текущий пользователь
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.email === currentUserEmail) {
                currentUser.twoFactorEnabled = this.checked;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
        
        alert(this.checked ? 
            'Двухфакторная аутентификация включена' : 
            'Двухфакторная аутентификация выключена');
    });
}

if (emailNotifications) {
    emailNotifications.addEventListener('change', function() {
        const currentUserEmail = JSON.parse(localStorage.getItem('currentUser'))?.email;
        if (!currentUserEmail) return;
        
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[currentUserEmail]) {
            users[currentUserEmail].emailNotifications = this.checked;
            localStorage.setItem('users', JSON.stringify(users));
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.email === currentUserEmail) {
                currentUser.emailNotifications = this.checked;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
    });
}

if (smsNotifications) {
    smsNotifications.addEventListener('change', function() {
        const currentUserEmail = JSON.parse(localStorage.getItem('currentUser'))?.email;
        if (!currentUserEmail) return;
        
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[currentUserEmail]) {
            users[currentUserEmail].smsNotifications = this.checked;
            localStorage.setItem('users', JSON.stringify(users));
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.email === currentUserEmail) {
                currentUser.smsNotifications = this.checked;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
    });
}

// Загрузка данных профиля при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    
    // Загружаем сохраненные настройки
    const currentUserEmail = JSON.parse(localStorage.getItem('currentUser'))?.email;
    if (!currentUserEmail) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userData = users[currentUserEmail] || {};
    
    if (twoFactorToggle) twoFactorToggle.checked = userData.twoFactorEnabled || false;
    if (emailNotifications) emailNotifications.checked = userData.emailNotifications !== false;
    if (smsNotifications) smsNotifications.checked = userData.smsNotifications || false;
});