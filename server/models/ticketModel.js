const { db } = require('../db/database');

const ticketModel = {
    create: (userId, gameType, numbers) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO tickets (user_id, game_type, numbers) VALUES (?, ?, ?)';
            // numbers should be a JSON string like "[1, 2, 3, 4, 5]"
            db.run(sql, [userId, gameType, JSON.stringify(numbers)], function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            });
        });
    },

    findByUser: (userId) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM tickets WHERE user_id = ? ORDER BY created_at DESC';
            db.all(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
};

module.exports = ticketModel;
