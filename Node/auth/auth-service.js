const pool = require('./../database/db-config');
const path = require("path");
module.exports = {
    loginUser: async(payload,callBack) => {
        const query = `Select * from users where email = $1`
        pool.query(query,[payload.email],(err,result)=>{
            if(err){
                return callBack(err)
            }
            return callBack(null,result)
        })
    },
    
    registerUser: async (payload, callBack) => {
        const { username, display_name, email, status,password } = payload;
        const query = `
      INSERT INTO users (username, display_name, email, status,created_at,password)
      VALUES ($1, $2, $3, $4, NOW(),$5)
      RETURNING *
    `;
        pool.query(query, [username, display_name, email, status,password], (err, resp) => {
            if (err) {
                return callBack(err);
            }
            return callBack(null, resp.rows);
        });
    },
    
}