const { db } = require('../db/database');

const userModel = {
    findByUsername: (username) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username = ?';
            db.get(sql, [username], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },

    create: (username, hashedPassword) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (username, password, balance) VALUES (?, ?, ?)';
            // Give new users a starting balance for simulation purposes, or 0.
            db.run(sql, [username, hashedPassword, 50000], function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            });
        });
    },

    updateBalance: (userId, amountChange) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE users SET balance = balance + ? WHERE id = ?';
            db.run(sql, [amountChange, userId], function (err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    },

    getBalance: (userId) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT balance FROM users WHERE id = ?';
            db.get(sql, [userId], (err, row) => {
                if (err) return reject(err);
                resolve(row.balance);
            });
        });
    }
};

module.exports = userModel;
