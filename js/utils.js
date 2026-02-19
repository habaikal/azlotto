// Shared helper functions

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
                        if (djmResultText) djmResultText.textContent = `Баяр хүргэе! Та шагнал хожлоо!`;
                        win = true;
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

function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if(modal) modal.style.display = 'none';
        }

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

function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }
