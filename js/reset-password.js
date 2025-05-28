// new-password.js
document.addEventListener('DOMContentLoaded', function() {
    const newPasswordForm = document.getElementById('newPasswordForm');
    const token = new URLSearchParams(window.location.search).get('token');
    const email = new URLSearchParams(window.location.search).get('email');

    if (!token || !email) {
        window.location.href = 'reset-password.html';
        return;
    }

    // Проверяем токен
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[email];

    if (!user || user.resetToken !== token || user.resetTokenExpires < Date.now()) {
        alert('Ссылка для сброса пароля недействительна или истекла');
        window.location.href = 'reset-password.html';
        return;
    }

    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword.length < 8) {
                alert('Пароль должен содержать не менее 8 символов');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('Пароли не совпадают');
                return;
            }

            // Обновляем пароль
            user.password = newPassword;
            delete user.resetToken;
            delete user.resetTokenExpires;
            users[email] = user;
            localStorage.setItem('users', JSON.stringify(users));

            alert('Пароль успешно изменен! Теперь вы можете войти с новым паролем.');
            window.location.href = 'login.html';
        });
    }
});