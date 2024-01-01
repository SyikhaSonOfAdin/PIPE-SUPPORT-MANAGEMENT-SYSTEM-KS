const { PSMS } = require("../db-config")


class Fitup {
    async insert(type_ps, iso_no, priority, qty, fitter, rfa_no, date, by) {
        const connection = await PSMS.getConnection()
        const query = [`INSERT INTO fitup (TYPE_PS, ISO_NO, PRIORITY, QTY, FITTER, RFA_NO, INPUT_DATE, INPUT_BY) VALUES ((SELECT TYPE_PS FROM priority WHERE id = ?), (SELECT ISO_NO FROM priority WHERE id = ?), ?, ?, ?, ?, ?, ?)`]
        const values = [[type_ps, iso_no, priority, qty, fitter, rfa_no, date, by]];

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

module.exports = Fitup