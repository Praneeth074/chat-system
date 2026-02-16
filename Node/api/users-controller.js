const { getAllUsers } = require('./users-services');

module.exports = {
    fetchUsers: async (req, res) => {
        try {
            const userId = req.user.ID; 
            const users = await getAllUsers(userId);
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};
