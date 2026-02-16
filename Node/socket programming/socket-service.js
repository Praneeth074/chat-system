const pool = require('../database/db-config');

module.exports = {
    saveMessage: async ({ userId, text }) => {
        const query = `
            INSERT INTO broadcast_messages (userid, message, created_at)
            VALUES ($1, $2, NOW())
            RETURNING *
        `;
        const values = [userId, text];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    getAllMessages: async () =>{
        const query = `SELECT * FROM broadcast_messages ORDER BY created_at ASC`;
        const result = await pool.query(query);
        return result.rows;
    },
    createRoomIfNotExists: async (roomId, user1, user2) => {
        await pool.query(`INSERT INTO private_chat_rooms(room_id, user1_id, user2_id)
            VALUES ($1,$2,$3) ON CONFLICT (room_id) DO NOTHING`,
            [roomId, user1, user2]
        );
    },
    getRoomSettings: async (roomId) => {
        const result = await pool.query(
            `SELECT vanish_mode FROM private_chat_rooms WHERE room_id = $1`,
            [roomId]
        );
        return result.rows[0];
    },

    getPrivateMessages: async (roomId) => {
        const result = await pool.query(
            `SELECT * FROM private_messages WHERE room_id = $1 ORDER BY created_at ASC`,
            [roomId]
        );
        return result.rows;
    },
    savePrivateMessage: async (data) => {
        const result = await pool.query(
            `INSERT INTO private_messages(room_id, sender_id, message, vanish_mode)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [
                data.roomId,
                data.senderId,
                data.message,
                data.vanishMode
            ]
        );
        return result.rows[0];
    },
    updateRoomVanishMode: async (roomId, user1, user2, vanishMode) => {
        await pool.query(
            `INSERT INTO private_chat_rooms(room_id, user1_id, user2_id, vanish_mode)
            VALUES ($1,$2,$3,$4) ON CONFLICT (room_id)
            DO UPDATE SET vanish_mode = $4, updated_at = NOW()`,
            [roomId, user1, user2, vanishMode]
        );
    },

    deleteVanishMessages: async (roomId) => {
        await pool.query(
            `DELETE FROM private_messages WHERE room_id = $1 AND vanish_mode = TRUE`,
            [roomId]
        );
    },
};
