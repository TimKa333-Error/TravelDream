// reset-password.js

document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('resetPasswordForm');
    const successMessage = document.querySelector('.success-message');
    const emailInput = document.getElementById('email');

    if (resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверка валидности email
            if (!emailInput.value || !isValidEmail(emailInput.value)) {
                showError(emailInput, 'Пожалуйста, введите корректный email');
                return;
            }

            // Показываем сообщение об успехе
            successMessage.style.display = 'block';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i> 
                Ссылка для сброса пароля отправлена на ${emailInput.value}
            `;
            
            // Скрываем форму
            resetForm.style.display = 'none';
            
            // Через 1 секунду перенаправляем на страницу входа
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
            
        });
    }

    // Валидация email при вводе
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (this.value && !isValidEmail(this.value)) {
                showError(this, 'Введите корректный email');
            } else {
                clearError(this);
            }
        });
    }

    // Функция проверки email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Показать ошибку
    function showError(input, message) {
        clearError(input);
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        error.style.color = '#e74c3c';
        error.style.fontSize = '0.8rem';
        error.style.marginTop = '5px';
        input.parentNode.appendChild(error);
        input.style.borderColor = '#e74c3c';
    }

    // Убрать ошибку
    function clearError(input) {
        const error = input.parentNode.querySelector('.error-message');
        if (error) {
            input.parentNode.removeChild(error);
        }
        input.style.borderColor = '#ddd';
    }

    // Функция для отправки запроса 
    function sendResetRequest(email) {
        // В реальном приложении здесь был бы fetch-запрос к серверу
        console.log('Запрос на сброс пароля отправлен для:', email);
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
});