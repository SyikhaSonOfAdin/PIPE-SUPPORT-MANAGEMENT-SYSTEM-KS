const { Users } = require("../Tables/users");

class Middleware {
    #user = new Users();

    isAuthenticated = async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required in the request body' });
        }

        try {
            const validate = await this.#user.validateUser(email, password);

            if (validate.Authentication) {
                req.id = validate.Id ;
                req.level = validate.Level ;
                req.token = validate.Tokens ;
                req.username = validate.Username ;

                next();
            } else {
                return res.status(200).json({ message: 'Email or password are incorrect' });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: `Internal Server Error : ${error}` });
        }
    }

    isValidated = async (req, res, next) => {
        const user_id = req.query.user_id;
        const tokens = req.query.token;

        if (!tokens || !user_id) {
            return res.status(400).json({ Authentication: false });
        }

        try {
            
            const result = await this.#user.isHaveToken(user_id, tokens) ;

            if (result) {
                next();
            } else {
                return res.status(400).json({ message: 'Token is invalid' });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: `Internal Server Error : ${error}` });
        }
    }
}

module.exports = Middleware;