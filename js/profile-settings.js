// Функция загрузки данных профиля из localStorage 
function loadProfileData() {
    // Загружаем данные из userData
    const userData = JSON.parse(localStorage.getItem('userData'));
    
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
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.avatar = this.src;
        localStorage.setItem('userData', JSON.stringify(userData));
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
        
        if (!firstName || !lastName) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        // Обновляем данные в userData
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.firstName = firstName;
        userData.lastName = lastName;
        localStorage.setItem('userData', JSON.stringify(userData));
        
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
        if (confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить. Все ваши данные будут безвозвратно удалены.')) {
            // Очищаем все связанные данные
            localStorage.removeItem('userData');
            localStorage.removeItem('profileAvatar');
            localStorage.removeItem('isLoggedIn');
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
        
        // В реальном приложении здесь должна быть проверка текущего пароля
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        
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
        
        // Обновляем пароль в userData
        userData.password = newPassword;
        localStorage.setItem('userData', JSON.stringify(userData));
        
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
        // Сохраняем настройку в userData
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.twoFactorEnabled = this.checked;
        localStorage.setItem('userData', JSON.stringify(userData));
        
        alert(this.checked ? 
            'Двухфакторная аутентификация включена' : 
            'Двухфакторная аутентификация выключена');
    });
}

if (emailNotifications) {
    emailNotifications.addEventListener('change', function() {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.emailNotifications = this.checked;
        localStorage.setItem('userData', JSON.stringify(userData));
    });
}

if (smsNotifications) {
    smsNotifications.addEventListener('change', function() {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.smsNotifications = this.checked;
        localStorage.setItem('userData', JSON.stringify(userData));
    });
}

// Загрузка данных профиля при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    
    // Загружаем сохраненные настройки
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (twoFactorToggle) twoFactorToggle.checked = userData.twoFactorEnabled || false;
    if (emailNotifications) emailNotifications.checked = userData.emailNotifications !== false;
    if (smsNotifications) smsNotifications.checked = userData.smsNotifications || false;
});