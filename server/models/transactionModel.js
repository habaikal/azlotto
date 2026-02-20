const { db } = require('../db/database');

const transactionModel = {
    create: (userId, type, amount, description) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO transactions (user_id, type, amount, description) VALUES (?, ?, ?, ?)';
            db.run(sql, [userId, type, amount, description], function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            });
        });
    },

    findByUser: (userId) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC';
            db.all(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
};

module.exports = transactionModel;
