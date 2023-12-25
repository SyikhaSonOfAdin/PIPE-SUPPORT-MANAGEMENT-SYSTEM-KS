const { Access } = require('./db-config');

class Database {
    #to = new Access();

    async PSMS() {
        // const connection = await this.#to.connect('pipesupportmanagementsystem');
        const connection = await this.#to.connect('syih2943_pipesupportmanagementsystem');

        try {
            await connection.connect();
            return connection;
        } catch (error) {
            console.error('Error connecting to Database:', error.message);
            throw error;
        }
    }

    async wareHouseSystem() {
        const connection = await this.#to.connect('kokohsemesta');

        try {
            await connection.connect();
            return connection;
        } catch (error) {
            console.error('Error connecting to Database:', error.message);
            throw error;
        }
    }

    async closeConnection(connection) {
        try {
            await connection.end();            
            // console.log('Connection closed successfully');
        } catch (error) {
            console.error('Error closing connection:', error.message);
        }
    }
}

module.exports = {
    Database
};
