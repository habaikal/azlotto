// Module: catchMe.js

function setupCatchMeModal() {
    const cmTab1 = document.getElementById('catch-me-tab-1');
    const cmTab2 = document.getElementById('catch-me-tab-2');
    const cmTab1Content = document.getElementById('catch-me-tab-1-content');
    const cmTab2Content = document.getElementById('catch-me-tab-2-content');
    const cmBoard = document.getElementById('catch-me-board');
    const cmPlayBtn = document.getElementById('catch-me-play-btn');
    const cmPurchaseBtn = document.getElementById('catch-me-purchase-btn');
    const cmBuyOptions = document.getElementsByName('catch-me-buy-option');
    const cmTotalPriceEl = document.getElementById('catch-me-total-price');
    const cmResultText = document.getElementById('catch-me-result-text');
    const catchMePrice = 500; // 게임당 가격
    const allSymbols = ['💵', '💵', '💵', '💰', '💰', '💰', '💎', '💎', '💎', '❌', '❌'];
    let windows = [];
    const windowsToOpen = 6;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function generateBoard() {
        if (cmBoard) {
            cmBoard.innerHTML = '';
            windows = [];
            if (cmResultText) cmResultText.textContent = '';

            const shuffledSymbols = [...allSymbols];
            shuffle(shuffledSymbols);

            for (let i = 0; i < 11; i++) {
                const windowElement = document.createElement('div');
                windowElement.classList.add('catch-me-window');
                windowElement.innerHTML = `<div class="catch-me-window-pane"><span>${i + 1}</span></div>`;
                windowElement.dataset.symbol = shuffledSymbols[i];
                windowElement.dataset.index = i;
                windows.push(windowElement);
                cmBoard.appendChild(windowElement);

                windowElement.addEventListener('click', () => {
                    if (windows.filter(w => w.classList.contains('revealed')).length < windowsToOpen) {
                        revealWindow(windowElement);
                    } else if (!windowElement.classList.contains('revealed')) {
                        alert(`${windowsToOpen} цонхыг сонгох боломжтой.`);
                    }
                });
            }
        }
    }

    function revealWindow(windowElement) {
        if (windowElement.classList.contains('revealed')) return;

        windowElement.classList.add('revealed');
        const symbolSpan = document.createElement('span');
        symbolSpan.textContent = windowElement.dataset.symbol;
        symbolSpan.classList.add('catch-me-symbol', 'absolute', 'inset-0', 'flex', 'items-center', 'justify-center');
        windowElement.querySelector('.catch-me-window-pane').innerHTML = '';
        windowElement.querySelector('.catch-me-window-pane').appendChild(symbolSpan);

        if (windows.filter(w => w.classList.contains('revealed')).length === windowsToOpen) {
            checkWin();
        }
    }

    function checkWin() {
        const revealedWindows = windows.filter(w => w.classList.contains('revealed'));
        const symbolCounts = {};
        revealedWindows.forEach(w => {
            const symbol = w.dataset.symbol;
            symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        });

        let win = false;
        for (const symbol in symbolCounts) {
            if (symbolCounts[symbol] >= 3) {
                if (cmResultText) cmResultText.textContent = `Баяр хүргэе! Та ${symbol}-ийн шагнал хожлоо!`;
                win = true;

                // Determine prize based on symbol (Simulated logic as symbols map wasn't fully distinct in original code)
                let prizeAmount = 0;
                if (symbol === '💎') prizeAmount = 50000;
                else if (symbol === '💰') prizeAmount = 10000;
                else if (symbol === '💵') prizeAmount = 5000;
                else prizeAmount = 1000; // Default

                if (window.userBalanceManager && prizeAmount > 0) {
                    window.userBalanceManager.add(prizeAmount);
                    window.userBalanceManager.addHistory({
                        game: 'Catch Me',
                        amount: prizeAmount,
                        details: `Win with ${symbol}`,
                        result: 'Win'
                    });
                }
                break;
            }
        }
        if (!win) {
            if (cmResultText) cmResultText.textContent = `Дараагийн удаад амжилт хүсье!`;
        }

        if (cmPlayBtn) cmPlayBtn.textContent = 'Дахин тоглох';
        windows.forEach(w => w.style.pointerEvents = 'none');
    }

    if (cmPlayBtn) {
        cmPlayBtn.onclick = () => {
            if (cmPlayBtn.textContent === 'Дахин тоглох') {
                generateBoard();
                cmPlayBtn.textContent = 'Тоглох';
                windows.forEach(w => w.style.pointerEvents = 'auto');
            } else {
                alert(`Та ${windowsToOpen} цонх сонгоно уу.`);
            }
        };
    }

    if (cmPurchaseBtn) {
        cmPurchaseBtn.onclick = async () => {
            const selectedQuantity = parseInt(document.querySelector('input[name="catch-me-buy-option"]:checked')?.value || '0');
            const totalPrice = selectedQuantity * catchMePrice;

            if (window.userBalanceManager) {
                if (confirm(`${selectedQuantity} ширхэг Catch Me-ийг ${totalPrice.toLocaleString()}₮-ээр худалдаж авах уу?`)) {
                    let purchasedGames = [];
                    for (let i = 0; i < selectedQuantity; i++) purchasedGames.push({ instance: i });
                    const tickets = await window.userBalanceManager.purchaseTickets('Catch Me', purchasedGames);
                    if (tickets) {
                        alert('Таны худалдан авалт амжилттай боллоо! Тоглоомыг эхлүүлнэ үү.');
                        generateBoard();
                        if (cmPlayBtn) cmPlayBtn.textContent = 'Тоглох';
                        windows.forEach(w => w.style.pointerEvents = 'auto');
                    }
                }
            } else {
                if (confirm(`${selectedQuantity} ширхэг Catch Me-ийг ${totalPrice.toLocaleString()}₮-ээр худалдаж авах уу?`)) {
                    alert('Таны худалдан авалт амжилттай боллоо! Тоглоомыг эхлүүлнэ үү.');
                    generateBoard();
                    if (cmPlayBtn) cmPlayBtn.textContent = 'Тоглох';
                    windows.forEach(w => w.style.pointerEvents = 'auto');
                }
            }
        };
    }

    cmBuyOptions.forEach(radio => {
        if (radio) {
            radio.onchange = () => {
                const selectedValue = parseInt(radio.value);
                if (cmTotalPriceEl) {
                    cmTotalPriceEl.textContent = `${(selectedValue * catchMePrice).toLocaleString()}₮`;
                }
            };
        }
    });

    if (cmTab1 && cmTab2 && cmTab1Content && cmTab2Content) {
        cmTab1.onclick = () => {
            cmTab1.classList.add('active', 'tab-button-luxury');
            cmTab2.classList.remove('active', 'tab-button-luxury');
            cmTab1Content.classList.remove('hidden');
            cmTab2Content.classList.add('hidden');
        };
        cmTab2.onclick = () => {
            cmTab2.classList.add('active', 'tab-button-luxury');
            cmTab1.classList.remove('active', 'tab-button-luxury');
            cmTab2Content.classList.remove('hidden');
            cmTab1Content.classList.add('hidden');
        };
    }
    generateBoard();
}
