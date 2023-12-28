const { Tokens } = require("../Tokens/tokens");
const { PSMS } = require("../db-config")



class Users {
    #tokens = new Tokens();

    validateUser = async (email, password) => {
        const connection = await PSMS.getConnection();
        
        try {
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
        } catch (error) {
            console.log(error)
        } finally {
            connection.release();

        }

    }

    async getUsers() {
        const connection = await PSMS.getConnection();

        try {
            return await connection.query("SELECT id, username FROM users");
        } catch (error) {
            console.log(error)
        } finally {
            connection.release();

        }
    }

    async isHaveToken(user_id, token) {
        const connection = await PSMS.getConnection();

        try {
            const result = await connection.query("SELECT user_id, token FROM authentication WHERE user_id = ? AND token = ?", [user_id, token]);

            if (result[0].length > 0) {
                return true
            }

            return false;
        } catch (error) {
            console.log(error)
        } finally {
            connection.release();
        }
    }
}


module.exports = {
    Users
}