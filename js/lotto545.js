// Module: lotto545.js
// Logic for Lotto 5/45 (AzLotto 5/45)

function setupLottoModal() {
    const lottoModal = document.getElementById('lotto-modal');
    const numberGrid = document.querySelector('.number-grid');
    const selectedGamesDisplay = document.getElementById('selected-games-display');
    const gameCountSelect = document.getElementById('game-count');
    const confirmSelectionBtn = document.getElementById('confirm-selection-btn');
    const autoSelectBtn = document.getElementById('auto-select-btn');
    const resetSelectionBtn = document.getElementById('reset-selection-btn');
    const buyLottoFinalBtn = document.getElementById('buy-lotto-final-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const totalPriceEl = document.getElementById('total-price');

    let selectedNumbers = new Set();
    let purchasedGames = [];
    const maxGames = 5;
    const maxNumbers = 5; // Lotto 5/45 - logic assumes 5 numbers
    const lottoPrice = 1000;

    // Helper: Update selected numbers UI
    function updateNumberGridUI() {
        document.querySelectorAll('.number-ball').forEach(ball => {
            const num = parseInt(ball.dataset.number);
            if (selectedNumbers.has(num)) {
                ball.classList.add('selected');
            } else {
                ball.classList.remove('selected');
            }
        });
    }

    // Helper: Reset selection
    function resetSelection() {
        selectedNumbers.clear();
        updateNumberGridUI();
    }

    // Helper: Update purchased games list display
    function updateDisplay() {
        if (selectedGamesDisplay) {
            selectedGamesDisplay.innerHTML = '';
            if (purchasedGames.length === 0) {
                selectedGamesDisplay.innerHTML = `<div class="text-center text-gray-500 py-8">Сонгосон дугаар байхгүй байна.</div>`;
                if (totalPriceEl) totalPriceEl.textContent = '0 ₮';
                return;
            }

            purchasedGames.forEach((game, index) => {
                const gameLine = document.createElement('div');
                gameLine.classList.add('game-line', 'flex-wrap');
                gameLine.innerHTML = `
                    <span class="font-bold text-lg">${String.fromCharCode(65 + index)}</span>
                    <div class="game-line-selected-numbers flex-grow">
                        ${game.numbers.map(num => `<span class="game-line-number-ball">${num}</span>`).join('')}
                    </div>
                    <div class="flex gap-2 text-sm">
                        <button class="btn-secondary px-3 py-1 rounded-full delete-btn" data-id="${game.id}">Устгах</button>
                    </div>
                `;
                selectedGamesDisplay.appendChild(gameLine);
            });

            if (totalPriceEl) totalPriceEl.textContent = `${(purchasedGames.length * lottoPrice).toLocaleString()} ₮`;

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    purchasedGames = purchasedGames.filter(game => game.id !== id);
                    updateDisplay();
                });
            });
        }
    }

    // Initialize Number Grid
    if (numberGrid) {
        numberGrid.innerHTML = ''; // Clear existing
        for (let i = 1; i <= 45; i++) {
            const numberBall = document.createElement('div');
            numberBall.classList.add('number-ball');
            numberBall.textContent = i;
            numberBall.dataset.number = i;
            numberBall.addEventListener('click', () => {
                if (selectedNumbers.has(i)) {
                    selectedNumbers.delete(i);
                } else {
                    if (selectedNumbers.size < maxNumbers) {
                        selectedNumbers.add(i);
                    }
                }
                updateNumberGridUI();
            });
            numberGrid.appendChild(numberBall);
        }
    }

    // Event Listeners
    if (resetSelectionBtn) resetSelectionBtn.addEventListener('click', resetSelection);

    if (autoSelectBtn) {
        autoSelectBtn.addEventListener('click', () => {
            resetSelection();
            const numbers = Array.from({ length: 45 }, (_, i) => i + 1);
            for (let i = 0; i < maxNumbers; i++) {
                const randomIndex = Math.floor(Math.random() * numbers.length);
                const selected = numbers.splice(randomIndex, 1)[0];
                selectedNumbers.add(selected);
            }
            updateNumberGridUI();
        });
    }

    if (confirmSelectionBtn) {
        confirmSelectionBtn.addEventListener('click', () => {
            if (selectedNumbers.size !== maxNumbers) {
                alert(`Та ${maxNumbers} дугаар сонгоно уу.`);
                return;
            }
            const count = parseInt(gameCountSelect?.value || '1');
            if (purchasedGames.length + count > maxGames) {
                alert(`Та хамгийн ихдээ ${maxGames} тоглоом худалдаж авах боломжтой.`);
                return;
            }

            const sortedNumbers = Array.from(selectedNumbers).sort((a, b) => a - b);
            for (let i = 0; i < count; i++) {
                const newGame = {
                    id: crypto.randomUUID(),
                    numbers: sortedNumbers,
                    timestamp: new Date().toISOString()
                };
                purchasedGames.push(newGame);
            }
            updateDisplay();
            resetSelection();
        });
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('Бүх сонгосон тоглоомуудыг цэвэрлэх үү?')) {
                purchasedGames = [];
                updateDisplay();
            }
        });
    }

    if (buyLottoFinalBtn) {
        buyLottoFinalBtn.addEventListener('click', async () => {
            // START: Integration with user balance system
            if (purchasedGames.length === 0) {
                alert('Худалдаж авах тоглоом сонгоно уу.');
                return;
            }

            const totalCost = purchasedGames.length * lottoPrice;

            // Check if userBalanceManager exists
            if (window.userBalanceManager) {
                const tickets = await window.userBalanceManager.purchaseTickets('Lotto 545', purchasedGames);
                if (tickets) {
                    alert(`Таны худалдан авалт амжилттай боллоо! (${totalCost.toLocaleString()}₮)`);
                    purchasedGames = []; // Reset cart
                    updateDisplay();
                    if (lottoModal) lottoModal.style.display = 'none';
                }
            } else {
                // Fallback if balance manager not ready
                console.warn("UserBalanceManager not found.");
                alert(`Simulation: Purchased for ${totalCost}₮`);
                purchasedGames = [];
                updateDisplay();
                if (lottoModal) lottoModal.style.display = 'none';
            }
            // END: Integration
        });
    }
}
