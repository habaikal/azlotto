const express = require('express');
const crypto = require('crypto'); // For Secure RNG
const authMiddleware = require('../middleware/authMiddleware');
const userModel = require('../models/userModel');
const ticketModel = require('../models/ticketModel');
const transactionModel = require('../models/transactionModel');

const router = express.Router();

const LOTTO_PRICE = 1000;

// Helper: Secure Random Number Generator for Lotto 5/45
function generateSecureLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 5) {
        // Generate a random byte and use it to pick a number between 1 and 45 safely
        const randomBuffer = crypto.randomBytes(1);
        const randomNum = (randomBuffer[0] % 45) + 1;
        numbers.add(randomNum);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

// Purchase Ticket Route
router.post('/purchase', authMiddleware, async (req, res) => {
    const { gameType, selectedGames } = req.body;
    const userId = req.user.userId;

    if (!gameType || !selectedGames || !Array.isArray(selectedGames)) {
        return res.status(400).json({ error: 'Invalid purchase data' });
    }

    const gameCount = selectedGames.length;
    if (gameCount === 0 || gameCount > 5) {
        return res.status(400).json({ error: 'You can buy between 1 and 5 tickets at a time' });
    }

    const totalCost = gameCount * LOTTO_PRICE;

    try {
        // 1. Check Balance
        const currentBalance = await userModel.getBalance(userId);
        if (currentBalance < totalCost) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // 2. Deduct Balance
        await userModel.updateBalance(userId, -totalCost);

        // 3. Process Tickets using Secure RNG or User Selection
        const processedTickets = [];
        for (const game of selectedGames) {
            let numbers = game.numbers;
            if (game.isAuto) {
                numbers = generateSecureLottoNumbers();
            }
            // 4. Save Ticket
            const ticketId = await ticketModel.create(userId, gameType, numbers);
            processedTickets.push({ id: ticketId, numbers });
        }

        // 5. Record Transaction
        await transactionModel.create(
            userId,
            'purchase',
            -totalCost,
            `Purchased ${gameCount} tickets for ${gameType}`
        );

        // 6. Return new balance and tickets
        const newBalance = await userModel.getBalance(userId);

        res.json({
            message: 'Purchase successful',
            newBalance,
            tickets: processedTickets
        });

    } catch (err) {
        console.error('Purchase error:', err);
        // Note: In production with a real SQL DB (like Postgres), we'd use Transactions (BEGIN/COMMIT/ROLLBACK)
        res.status(500).json({ error: 'Internal server error during purchase' });
    }
});

// Get User's Purchase History
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const history = await transactionModel.findByUser(req.user.userId);
        res.json({ history });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Get User's Tickets
router.get('/tickets', authMiddleware, async (req, res) => {
    try {
        const tickets = await ticketModel.findByUser(req.user.userId);
        const parsedTickets = tickets.map(t => ({ ...t, numbers: JSON.parse(t.numbers) }));
        res.json({ tickets: parsedTickets });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

module.exports = router;
