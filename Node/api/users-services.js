const pool = require('../database/db-config');

module.exports = {
    getAllUsers: async (currentUserId) => {
        const result = await pool.query(
            `SELECT id, username, display_name, status
            FROM users
            WHERE id != $1
            ORDER BY display_name ASC`,
            [currentUserId]
        );
        return result.rows;
    }


};