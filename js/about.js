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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userData = users[currentUser.email] || {};
    
    // Получаем имя пользователя или email, если имя не указано
    const username = userData.firstName 
        ? `${userData.firstName} ${userData.lastName || ''}`.trim() 
        : currentUser.email || 'Профиль';
    
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
});