// Module: userBalance.js
// Manages simulated user balance and purchase history

const UserBalanceManager = {
    balance: 0,
    history: [],

    init: function () {
        const storedBalance = localStorage.getItem('azlotto_balance');
        const storedHistory = localStorage.getItem('azlotto_history');

        if (storedBalance !== null) {
            this.balance = parseInt(storedBalance, 10);
        } else {
            this.balance = 100000; // Initial simulated balance: 100,000 MNT
            this.saveBalance();
        }

        if (storedHistory !== null) {
            this.history = JSON.parse(storedHistory);
        }

        this.updateUI();
    },

    getBalance: function () {
        return this.balance;
    },

    deduct: function (amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            this.saveBalance();
            this.updateUI();
            return true;
        }
        return false;
    },

    add: function (amount) {
        this.balance += amount;
        this.saveBalance();
        this.updateUI();
    },

    addHistory: function (entry) {
        // entry: { game: string, amount: number, details: string, timestamp: iso date, result: string }
        const newEntry = {
            ...entry,
            timestamp: new Date().toISOString()
        };
        this.history.unshift(newEntry); // Add to beginning
        this.saveHistory();
    },

    saveBalance: function () {
        localStorage.setItem('azlotto_balance', this.balance.toString());
    },

    saveHistory: function () {
        localStorage.setItem('azlotto_history', JSON.stringify(this.history));
    },

    updateUI: function () {
        const balanceEl = document.getElementById('user-balance-display');
        if (balanceEl) {
            balanceEl.textContent = `${this.balance.toLocaleString()} ₮`;
        }
    },

    reset: function () {
        this.balance = 100000;
        this.history = [];
        this.saveBalance();
        this.saveHistory();
        this.updateUI();
        alert('Balance and History have been reset.');
    }
};

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    window.userBalanceManager = UserBalanceManager;
    UserBalanceManager.init();
});
