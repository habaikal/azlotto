// Module: treasureHunter.js

function setupTreasureHunterModal() {
    const thTab1 = document.getElementById('treasure-hunter-tab-1');
    const thTab2 = document.getElementById('treasure-hunter-tab-2');
    const thTab1Content = document.getElementById('treasure-hunter-tab-1-content');
    const thTab2Content = document.getElementById('treasure-hunter-tab-2-content');
    const thBoard = document.getElementById('treasure-hunter-board');
    const thRevealBtn = document.getElementById('treasure-hunter-reveal-btn');
    const thPurchaseBtn = document.getElementById('treasure-hunter-purchase-btn');
    const thBuyOptions = document.getElementsByName('treasure-hunter-buy-option');
    const thTotalPriceEl = document.getElementById('treasure-hunter-total-price');
    const thResultText = document.getElementById('treasure-hunter-result-text');
    const treasurePrice = 1000;
    let cards = [];
    let cardsRevealed = 0;
    const prizeValues = ['500,000₮', '100,000₮', '50,000₮', '10,000₮', '5,000₮', '1,000₮', '500₮', '200₮', '100₮'];
    const prizeIcons = ['💎', '💰', '👑', '🏅', '🪙', '✨', '⭐', '🍀', '🎁'];
    const allIcons = ['💎', '💎', '💎', '💰', '💰', '💰', '👑', '👑', '👑', '🏅', '🏅', '🏅', '🍀', '🍀', '🍀', '🍀'];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function generateBoard() {
        if (thBoard) {
            thBoard.innerHTML = '';
            cards = [];
            cardsRevealed = 0;
            if (thResultText) thResultText.textContent = 'Та азтай байж магадгүй!';
            const shuffledIcons = [...allIcons];
            shuffle(shuffledIcons);

            for (let i = 0; i < 16; i++) {
                const card = document.createElement('div');
                card.classList.add('treasure-hunter-card');
                card.innerHTML = '<span>?</span>';
                card.dataset.icon = shuffledIcons[i];
                card.dataset.index = i;
                cards.push(card);
                thBoard.appendChild(card);
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

        for (const icon in iconCounts) {
            if (iconCounts[icon] >= 3) {
                const prizeIndex = prizeIcons.indexOf(icon);
                let prizeAmount = 0;
                if (prizeIndex !== -1) {
                    // Parse "500,000₮" to 500000
                    prizeAmount = parseInt(prizeValues[prizeIndex].replace(/[^0-9]/g, ''));
                    if (thResultText) thResultText.textContent = `Баяр хүргэе! Та ${prizeValues[prizeIndex]}-ийн шагнал хожлоо!`;
                } else {
                    if (thResultText) thResultText.textContent = `Баяр хүргэе! Та шагнал хожлоо!`;
                }

                // Award Prize
                if (window.userBalanceManager && prizeAmount > 0) {
                    window.userBalanceManager.add(prizeAmount);
                    window.userBalanceManager.addHistory({
                        game: 'Treasure Hunter',
                        amount: prizeAmount,
                        details: 'Win',
                        result: 'Win'
                    });
                    // Update modal balance if visible (optional, but good)
                    const myRecordsBalance = document.getElementById('my-records-balance');
                    if (myRecordsBalance) myRecordsBalance.textContent = `${window.userBalanceManager.getBalance().toLocaleString()} ₮`;
                }

                if (thRevealBtn) thRevealBtn.style.display = 'none';
                return;
            }
        }
    }

    if (thRevealBtn) {
        thRevealBtn.onclick = () => {
            cards.forEach(card => {
                if (!card.classList.contains('revealed')) {
                    revealCard(card);
                }
            });
            if (thRevealBtn) thRevealBtn.style.display = 'none';
        };
    }

    if (thPurchaseBtn) {
        thPurchaseBtn.onclick = () => {
            const selectedQuantity = parseInt(document.querySelector('input[name="treasure-hunter-buy-option"]:checked')?.value || '0');
            const totalPrice = selectedQuantity * treasurePrice;

            if (window.userBalanceManager) {
                if (confirm(`${selectedQuantity} ширхэг Treasure Hunter-ийг ${totalPrice.toLocaleString()}₮-ээр худалдаж авах уу?`)) {
                    if (window.userBalanceManager.deduct(totalPrice)) {
                        window.userBalanceManager.addHistory({
                            game: 'Treasure Hunter',
                            amount: -totalPrice,
                            details: `Quantity: ${selectedQuantity}`,
                            result: 'See Game'
                        });
                        alert('Таны худалдан авалт амжилттай боллоо! Тоглоомыг эхлүүлнэ үү.');
                        generateBoard();
                        if (thRevealBtn) thRevealBtn.style.display = 'block';
                    } else {
                        alert('Үлдэгдэл хүрэлцэхгүй байна. Цэнэглэнэ үү.');
                    }
                }
            } else {
                if (confirm(`${selectedQuantity} ширхэг Treasure Hunter-ийг ${totalPrice.toLocaleString()}₮-ээр худалдаж авах уу?`)) {
                    alert('Таны худалдан авалт амжилттай боллоо! Тоглоомыг эхлүүлнэ үү.');
                    generateBoard();
                    if (thRevealBtn) thRevealBtn.style.display = 'block';
                }
            }
        };
    }

    thBuyOptions.forEach(radio => {
        if (radio) {
            radio.onchange = () => {
                const selectedValue = parseInt(radio.value);
                if (thTotalPriceEl) {
                    thTotalPriceEl.textContent = `${(selectedValue * treasurePrice).toLocaleString()}₮`;
                }
            };
        }
    });

    if (thTab1 && thTab2 && thTab1Content && thTab2Content) {
        thTab1.onclick = () => {
            thTab1.classList.add('active', 'tab-button-luxury');
            thTab2.classList.remove('active', 'tab-button-luxury');
            thTab1Content.classList.remove('hidden');
            thTab2Content.classList.add('hidden');
            generateBoard();
        };
        thTab2.onclick = () => {
            thTab2.classList.add('active', 'tab-button-luxury');
            thTab1.classList.remove('active', 'tab-button-luxury');
            thTab2Content.classList.remove('hidden');
            thTab1Content.classList.add('hidden');
        };
    }
    generateBoard();
}
