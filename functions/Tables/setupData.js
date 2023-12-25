const { Database } = require("../db-connect");


class SetupData {
    #database = new Database();

    async setUp(arrayOfJoinData) {
        const connection = await this.#database.PSMS();
        const query = "INSERT INTO jointdata (ISO_NO, TYPE_PS, QTY) VALUES (?, ?, ?)";

        try {
            for (let i = 0; i < arrayOfJoinData.length; i++) {
                let values = [
                    arrayOfJoinData[i]["ISO NO"], arrayOfJoinData[i]["TYPE PS"], arrayOfJoinData[i]["QTY"]
                ]

                await connection.query(query, values)
            }
            await this.#triggerForGroupingData(connection);
        } catch (e) {
            console.log(e.message)
        } finally {
            await this.#database.closeConnection(connection);
        }
    }

    async #triggerForGroupingData(connection) {
        const query = "INSERT INTO sum_jointdata (SUM_QTY_OF_ISO_NO, TYPE_PS) SELECT DISTINCT COUNT(*) AS SUM_QTY_OF_ISO_NO, TYPE_PS FROM jointdata GROUP BY TYPE_PS";

        try {
            await connection.query(query);
        } catch (error) {
            console.log(error.message)
        }
    }

    async getDataGroup() {
        const connection = await this.#database.PSMS();
        const query = "SELECT jd.id AS id, jd.TYPE_PS, jd.SUM_QTY_OF_ISO_NO, users.username AS ENGINEER, DATE_FORMAT(ass.DUE_DATE, '%Y-%m-%d') AS DUE_DATE FROM `sum_jointdata` AS jd LEFT JOIN assignment AS ass ON jd.id = ass.TYPE_PS LEFT JOIN users ON ass.ENGINEER = users.id";

        try {
            return await connection.query(query)
        } catch (e) {
            console.log(e.message)
        } finally {
            await this.#database.closeConnection(connection);
        }
    }

    async getDataGroupFiltered() {
        const connection = await this.#database.PSMS();
        const query = "SELECT jd.id AS id, jd.TYPE_PS FROM `sum_jointdata` AS jd LEFT JOIN assignment AS a ON jd.id = a.TYPE_PS WHERE a.TYPE_PS IS NULL ORDER BY jd.id";

        try {
            return await connection.query(query)
        } catch (e) {
            console.log(e.message)
        } finally {
            await this.#database.closeConnection(connection);
        }
    }

    async getData() {
        const connection = await this.#database.PSMS();
        const query = "SELECT DISTINCT TYPE_PS FROM jointdata";

        try {
            return await connection.query(query)
        } catch (e) {
            console.log(e.message)
        } finally {
            await this.#database.closeConnection(connection);
        }
    }

    async isoDetail(type_ps_id) {
        const connection = await this.#database.PSMS();
        const query = "SELECT * FROM jointdata WHERE TYPE_PS = (SELECT TYPE_PS FROM sum_jointdata WHERE id = ?) ";

        const values = [type_ps_id]
        try {
            const result = await connection.query(query, values);
            // Lakukan sesuatu dengan hasil kueri, misalnya mengembalikan hasilnya
            return result;
        } catch (e) {
            console.log(e.message)
        } finally {
            await this.#database.closeConnection(connection);
        }
    }


    async forSetUp(arrayOfJoinData) {
        const connection = await this.#database.PSMS();
        const query = [
            `INSERT INTO assignment (ASSIGNED_BY, ENGINEER, TYPE_PS, DUE_DATE, FINISHED_DATE, INSPECTED_BY, INSPECTED_DATE, STATUS ) VALUES (1, 1, (SELECT jd.id FROM sum_jointdata AS jd WHERE jd.TYPE_PS = ? LIMIT 1), NOW(), NOW(), 1, NOW(), "Finished");`,
            `INSERT INTO drawinglist (sum_jointdata_id, assignment_id, user_id, upload_date, status, file_name) VALUES ((SELECT jd.id FROM sum_jointdata AS jd WHERE jd.TYPE_PS = ? LIMIT 1), (SELECT ass.id FROM assignment AS ass WHERE ass.TYPE_PS = (SELECT jd.id FROM sum_jointdata AS jd WHERE jd.TYPE_PS = ? LIMIT 1)), 1, NOW(), "Approved", ?);`
        ];

        try {
            for (let i = 0; i < arrayOfJoinData.length; i++) {
                let values = [
                    [arrayOfJoinData[i]["HEC STD NO"]],
                    [arrayOfJoinData[i]["HEC STD NO"], arrayOfJoinData[i]["HEC STD NO"], arrayOfJoinData[i]["NO DRAWING"]]
                ];

                for (let a = 0; a < query.length; a++) {
                    await connection.query(query[a], values[a]);
                }
            }            
        } catch (e) {
            console.log(e.message);
        } finally {
            await this.#database.closeConnection(connection);
        }
    }

}

module.exports = {
    SetupData
}