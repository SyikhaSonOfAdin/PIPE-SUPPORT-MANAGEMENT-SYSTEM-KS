const { PSMS } = require("../db-config")


class Welding {
    async insert(type_ps, iso_no, priority, qty, welder, rfa_no, date, by) {
        const connection = await PSMS.getConnection()
        const query = [`INSERT INTO welding (TYPE_PS, ISO_NO, PRIORITY, QTY, WELDER, RFA_NO, INPUT_DATE, INPUT_BY) VALUES ((SELECT TYPE_PS FROM priority WHERE id = ?), (SELECT ISO_NO FROM priority WHERE id = ?), ?, ?, ?, ?, ?, ?)`]
        const values = [[type_ps, iso_no, priority, qty, welder, rfa_no, date, by]];

        try {
            return await connection.query(query[0], values[0]);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Welding