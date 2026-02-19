// Module: speedKeno.js

function setupSpeedKenoModal() {
    const speedKenoTab1 = document.getElementById('speed-keno-tab-1');
    const speedKenoTab2 = document.getElementById('speed-keno-tab-2');
    const speedKenoTab1Content = document.getElementById('speed-keno-tab-1-content');
    const speedKenoTab2Content = document.getElementById('speed-keno-tab-2-content');
    const speedKenoBallsEl = document.getElementById('speed-keno-balls');
    const speedKenoSelectionCountEl = document.getElementById('speed-keno-selection-count');
    const speedKenoAutoSelect = document.getElementById('speed-keno-auto-select');
    const speedKenoReset = document.getElementById('speed-keno-reset');
    const speedKenoPurchaseBtn = document.getElementById('speed-keno-purchase-btn');

    if (speedKenoTab1 && speedKenoTab2 && speedKenoTab1Content && speedKenoTab2Content) {
        speedKenoTab1.onclick = () => {
            speedKenoTab1.classList.add('active', 'tab-button-luxury');
            speedKenoTab2.classList.remove('active', 'tab-button-luxury');
            speedKenoTab1Content.classList.remove('hidden');
            speedKenoTab2Content.classList.add('hidden');
        };

        speedKenoTab2.onclick = () => {
            speedKenoTab2.classList.add('active', 'tab-button-luxury');
            speedKenoTab1.classList.remove('active', 'tab-button-luxury');
            speedKenoTab2Content.classList.remove('hidden');
            speedKenoTab1Content.classList.add('hidden');
        };
    }

    // Speed Keno 번호 생성 및 선택 기능
    if (speedKenoBallsEl) {
        speedKenoBallsEl.innerHTML = '';
        speedKenoSelectedNumbers.clear();
        if (speedKenoSelectionCountEl) speedKenoSelectionCountEl.textContent = speedKenoSelectedNumbers.size;

        for (let i = 1; i <= 70; i++) {
            const ball = document.createElement('div');
            ball.classList.add('number-ball-luxury', 'rounded-full', 'w-10', 'h-10', 'flex', 'items-center', 'justify-center', 'cursor-pointer');
            ball.textContent = i;
            ball.dataset.number = i;
            ball.addEventListener('click', () => {
                if (speedKenoSelectedNumbers.has(i)) {
                    speedKenoSelectedNumbers.delete(i);
                    ball.classList.remove('selected');
                } else {
                    if (speedKenoSelectedNumbers.size < 10) {
                        speedKenoSelectedNumbers.add(i);
                        ball.classList.add('selected');
                    }
                }
                if (speedKenoSelectionCountEl) speedKenoSelectionCountEl.textContent = speedKenoSelectedNumbers.size;
            });
            speedKenoBallsEl.appendChild(ball);
        }
    }

    if (speedKenoAutoSelect) {
        speedKenoAutoSelect.onclick = () => {
            const count = 10;
            speedKenoSelectedNumbers.clear();
            document.querySelectorAll('#speed-keno-balls .number-ball-luxury').forEach(ball => ball.classList.remove('selected'));

            const numbers = Array.from({ length: 70 }, (_, i) => i + 1);
            for (let i = 0; i < count; i++) {
                const randomIndex = Math.floor(Math.random() * numbers.length);
                const selected = numbers.splice(randomIndex, 1)[0];
                speedKenoSelectedNumbers.add(selected);
                document.querySelector(`#speed-keno-balls .number-ball-luxury[data-number="${selected}"]`).classList.add('selected');
            }
            if (speedKenoSelectionCountEl) speedKenoSelectionCountEl.textContent = speedKenoSelectedNumbers.size;
        };
    }

    if (speedKenoReset) {
        speedKenoReset.onclick = () => {
            speedKenoSelectedNumbers.clear();
            document.querySelectorAll('#speed-keno-balls .number-ball-luxury').forEach(ball => ball.classList.remove('selected'));
            if (speedKenoSelectionCountEl) speedKenoSelectionCountEl.textContent = speedKenoSelectedNumbers.size;
        };
    }

    if (speedKenoPurchaseBtn) {
        speedKenoPurchaseBtn.onclick = () => {
            if (speedKenoSelectedNumbers.size < 2 || speedKenoSelectedNumbers.size > 10) {
                alert('Та 2-оос 10 хүртэлх дугаар сонгоно уу.');
                return;
            }

            const sortedNumbers = Array.from(speedKenoSelectedNumbers).sort((a, b) => a - b);

            const totalCost = 1000; // Fixed price for one game

            if (window.userBalanceManager) {
                if (confirm(`Та дараах тоглоомыг худалдаж авах уу?\n\nДугаар: ${sortedNumbers.join(', ')}\nҮнэ: ${totalCost.toLocaleString()}₮`)) {
                    if (window.userBalanceManager.deduct(totalCost)) {
                        window.userBalanceManager.addHistory({
                            game: 'Speed Keno',
                            amount: -totalCost,
                            details: `Numbers: ${sortedNumbers.join(', ')}`,
                            result: 'Pending'
                        });
                        alert(`Таны худалдан авалт амжилттай боллоо!`);
                        speedKenoSelectedNumbers.clear();
                        document.querySelectorAll('#speed-keno-balls .number-ball-luxury').forEach(ball => ball.classList.remove('selected'));
                        if (speedKenoSelectionCountEl) speedKenoSelectionCountEl.textContent = 0;
                        closeModal('speed-keno-modal');
                    } else {
                        alert('Үлдэгдэл хүрэлцэхгүй байна. Цэнэглэнэ үү.');
                    }
                }
            } else {
                if (confirm(`Та дараах тоглоомыг худалдаж авах уу?\n\nДугаар: ${sortedNumbers.join(', ')}`)) {
                    alert('Таны худалдан авалт амжилттай боллоо! Амжилт хүсье.');
                    closeModal('speed-keno-modal');
                }
            }
        };
    }
}
