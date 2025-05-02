document.addEventListener('DOMContentLoaded', function() {
    // Обработка формы входа
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Проверка заполнения полей
        if (!email || !password) {
            showError('Пожалуйста, заполните все поля');
            return;
        }
        
        // Проверка длины пароля
        if (password.length < 6) {
            showError('Пароль должен содержать не менее 6 символов');
            return;
        }
        
        // Получаем данные пользователя из localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        // Проверяем существует ли пользователь
        if (!userData) {
            showError('Пользователь не найден. Зарегистрируйтесь.');
            return;
        }
        
        // Проверяем совпадение email и пароля
        if (userData.email !== email) {
            showError('Пользователь с таким email не найден');
            return;
        }
        
        if (userData.password !== password) {
            showError('Неверный пароль');
            return;
        }
        
        // Успешный вход
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(userData));
        window.location.href = 'profile.html';
    });

    // Функция показа ошибок
    function showError(message) {
        // Удаляем предыдущие ошибки
        const oldError = document.querySelector('.login-error');
        if (oldError) oldError.remove();
        
        // Создаем элемент ошибки
        const errorElement = document.createElement('div');
        errorElement.className = 'login-error';
        errorElement.style.color = '#e76f51';
        errorElement.style.marginBottom = '15px';
        errorElement.textContent = message;
        
        // Вставляем перед кнопкой входа
        const loginButton = document.querySelector('#loginForm button[type="submit"]');
        loginButton.parentNode.insertBefore(errorElement, loginButton);
    }
});