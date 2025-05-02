document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const passwordStrengthBars = document.querySelectorAll('.strength-bar');
    const passwordStrengthText = document.querySelector('.strength-text');
    
    // Обработчики кнопок показа/скрытия пароля
    const setupTogglePasswordButtons = () => {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.previousElementSibling;
                const icon = this.querySelector('i');
                
                if (!input || !icon) return;
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                    this.setAttribute('aria-label', 'Скрыть пароль');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                    this.setAttribute('aria-label', 'Показать пароль');
                }
                this.classList.toggle('active');
            });
        });
    };
    
    // Инициализация кнопок при загрузке
    setupTogglePasswordButtons();
    
    // Обработчик ввода пароля
    passwordInput.addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });
    
    // Обработчик отправки формы
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            password: passwordInput.value,
            confirmPassword: document.getElementById('confirmPassword').value,
            agreeTerms: document.getElementById('agreeTerms').checked
        };
        
        // Валидация
        const validationError = validateForm(formData);
        if (validationError) {
            showError(validationError);
            return;
        }
        
        // Создание пользователя
        createUser(formData);
    });
    
    // Функция валидации формы
    function validateForm({fullName, email, phone, password, confirmPassword, agreeTerms}) {
        if (!fullName || !email || !phone || !password || !confirmPassword) {
            return 'Пожалуйста, заполните все поля';
        }
        
        if (!agreeTerms) {
            return 'Необходимо принять условия использования';
        }
        
        if (password.length < 6) {
            return 'Пароль должен содержать не менее 6 символов';
        }
        
        if (calculatePasswordStrength(password) < 3) {
            return 'Пароль слишком слабый. Используйте буквы, цифры и специальные символы';
        }
        
        if (password !== confirmPassword) {
            return 'Пароли не совпадают';
        }
        
        if (!validateEmail(email)) {
            return 'Введите корректный email';
        }
        
        if (!validatePhone(phone)) {
            return 'Введите номер в формате +7 (XXX) XXX-XX-XX';
        }
        
        const existingUser = JSON.parse(localStorage.getItem('userData') || 'null');
        if (existingUser && existingUser.email === email) {
            return 'Пользователь с таким email уже зарегистрирован';
        }
        
        return null;
    }
    
    // Функция создания пользователя
    function createUser({fullName, email, phone, password}) {
        const nameParts = fullName.split(' ').filter(part => part.trim() !== '');
        
        const userData = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email,
            phone: formatPhone(phone),
            password,
            avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
            balance: 0,
            registrationDate: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(userData));
            window.location.href = 'index.html';
        } catch (error) {
            showError('Ошибка сохранения данных. Попробуйте снова.');
            console.error('Ошибка:', error);
        }
    }
    
    // Функция форматирования телефона
    function formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('8') && cleaned.length === 11) {
            return '+7' + cleaned.substring(1);
        }
        return cleaned.startsWith('7') ? '+' + cleaned : '+7' + cleaned;
    }
    
    // Остальные вспомогательные функции
    function updatePasswordStrength(password) {
        const strength = calculatePasswordStrength(password);
        passwordStrengthBars.forEach((bar, index) => {
            bar.style.backgroundColor = index < strength ? getStrengthColor(strength) : '#eee';
        });
        const strengthTexts = ['Очень слабый', 'Слабый', 'Средний', 'Сильный', 'Очень сильный'];
        passwordStrengthText.textContent = strengthTexts[strength - 1] || 'Слабый';
        passwordStrengthText.style.color = getStrengthColor(strength);
    }
    
    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/\d/.test(password)) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return Math.min(strength, 5);
    }
    
    function getStrengthColor(strength) {
        const colors = ['#ff4d4d', '#ff7b25', '#ffcc00', '#99cc33', '#22bb33'];
        return colors[strength - 1] || '#ff4d4d';
    }
    
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function validatePhone(phone) {
        return /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/.test(phone);
    }
    
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'register-error';
        errorElement.textContent = message;
        const submitButton = document.querySelector('#registerForm button[type="submit"]');
        submitButton.parentNode.insertBefore(errorElement, submitButton);
    }
});