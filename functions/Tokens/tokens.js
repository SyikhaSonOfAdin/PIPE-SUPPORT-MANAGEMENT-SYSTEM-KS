const { Database } = require("../db-connect");


class Tokens {
    #database = new Database();

    #generateToken = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            token += characters.charAt(randomIndex);
        }

        return token;
    }

    async userToken(user_id) {
        const connect = await this.#database.PSMS() ;
        const query = "INSERT INTO authentication (user_id, token) VALUES (?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token)"; 
        const token = this.#generateToken(64) ;

        return new Promise(async (resolve, reject) => {
            try {
                const process = await connect.query(query, [user_id, token]) ;
                resolve(token) ;
            } catch (error) {
                reject(error) ;
            }
        })
    }
}

module.exports = {
    Tokens
};
