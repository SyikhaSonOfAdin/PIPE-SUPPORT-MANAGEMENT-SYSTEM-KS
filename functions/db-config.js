const mysql = require('mysql2/promise');

class Access {
    #pool;

  constructor(database) {
    this.#pool = mysql.createPool({
      connectionLimit: 25,
      queueLimit: 50,
      host: 'localhost',
      // user: 'root',
      // password: '',
      user: 'syih2943_admin',      
      password: 'syikhaakmal19',
      database: database,
    });
  }

  async getConnection() {
    return await this.#pool.getConnection();
  }
}

const PSMS = new Access('syih2943_pipesupportmanagementsystem')

module.exports = {
    Access,
    PSMS
}
