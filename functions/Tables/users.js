const { Tokens } = require("../Tokens/tokens");
const { Database } = require("../db-connect");


class Users {
    #database = new Database();
    #tokens = new Tokens();

    validateUser = async (email, password) => {
        const connection = await this.#database.PSMS();
        const validateEmail = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
        if (validateEmail[0].length > 0) {
            const user = validateEmail[0][0];
            if (password === user.password) {
                const token = await this.#tokens.userToken(user.id);
                return {
                    Authentication: true,
                    Id: user.id,
                    Email: user.email,
                    Password: user.password,
                    Username: user.username,
                    Level: user.level,
                    Tokens: token
                }
            } else {
                return {
                    Authentication: false,
                }
            }
        } else {
            return {
                Authentication: false,
            }
        }
    }

    async getUsers() {
        const connection = await this.#database.PSMS();

        try {
            return await connection.query("SELECT id, username FROM users");
        } catch (error) {
            console.log(error)
        } finally {
            await this.#database.closeConnection(connection);

        }
    }

    async isHaveToken(user_id, token) {
        const connection = await this.#database.PSMS();

        try {
            const result = await connection.query("SELECT user_id, token FROM authentication WHERE user_id = ? AND token = ?", [user_id, token]);

            if (result[0].length > 0) {
                return true
            } 

            return false ;
        } catch (error) {
            console.log(error)
        } finally {
            await this.#database.closeConnection(connection);
        }
    }
}


module.exports = {
    Users
}