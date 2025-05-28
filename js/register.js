document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const phoneInput = document.getElementById('phone');
    const passwordStrengthBars = document.querySelectorAll('.strength-bar');
    const passwordStrengthText = document.querySelector('.strength-text');
    
    // Обработчик ввода номера телефона
    phoneInput.addEventListener('input', function(e) {
        formatPhoneInput(this);
    });
    
    // Функция форматирования ввода телефона
    function formatPhoneInput(input) {
        // Удаляем все нецифровые символы
        let numbers = input.value.replace(/\D/g, '');
        
        // Если номер начинается с 8, заменяем на 7 (для российских номеров)
        if (numbers.startsWith('8') && numbers.length === 11) {
            numbers = '7' + numbers.substring(1);
        }
        
        // Если номер начинается не с 7, добавляем 7 (если это российский номер)
        if (!numbers.startsWith('7') && numbers.length <= 10) {
            numbers = '7' + numbers;
        }
        
        // Ограничиваем длину номера (11 цифр для российских номеров)
        numbers = numbers.substring(0, 11);
        
        // Форматируем номер в нужный формат
        let formatted = '';
        if (numbers.length > 0) {
            formatted = '+7 (';
            if (numbers.length > 1) {
                formatted += numbers.substring(1, 4);
            }
            if (numbers.length > 4) {
                formatted += ') ' + numbers.substring(4, 7);
            }
            if (numbers.length > 7) {
                formatted += '-' + numbers.substring(7, 9);
            }
            if (numbers.length > 9) {
                formatted += '-' + numbers.substring(9, 11);
            }
        }
        
        // Устанавливаем отформатированное значение
        input.value = formatted;
        
        // Проверяем валидность номера
        validatePhoneInput(input);
    }
    
    // Функция проверки валидности номера
    function validatePhoneInput(input) {
        const isValid = input.value.replace(/\D/g, '').length === 11;
        input.classList.toggle('invalid', !isValid);
        return isValid;
    }
    
    // Модифицированная функция валидации формы
    function validateForm({fullName, email, phone, password, confirmPassword, agreeTerms}) {
    if (!fullName || fullName.split(' ').filter(part => part.trim() !== '').length < 2) {
        return 'Введите фамилию и имя (минимум 2 слова)';
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
        
        if (!validatePhoneInput(phoneInput)) {
            return 'Введите корректный номер телефона';
        }
        
        const existingUser = JSON.parse(localStorage.getItem('userData') || 'null');
        if (existingUser && existingUser.email === email) {
            return 'Пользователь с таким email уже зарегистрирован';
        }
        
        return null;
    }
    
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
            phone: phoneInput.value.trim(),
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
    
    // Функция создания пользователя
    function createUser({fullName, email, phone, password}) {
        const nameParts = fullName.split(' ').filter(part => part.trim() !== '');
            let lastName = '';
            let firstName = '';
            let middleName = '';

            if (nameParts.length === 1) {
                firstName = nameParts[0];
            } else if (nameParts.length === 2) {
                lastName = nameParts[0];
                firstName = nameParts[1];
            } else if (nameParts.length >= 3) {
                lastName = nameParts[0];
                firstName = nameParts[1];
                middleName = nameParts.slice(2).join(' '); // Все остальное - отчество
            }

            const userData = {
                firstName: firstName,
                lastName: lastName,
                middleName: middleName,
                email: email,
                phone: phoneInput.value,
                password: password,
                avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
                balance: 0,
                registrationDate: new Date().toISOString()
            };
        
        try {
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            users[email] = userData;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(userData));
            window.location.href = 'index.html';
        } catch (error) {
            showError('Ошибка сохранения данных. Попробуйте снова.');
            console.error('Ошибка:', error);
        }
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
    
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'register-error';
        errorElement.textContent = message;
        const submitButton = document.querySelector('#registerForm button[type="submit"]');
        submitButton.parentNode.insertBefore(errorElement, submitButton);
    }
});