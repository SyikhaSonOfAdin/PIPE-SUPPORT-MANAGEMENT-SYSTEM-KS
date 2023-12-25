const mysql = require('mysql2/promise');

class Access {
    #database;

    async connect(database) {
        this.#database = database ;

        try {
            const connection = await mysql.createConnection({
                connectionLimit : 10,
                host: 'localhost',
                user: 'root',
                // user: 'syih2943_admin',
                password: '',
                // password: 'syikhaakmal19',
                database: this.#database,
            });
            console.log('Connected to the database');
            return connection;
        } catch (error) {
            console.error('Error connecting to the database:', error);
            throw error;
        }
    }
}

module.exports = {
    Access
}