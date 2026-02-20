// Module: megaBingo.js

function setupMegaBingoModal() {
    const bingoTab1 = document.getElementById('mega-bingo-tab-1');
    const bingoTab2 = document.getElementById('mega-bingo-tab-2');
    const bingoTab1Content = document.getElementById('mega-bingo-tab-1-content');
    const bingoTab2Content = document.getElementById('mega-bingo-tab-2-content');
    const bingoBoardEl = document.getElementById('mega-bingo-board');
    const bingoAutoSelectBtn = document.getElementById('mega-bingo-auto-select');
    const bingoResetBtn = document.getElementById('mega-bingo-reset');
    const bingoPurchaseBtn = document.getElementById('mega-bingo-purchase-btn');
    const bingoBuyOptions = document.getElementsByName('mega-bingo-buy-option');
    const bingoTotalPriceEl = document.getElementById('mega-bingo-total-price');
    const bingoPrice = 1000;
    const bingoLetters = ['B', 'I', 'N', 'G', 'O'];
    const bingoNumbers = {
        'B': Array.from({ length: 15 }, (_, i) => i + 1),
        'I': Array.from({ length: 15 }, (_, i) => i + 16),
        'N': Array.from({ length: 15 }, (_, i) => i + 31),
        'G': Array.from({ length: 15 }, (_, i) => i + 46),
        'O': Array.from({ length: 15 }, (_, i) => i + 61)
    };
    let selectedBingoNumbers = new Set();

    function createBingoBoard() {
        if (!bingoBoardEl) return;
        bingoBoardEl.innerHTML = `
                    <div class="col-span-1 text-center text-gold-accent font-bold">B</div>
                    <div class="col-span-1 text-center text-gold-accent font-bold">I</div>
                    <div class="col-span-1 text-center text-gold-accent font-bold">N</div>
                    <div class="col-span-1 text-center text-gold-accent font-bold">G</div>
                    <div class="col-span-1 text-center text-gold-accent font-bold">O</div>
                `;
        selectedBingoNumbers.clear();
        let cellIndex = 0;
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.classList.add('bg-gray-700', 'text-white', 'w-10', 'h-10', 'rounded-md', 'flex', 'items-center', 'justify-center', 'cursor-pointer');
                const letter = bingoLetters[col];
                const number = bingoNumbers[letter][row + (col > 2 ? 10 : col > 1 ? 5 : 0)];
                cell.textContent = number;
                cell.dataset.number = number;

                // 중앙의 FREE 칸 처리
                if (row === 2 && col === 2) {
                    cell.textContent = 'FREE';
                    cell.classList.add('bg-gold-accent', 'text-black', 'font-bold', 'cursor-default');
                } else {
                    cell.addEventListener('click', () => {
                        if (selectedBingoNumbers.has(number)) {
                            selectedBingoNumbers.delete(number);
                            cell.classList.remove('bg-gold-accent', 'text-black', 'font-bold');
                            cell.classList.add('bg-gray-700', 'text-white');
                        } else {
                            if (selectedBingoNumbers.size < 24) {
                                selectedBingoNumbers.add(number);
                                cell.classList.remove('bg-gray-700', 'text-white');
                                cell.classList.add('bg-gold-accent', 'text-black', 'font-bold');
                            }
                        }
                    });
                }
                bingoBoardEl.appendChild(cell);
            }
        }
    }

    if (bingoTab1 && bingoTab2 && bingoTab1Content && bingoTab2Content) {
        bingoTab1.onclick = () => {
            bingoTab1.classList.add('active');
            bingoTab2.classList.remove('active');
            bingoTab1Content.classList.remove('hidden');
            bingoTab2Content.classList.add('hidden');
            createBingoBoard();
        };
        bingoTab2.onclick = () => {
            bingoTab2.classList.add('active');
            bingoTab1.classList.remove('active');
            bingoTab2Content.classList.remove('hidden');
            bingoTab1Content.classList.add('hidden');
        };
    }

    if (bingoAutoSelectBtn) {
        bingoAutoSelectBtn.onclick = () => {
            selectedBingoNumbers.clear();
            const allCells = document.querySelectorAll('#mega-bingo-board div:not(.col-span-1):not([data-number="FREE"])');
            const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
            const freeCell = document.querySelector('#mega-bingo-board div[data-number="FREE"]');

            const cellsToSelect = Array.from(allCells);
            shuffle(cellsToSelect);

            for (let i = 0; i < 24; i++) {
                const cell = cellsToSelect[i];
                const number = parseInt(cell.dataset.number);
                selectedBingoNumbers.add(number);
                cell.classList.remove('bg-gray-700', 'text-white');
                cell.classList.add('bg-gold-accent', 'text-black', 'font-bold');
            }
        };
    }

    if (bingoResetBtn) {
        bingoResetBtn.onclick = () => {
            selectedBingoNumbers.clear();
            document.querySelectorAll('#mega-bingo-board div').forEach(cell => {
                if (cell.textContent !== 'FREE') {
                    cell.classList.remove('bg-gold-accent', 'text-black', 'font-bold');
                    cell.classList.add('bg-gray-700', 'text-white');
                }
            });
        };
    }

    bingoBuyOptions.forEach(radio => {
        if (radio) {
            radio.onchange = () => {
                const selectedValue = parseInt(radio.value);
                if (bingoTotalPriceEl) {
                    bingoTotalPriceEl.textContent = `${(selectedValue * bingoPrice).toLocaleString()}₮`;
                }
            };
        }
    });

    if (bingoPurchaseBtn) {
        bingoPurchaseBtn.onclick = async () => {
            if (selectedBingoNumbers.size !== 24) {
                alert('Та 24 дугаар сонгоно уу.');
                return;
            }
            const quantity = parseInt(document.querySelector('input[name="mega-bingo-buy-option"]:checked')?.value || '0');
            const totalCost = quantity * bingoPrice;

            if (window.userBalanceManager) {
                if (confirm(`${quantity} ширхэг Mega Bingo-ийг ${totalCost.toLocaleString()}₮-ээр худалдаж авах уу?`)) {
                    let purchasedGames = [];
                    for (let i = 0; i < quantity; i++) purchasedGames.push({ numbers: Array.from(selectedBingoNumbers) });
                    const tickets = await window.userBalanceManager.purchaseTickets('Mega Bingo', purchasedGames);
                    if (tickets) {
                        alert('Таны худалдан авалт амжилттай боллоо! Амжилт хүсье.');
                        closeModal('mega-bingo-modal');
                    }
                }
            } else {
                if (confirm(`${quantity} ширхэг Mega Bingo-ийг ${totalCost.toLocaleString()}₮-ээр худалдаж авах уу?`)) {
                    alert('Таны худалдан авалт амжилттай боллоо! Амжилт хүсье.');
                    closeModal('mega-bingo-modal');
                }
            }
        };
    }

    createBingoBoard();
}
