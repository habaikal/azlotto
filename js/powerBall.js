// Module: powerBall.js

function setupPowerBallModal() {
    const powerBallTab1 = document.getElementById('powerball-tab-1');
    const powerBallTab2 = document.getElementById('powerball-tab-2');
    const powerBallTab1Content = document.getElementById('powerball-tab-1-content');
    const powerBallTab2Content = document.getElementById('powerball-tab-2-content');
    const powerBallMainBallsEl = document.getElementById('powerball-main-balls');
    const powerBallPowerBallsEl = document.getElementById('powerball-power-balls');
    const powerBallAutoSelect = document.getElementById('powerball-auto-select');
    const powerBallReset = document.getElementById('powerball-reset');
    const powerBallPurchaseBtn = document.getElementById('powerball-purchase-btn');
    const powerBallQuantitySelect = document.getElementById('powerball-quantity');
    const powerBallMainCount = 5;
    const powerBallPowerCount = 1;

    let powerBallSelectedMain = new Set();
    let powerBallSelectedPower = new Set();
    const powerBallPurchasedGames = [];

    // Custom modal display function (to replace alert/confirm)
    function showCustomModal(message) {
        // Assume a custom modal element exists in index.html with id="custom-alert-modal"
        const modal = document.getElementById('custom-alert-modal');
        const modalMessage = document.getElementById('custom-alert-message');
        if (modal && modalMessage) {
            modalMessage.textContent = message;
            modal.classList.remove('hidden');
        }
    }

    // Function to update the UI based on selected numbers
    function updateSelectedNumbersUI() {
        document.querySelectorAll('#powerball-main-balls .number-ball-luxury').forEach(ball => {
            if (powerBallSelectedMain.has(parseInt(ball.dataset.number))) {
                ball.classList.add('selected');
            } else {
                ball.classList.remove('selected');
            }
        });

        document.querySelectorAll('#powerball-power-balls .number-ball-luxury').forEach(ball => {
            if (powerBallSelectedPower.has(parseInt(ball.dataset.number))) {
                ball.classList.add('selected');
            } else {
                ball.classList.remove('selected');
            }
        });
    }

    // Function to generate number balls
    function createBalls(container, count, startNumber, type) {
        container.innerHTML = '';
        for (let i = startNumber; i < startNumber + count; i++) {
            const ball = document.createElement('div');
            ball.classList.add('number-ball-luxury', 'rounded-full', 'w-10', 'h-10', 'flex', 'items-center', 'justify-center', 'cursor-pointer');
            ball.textContent = i;
            ball.dataset.number = i;
            ball.dataset.type = type;

            ball.addEventListener('click', () => {
                const selectedSet = type === 'main' ? powerBallSelectedMain : powerBallSelectedPower;
                const maxCount = type === 'main' ? powerBallMainCount : powerBallPowerCount;

                if (selectedSet.has(i)) {
                    selectedSet.delete(i);
                } else {
                    if (selectedSet.size < maxCount) {
                        selectedSet.add(i);
                    }
                }
                updateSelectedNumbersUI();
            });
            container.appendChild(ball);
        }
    }

    if (powerBallTab1 && powerBallTab2 && powerBallTab1Content && powerBallTab2Content) {
        powerBallTab1.onclick = () => {
            powerBallTab1.classList.add('active');
            powerBallTab2.classList.remove('active');
            powerBallTab1Content.classList.remove('hidden');
            powerBallTab2Content.classList.add('hidden');
            updateSelectedNumbersUI();
        };
        powerBallTab2.onclick = () => {
            powerBallTab2.classList.add('active');
            powerBallTab1.classList.remove('active');
            powerBallTab2Content.classList.remove('hidden');
            powerBallTab1Content.classList.add('hidden');
        };
    }

    if (powerBallMainBallsEl) {
        createBalls(powerBallMainBallsEl, 28, 1, 'main');
    }
    if (powerBallPowerBallsEl) {
        createBalls(powerBallPowerBallsEl, 10, 0, 'power');
    }

    if (powerBallAutoSelect) {
        powerBallAutoSelect.onclick = () => {
            powerBallSelectedMain.clear();
            powerBallSelectedPower.clear();

            const mainNumbers = Array.from({ length: 28 }, (_, i) => i + 1);
            for (let i = 0; i < powerBallMainCount; i++) {
                const randomIndex = Math.floor(Math.random() * mainNumbers.length);
                const selected = mainNumbers.splice(randomIndex, 1)[0];
                powerBallSelectedMain.add(selected);
            }

            const powerNumbers = Array.from({ length: 10 }, (_, i) => i);
            const powerIndex = Math.floor(Math.random() * powerNumbers.length);
            const selectedPower = powerNumbers.splice(powerIndex, 1)[0];
            powerBallSelectedPower.add(selectedPower);

            updateSelectedNumbersUI();
        };
    }

    if (powerBallReset) {
        powerBallReset.onclick = () => {
            powerBallSelectedMain.clear();
            powerBallSelectedPower.clear();
            updateSelectedNumbersUI();
        };
    }

    if (powerBallPurchaseBtn) {
        powerBallPurchaseBtn.onclick = () => {
            if (powerBallSelectedMain.size !== powerBallMainCount || powerBallSelectedPower.size !== powerBallPowerCount) {
                showCustomModal('타 5 үндсэн 범버ᄀ 볼이며 1 파우범버ᄀ을 선택해주세요.');
                return;
            }

            const quantity = parseInt(powerBallQuantitySelect.value);
            const mainBalls = Array.from(powerBallSelectedMain).sort((a, b) => a - b);
            const powerBall = Array.from(powerBallSelectedPower)[0];

            for (let i = 0; i < quantity; i++) {
                powerBallPurchasedGames.push({ main: mainBalls, power: powerBall });
            }

            const totalCost = quantity * 1000; // 1000 MNT per game

            if (window.userBalanceManager) {
                if (window.userBalanceManager.deduct(totalCost)) {
                    window.userBalanceManager.addHistory({
                        game: 'Power Ball',
                        amount: -totalCost,
                        details: `Quantity: ${quantity}, Main: ${mainBalls.join(',')}, Power: ${powerBall}`,
                        result: 'Pending'
                    });
                    alert(`Таны худалдан авалт амжилттай боллоо! (${totalCost.toLocaleString()}₮)`);
                    powerBallSelectedMain.clear();
                    powerBallSelectedPower.clear();
                    updateSelectedNumbersUI();
                    closeModal('power-ball-modal');
                } else {
                    alert('Үлдэгдэл хүрэлцэхгүй байна. Цэнэглэнэ үү.');
                }
            } else {
                console.log("Purchase successful (Simulation):", powerBallPurchasedGames);
                closeModal('power-ball-modal');
            }
        };
    }
}
