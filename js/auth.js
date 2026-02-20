// Module: auth.js
// Handles Login, Registration, JWT storage, and Modal UI

const AuthManager = {
    token: localStorage.getItem('az_jwt') || null,
    user: JSON.parse(localStorage.getItem('az_user') || 'null'),
    apiUrl: 'http://localhost:3000/api/auth',

    init: function () {
        this.setupEventListeners();
        this.updateUI();
        if (this.token) {
            this.fetchProfile();
        } else {
            this.checkProtectedRoutes();
        }
    },

    checkProtectedRoutes: function () {
        const protectedPages = ['buy-lotto.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
            alert('Энэ хуудсанд хандахын тулд нэвтэрч орно уу. (Please login to access this page)');
            window.location.href = 'index.html';
        }
    },

    setupEventListeners: function () {
        const loginBtn = document.getElementById('login-btn');
        const mobileLoginBtn = document.getElementById('mobile-login-btn');
        const logoutBtn = document.getElementById('logout-btn'); // Create dynamically

        if (loginBtn) loginBtn.addEventListener('click', () => this.showModal());
        if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', () => this.showModal());

        document.body.insertAdjacentHTML('beforeend', this.getModalHTML());

        const modal = document.getElementById('auth-modal');
        const closeBtn = document.getElementById('close-auth-modal');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const toggleToRegister = document.getElementById('toggle-to-register');
        const toggleToLogin = document.getElementById('toggle-to-login');

        closeBtn.addEventListener('click', () => this.hideModal());

        toggleToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('register-section').classList.remove('hidden');
        });

        toggleToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-section').classList.add('hidden');
            document.getElementById('login-section').classList.remove('hidden');
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('login-username').value;
            const p = document.getElementById('login-password').value;
            this.login(u, p);
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('reg-username').value;
            const p = document.getElementById('reg-password').value;
            this.register(u, p);
        });
    },

    showModal: function () {
        document.getElementById('auth-modal').classList.remove('hidden');
        document.getElementById('login-section').classList.remove('hidden');
        document.getElementById('register-section').classList.add('hidden');
    },

    hideModal: function () {
        document.getElementById('auth-modal').classList.add('hidden');
    },

    login: async function (username, password) {
        try {
            const res = await fetch(`${this.apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                this.setAuth(data.token, data.user);
                this.hideModal();
                alert('Амжилттай нэвтэрлээ!'); // Successfully logged in
                window.location.reload();
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (e) {
            alert('Сүлжээний алдаа'); // Network error
        }
    },

    register: async function (username, password) {
        try {
            const res = await fetch(`${this.apiUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                alert('Амжилттай бүртгүүллээ. Одоо нэвтэрнэ үү.'); // Registered. Pls login.
                document.getElementById('toggle-to-login').click();
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (e) {
            alert('Сүлжээний алдаа');
        }
    },

    fetchProfile: async function () {
        try {
            const res = await fetch(`${this.apiUrl}/me`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                this.user = data.user;
                localStorage.setItem('az_user', JSON.stringify(this.user));
                this.updateUI();
                if (window.userBalanceManager) {
                    window.userBalanceManager.initFromBackend(this.user.balance);
                }
            } else {
                this.logout();
            }
        } catch (e) {
            console.error(e);
        }
    },

    setAuth: function (token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('az_jwt', token);
        localStorage.setItem('az_user', JSON.stringify(user));
        this.updateUI();
    },

    logout: function () {
        this.token = null;
        this.user = null;
        localStorage.removeItem('az_jwt');
        localStorage.removeItem('az_user');
        alert('Системээс гарлаа');
        window.location.reload();
    },

    updateUI: function () {
        const loginBtn = document.getElementById('login-btn');
        const mobileLoginBtn = document.getElementById('mobile-login-btn');

        if (this.token && this.user) {
            const logoutHtml = `<button id="logout-btn" class="ml-4 text-sm text-red-500 hover:text-red-700 font-bold">Гарах (Logout)</button>`;

            if (loginBtn) {
                loginBtn.outerHTML = `<span id="login-btn" class="text-white font-bold ml-4">${this.user.username}</span>${logoutHtml}`;
                document.getElementById('logout-btn').addEventListener('click', () => this.logout());
            }
            if (mobileLoginBtn) {
                mobileLoginBtn.textContent = 'Гарах';
                mobileLoginBtn.classList.replace('btn-primary', 'bg-red-500');
                mobileLoginBtn.removeEventListener('click', this.showModal);
                mobileLoginBtn.addEventListener('click', () => this.logout());
            }
        }
    },

    // Injects modal HTML into body
    getModalHTML: function () {
        return `
        <div id="auth-modal" class="hidden fixed inset-0 bg-black bg-opacity-75 z-[100] flex justify-center items-center">
            <div class="bg-white rounded-lg p-6 max-w-sm w-full relative">
                <button id="close-auth-modal" class="absolute top-2 right-2 text-gray-500 hover:text-black">
                    <span class="material-icons">close</span>
                </button>
                
                <!-- Login Section -->
                <div id="login-section">
                    <h2 class="text-2xl font-bold mb-4 text-center text-primary-dark-blue">Нэвтрэх</h2>
                    <form id="login-form" class="space-y-4">
                        <input type="text" id="login-username" placeholder="Хэрэглэгчийн нэр" required class="w-full border p-2 rounded focus:outline-none focus:border-primary-blue">
                        <input type="password" id="login-password" placeholder="Нууц үг" required class="w-full border p-2 rounded focus:outline-none focus:border-primary-blue">
                        <button type="submit" class="w-full bg-primary-blue text-white py-2 rounded font-bold hover:bg-blue-700">Нэвтрэх</button>
                    </form>
                    <p class="mt-4 text-sm text-center">Бүртгэлгүй юу? <a href="#" id="toggle-to-register" class="text-primary-blue font-bold">Бүртгүүлэх</a></p>
                </div>

                <!-- Register Section -->
                <div id="register-section" class="hidden">
                    <h2 class="text-2xl font-bold mb-4 text-center text-primary-dark-blue">Бүртгүүлэх</h2>
                    <form id="register-form" class="space-y-4">
                        <input type="text" id="reg-username" placeholder="Хэрэглэгчийн нэр" required class="w-full border p-2 rounded focus:outline-none focus:border-primary-blue">
                        <input type="password" id="reg-password" placeholder="Нууц үг" required class="w-full border p-2 rounded focus:outline-none focus:border-primary-blue">
                        <button type="submit" class="w-full bg-green-500 text-white py-2 rounded font-bold hover:bg-green-600">Бүртгүүлэх</button>
                    </form>
                    <p class="mt-4 text-sm text-center">Бүртгэлтэй юу? <a href="#" id="toggle-to-login" class="text-primary-blue font-bold">Нэвтрэх</a></p>
                </div>
            </div>
        </div>
        `;
    }
};

window.addEventListener('DOMContentLoaded', () => {
    window.authManager = AuthManager;
    AuthManager.init();
});
