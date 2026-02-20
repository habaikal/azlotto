// Module: userBalance.js
// Interacts with backend API for balance and purchase

const UserBalanceManager = {
    balance: 0,
    apiUrl: 'http://localhost:3000/api/lotto',

    init: function () {
        // Balance is now fetched by AuthManager and passed to initFromBackend
        this.updateUI();
    },

    initFromBackend: function (serverBalance) {
        this.balance = serverBalance;
        this.updateUI();
    },

    getBalance: function () {
        return this.balance;
    },

    // Simulated local deduction before API confirms (Optimistic UI) 
    deductLocally: function (amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            this.updateUI();
            return true;
        }
        return false;
    },

    // Real API Purchase
    purchaseTickets: async function (gameType, selectedGames) {
        if (!window.authManager || !window.authManager.token) {
            alert('Эхлээд нэвтэрнэ үү! (Please login first)');
            return false;
        }

        try {
            const res = await fetch(`${this.apiUrl}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.authManager.token}`
                },
                body: JSON.stringify({ gameType, selectedGames })
            });
            const data = await res.json();

            if (res.ok) {
                this.balance = data.newBalance;
                this.updateUI();
                return data.tickets; // Return processed tickets
            } else {
                alert(data.error || 'Purchase failed');
                return false;
            }
        } catch (e) {
            alert('Сүлжээний алдаа (Network Error)');
            return false;
        }
    },

    getHistory: async function () {
        if (!window.authManager || !window.authManager.token) return [];
        try {
            const res = await fetch('http://localhost:3000/api/lotto/history', {
                headers: { 'Authorization': `Bearer ${window.authManager.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                return data.history;
            }
            return [];
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    getTickets: async function () {
        if (!window.authManager || !window.authManager.token) return [];
        try {
            const res = await fetch('http://localhost:3000/api/lotto/tickets', {
                headers: { 'Authorization': `Bearer ${window.authManager.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                return data.tickets;
            }
            return [];
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    updateUI: function () {
        const balanceEl = document.getElementById('user-balance-display');
        if (balanceEl) {
            balanceEl.textContent = `${this.balance.toLocaleString()} ₮`;
        }
    }
};

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    window.userBalanceManager = UserBalanceManager;
    UserBalanceManager.init();
});

