// Module: doubleJackMidas.js

function setupDoubleJackMidasModal() {
    const djmTab1 = document.getElementById('double-jack-midas-tab-1');
    const djmTab2 = document.getElementById('double-jack-midas-tab-2');
    const djmTab1Content = document.getElementById('double-jack-midas-tab-1-content');
    const djmTab2Content = document.getElementById('double-jack-midas-tab-2-content');
    const djmBoard = document.getElementById('double-jack-midas-board');
    const djmRevealBtn = document.getElementById('double-jack-midas-reveal-btn');
    const djmPurchaseBtn = document.getElementById('double-jack-midas-purchase-btn');
    const djmBuyOptions = document.getElementsByName('double-jack-midas-buy-option');
    const djmTotalPriceEl = document.getElementById('double-jack-midas-total-price');
    const djmResultText = document.getElementById('double-jack-midas-result-text');
    const djmPrice = 1000;
    const symbols = ['💰', '👑', '💎', '🍀', '✨']; // Example symbols
    const allSymbols = ['💰', '💰', '💰', '👑', '👑', '👑', '💎', '💎', '💎']; // 3x3 grid, 3 of each symbol
    let cards = [];
    let cardsRevealed = 0;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function generateBoard() {
        if (djmBoard) {
            djmBoard.innerHTML = '';
            cards = [];
            cardsRevealed = 0;
            if (djmResultText) djmResultText.textContent = 'Та азтай байж магадгүй!';
            const shuffledSymbols = [...allSymbols];
            shuffle(shuffledSymbols);

            for (let i = 0; i < 9; i++) {
                const card = document.createElement('div');
                card.classList.add('treasure-hunter-card');
                card.innerHTML = '<span>?</span>';
                card.dataset.icon = shuffledSymbols[i];
                card.dataset.index = i;
                cards.push(card);
                djmBoard.appendChild(card);
            }

            cards.forEach(card => {
                card.addEventListener('click', () => {
                    if (!card.classList.contains('revealed')) {
                        revealCard(card);
                    }
                });
            });
        }
    }

    function revealCard(card) {
        card.classList.add('revealed');
        card.innerHTML = `<span>${card.dataset.icon}</span>`;
        cardsRevealed++;
        checkWin();
    }

    function checkWin() {
        const revealedCards = cards.filter(card => card.classList.contains('revealed'));
        const iconCounts = {};
        revealedCards.forEach(card => {
            const icon = card.dataset.icon;
            iconCounts[icon] = (iconCounts[icon] || 0) + 1;
        });

        let win = false;
        for (const icon in iconCounts) {
            if (iconCounts[icon] >= 3) {
                if (djmResultText) djmResultText.textContent = `Баяр хүргэе! Та ${icon}-ийн шагнал хожлоо!`;
                win = true;

                // Determine prize based on symbol
                let prizeAmount = 0;
                if (icon === '💎') prizeAmount = 100000;
                else if (icon === '👑') prizeAmount = 50000;
                else if (icon === '💰') prizeAmount = 20000;
                else if (icon === '🍀') prizeAmount = 5000;
                else if (icon === '✨') prizeAmount = 2000;
                else prizeAmount = 1000;

                if (window.userBalanceManager && prizeAmount > 0) {
                    window.userBalanceManager.add(prizeAmount);
                    window.userBalanceManager.addHistory({
                        game: 'Double Jack Midas',
                        amount: prizeAmount,
                        details: `Win with ${icon}`,
                        result: 'Win'
                    });
                    // Update modal balance if visible
                    const myRecordsBalance = document.getElementById('my-records-balance');
                    if (myRecordsBalance) myRecordsBalance.textContent = `${window.userBalanceManager.getBalance().toLocaleString()} ₮`;
                }
                break;
            }
        }
        if (!win && cardsRevealed === 9) {
            if (djmResultText) djmResultText.textContent = `Дараагийн удаад амжилт хүсье!`;
        }

        if (cardsRevealed === 9) {
            if (djmRevealBtn) djmRevealBtn.style.display = 'none';
        }
    }

    if (djmRevealBtn) {
        djmRevealBtn.onclick = () => {
            cards.forEach(card => {
                if (!card.classList.contains('revealed')) {
                    revealCard(card);
                }
            });
            if (djmRevealBtn) djmRevealBtn.style.display = 'none';
        };
    }

    if (djmPurchaseBtn) {
        djmPurchaseBtn.onclick = async () => {
            const selectedQuantity = parseInt(document.querySelector('input[name="double-jack-midas-buy-option"]:checked')?.value || '0');
            const totalPrice = selectedQuantity * djmPrice;

            if (window.userBalanceManager) {
                if (confirm(`${selectedQuantity} ширхэг Double Jack Midas-ийг ${totalPrice.toLocaleString()}₮-ээр худалдаж авах уу?`)) {
                    let purchasedGames = [];
                    for (let i = 0; i < selectedQuantity; i++) purchasedGames.push({ instance: i });
                    const tickets = await window.userBalanceManager.purchaseTickets('Double Jack Midas', purchasedGames);
                    if (tickets) {
                        alert('Таны худалдан авалт амжилттай боллоо! Тоглоомыг эхлүүлнэ үү.');
                        generateBoard();
                        if (djmRevealBtn) djmRevealBtn.style.display = 'block';
                    }
                }
            } else {
                if (confirm(`${selectedQuantity} ширхэг Double Jack Midas-ийг ${totalPrice.toLocaleString()}₮-ээр худалдаж авах уу?`)) {
                    alert('Таны худалдан авалт амжилттай боллоо! Тоглоомыг эхлүүлнэ үү.');
                    generateBoard();
                    if (djmRevealBtn) djmRevealBtn.style.display = 'block';
                }
            }
        };
    }

    djmBuyOptions.forEach(radio => {
        if (radio) {
            radio.onchange = () => {
                const selectedValue = parseInt(radio.value);
                if (djmTotalPriceEl) {
                    djmTotalPriceEl.textContent = `${(selectedValue * djmPrice).toLocaleString()}₮`;
                }
            };
        }
    });

    if (djmTab1 && djmTab2 && djmTab1Content && djmTab2Content) {
        djmTab1.onclick = () => {
            djmTab1.classList.add('active', 'tab-button-luxury');
            djmTab2.classList.remove('active', 'tab-button-luxury');
            djmTab1Content.classList.remove('hidden');
            djmTab2Content.classList.add('hidden');
            generateBoard();
        };
        djmTab2.onclick = () => {
            djmTab2.classList.add('active', 'tab-button-luxury');
            djmTab1.classList.remove('active', 'tab-button-luxury');
            djmTab2Content.classList.remove('hidden');
            djmTab1Content.classList.add('hidden');
        };
    }
    generateBoard();
}
