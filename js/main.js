// Main JavaScript File for AzLotto 545

document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navLinks = document.querySelectorAll('nav a, footer a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Login Button (Mock)
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            // Check if UserBalanceManager is available
            if (window.userBalanceManager) {
                // Determine action based on text content (Simulated Login/Logout)
                if (loginBtn.textContent.includes('Нэвтрэх')) {
                    // Simulate login
                    loginBtn.textContent = 'Гарах';
                    alert('Амжилттай нэвтэрлээ!');
                    // Initialize balance if not already
                    window.userBalanceManager.updateUI();
                } else {
                    // Simulate logout
                    loginBtn.textContent = 'Нэвтрэх / Бүртгүүлэх';
                    alert('Амжилттай гарлаа!');
                    // Optionally hide balance or reset
                }
            } else {
                alert('Нэвтрэх хэсэг засвартай байна.');
            }
        });
    }

    // Modal Handling - Generic Close
    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // Close modal when clicking outside
    window.onclick = function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };

    // Initialize Global Interactive Elements
    initializeGlobalEvents();

    // My Records Modal Logic
    const myRecordsBtn = document.getElementById('my-records-btn');
    const myRecordsModal = document.getElementById('my-records-modal');
    const resetBalanceBtn = document.getElementById('reset-balance-btn');
    const historyList = document.getElementById('purchase-history-list');
    const noHistoryMsg = document.getElementById('no-history-msg');
    const myRecordsBalance = document.getElementById('my-records-balance');

    function updateHistoryUI() {
        if (!window.userBalanceManager) return;

        const history = window.userBalanceManager.history;
        const balance = window.userBalanceManager.balance;

        if (myRecordsBalance) myRecordsBalance.textContent = `${balance.toLocaleString()} ₮`;

        if (historyList) {
            historyList.innerHTML = '';
            if (history.length === 0) {
                if (noHistoryMsg) noHistoryMsg.classList.remove('hidden');
            } else {
                if (noHistoryMsg) noHistoryMsg.classList.add('hidden');
                history.forEach(item => {
                    const date = new Date(item.timestamp).toLocaleString();
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="border-b py-2 text-sm text-gray-700">${date}</td>
                        <td class="border-b py-2 text-sm text-gray-700 font-semibold">${item.game}</td>
                        <td class="border-b py-2 text-sm text-gray-500 truncate max-w-xs" title="${item.details}">${item.details}</td>
                        <td class="border-b py-2 text-sm text-right font-bold ${item.amount < 0 ? 'text-red-500' : 'text-green-500'}">
                            ${item.amount.toLocaleString()} ₮
                        </td>
                     `;
                    historyList.appendChild(row);
                });
            }
        }
    }

    if (myRecordsBtn) {
        myRecordsBtn.addEventListener('click', () => {
            updateHistoryUI();
            if (myRecordsModal) myRecordsModal.style.display = 'flex';
        });
    }

    if (resetBalanceBtn) {
        resetBalanceBtn.addEventListener('click', () => {
            if (window.userBalanceManager) {
                window.userBalanceManager.reset();
                updateHistoryUI();
            }
        });
    }

    // Initialize Lotto 5/45
    if (typeof setupLottoModal === 'function') {
        setupLottoModal();
    }
});

function initializeGlobalEvents() {
    // Open Purchase Modal Function - Global
    window.openPurchaseModal = function (gameName) {
        let modalId = '';
        switch (gameName) {
            case 'Lotto 5/45':
                modalId = 'lotto-modal';
                break;
            case 'Triple Luck':
                modalId = 'triple-luck-modal';
                if (typeof setupTripleLuckModal === 'function') setupTripleLuckModal();
                break;
            case 'Power Ball':
                modalId = 'power-ball-modal';
                if (typeof setupPowerBallModal === 'function') setupPowerBallModal();
                break;
            case 'Speed Keno':
                modalId = 'speed-keno-modal';
                if (typeof setupSpeedKenoModal === 'function') setupSpeedKenoModal();
                break;
            case 'Mega Bingo':
                modalId = 'mega-bingo-modal';
                if (typeof setupMegaBingoModal === 'function') setupMegaBingoModal();
                break;
            case 'Treasure Hunter':
                modalId = 'treasure-hunter-modal';
                if (typeof setupTreasureHunterModal === 'function') setupTreasureHunterModal();
                break;
            case 'Catch Me':
                modalId = 'catch-me-modal';
                if (typeof setupCatchMeModal === 'function') setupCatchMeModal();
                break;
            case 'Double Jack Midas':
                modalId = 'double-jack-midas-modal';
                if (typeof setupDoubleJackMidasModal === 'function') setupDoubleJackMidasModal();
                break;
            default:
                console.error('Unknown game:', gameName);
                return;
        }

        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex'; // Use flex to center with existing CSS
        }
    };

    // Add event listener for the main "Buy Ticket" button for Lotto 5/45 if it exists in hero section
    const heroBuyBtn = document.querySelector('a[href="#games"]'); // Example selector, adjust if needed
    // The specific "Buy Ticket" button in the Hero section calls openPurchaseModal('Lotto 5/45') in HTML? 
    // Let's check index.html for the button that opens Lotto modal. 
    // It seems the "Buy Ticket" button in Hero just scrolls to #games or #how-to-play.
    // There isn't a direct "Buy Lotto" button in the hero in the visible HTML, but if added:
    const lottoBuyBtn = document.getElementById('hero-buy-lotto-btn');
    if (lottoBuyBtn) {
        lottoBuyBtn.addEventListener('click', () => openPurchaseModal('Lotto 5/45'));
    }
}
