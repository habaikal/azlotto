// Module: tripleLuck.js

function setupTripleLuckModal() {
    const tlTab1 = document.getElementById('triple-luck-tab-1');
    const tlTab2 = document.getElementById('triple-luck-tab-2');
    const tlTab1Content = document.getElementById('triple-luck-tab-1-content');
    const tlTab2Content = document.getElementById('triple-luck-tab-2-content');
    const tlBuyBtn = document.getElementById('triple-luck-purchase-btn');
    const tlBuyOptions = document.getElementsByName('triple-luck-buy-option');
    const tlTotalPriceEl = document.getElementById('triple-luck-total-price');
    const tripleLuckPrice = 1000;

    if (tlTab1 && tlTab2 && tlTab1Content && tlTab2Content) {
        tlTab1.onclick = () => {
            tlTab1.classList.add('active', 'tab-button-luxury');
            tlTab2.classList.remove('active', 'tab-button-luxury');
            tlTab1Content.classList.remove('hidden');
            tlTab2Content.classList.add('hidden');
        };
        tlTab2.onclick = () => {
            tlTab2.classList.add('active', 'tab-button-luxury');
            tlTab1.classList.remove('active', 'tab-button-luxury');
            tlTab2Content.classList.remove('hidden');
            tlTab1Content.classList.add('hidden');
        };
    }

    tlBuyOptions.forEach(radio => {
        if (radio) {
            radio.onchange = () => {
                const selectedValue = parseInt(radio.value);
                if (tlTotalPriceEl) {
                    tlTotalPriceEl.textContent = `${(selectedValue * tripleLuckPrice).toLocaleString()}₮`;
                }
            };
        }
    });

    if (tlBuyBtn) {
        tlBuyBtn.onclick = () => {
            const selectedQuantity = parseInt(document.querySelector('input[name="triple-luck-buy-option"]:checked')?.value || '0');
            const totalCost = selectedQuantity * tripleLuckPrice;

            if (window.userBalanceManager) {
                if (confirm(`${selectedQuantity} ширхэг Triple Luck-ийг ${totalCost.toLocaleString()}₮-ээр худалдаж авах уу?`)) {
                    if (window.userBalanceManager.deduct(totalCost)) {
                        window.userBalanceManager.addHistory({
                            game: 'Triple Luck',
                            amount: -totalCost,
                            details: `Quantity: ${selectedQuantity}`,
                            result: 'Instant'
                        });
                        alert('Таны худалдан авалт амжилттай боллоо! Амжилт хүсье.');
                        closeModal('triple-luck-modal');
                    } else {
                        alert('Үлдэгдэл хүрэлцэхгүй байна. Цэнэглэнэ үү.');
                    }
                }
            } else {
                if (confirm(`${selectedQuantity} ширхэг Triple Luck-ийг ${tlTotalPriceEl?.textContent}-ээр худалдаж авах уу?`)) {
                    alert('Таны худалдан авалт амжилттай боллоо! Амжилт хүсье.');
                    closeModal('triple-luck-modal');
                }
            }
        };
    }
}
