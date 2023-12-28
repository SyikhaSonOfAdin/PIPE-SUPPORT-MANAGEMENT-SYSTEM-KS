const { PSMS } = require("../db-config")


class Priority {

    async priorityDetail(type_ps, priority) {

        const connection = await PSMS.getConnection();
        const query = `SELECT * FROM priority WHERE TYPE_PS = (SELECT TYPE_PS FROM priority WHERE id = ?) AND PRIORITY = ? ;`
    
        try {
            return await connection.query(query, [type_ps, priority])
        } catch (e) {
            console.log(e.message)
        } finally {
            connection.release();
        }
    }

    async priorityGetData() {
        const connection = await PSMS.getConnection();
        // const query = "SELECT TYPE_PS, SUM(QTY) AS QTY, PRIORITY FROM priority GROUP BY TYPE_PS ORDER BY id ;";
        const query = `SELECT prio.id, prio.TYPE_PS, SUM(prio.QTY) AS QTY, prio.PRIORITY, dwg.status AS DWG_STATUS, fb.status AS FAB_STATUS FROM priority AS prio LEFT JOIN drawinglist AS dwg ON dwg.sum_jointdata_id = (SELECT jd.id FROM sum_jointdata AS jd WHERE jd.TYPE_PS = prio.TYPE_PS) LEFT JOIN fabricationlist AS fb ON fb.drawing_id = dwg.drawing_id GROUP BY prio.TYPE_PS, prio.PRIORITY ;`

        try {
            return await connection.query(query)
        } catch (e) {
            console.log(e.message)
        } finally {
            connection.release();
        }
    }

    async priorityInsertData(arrayOfPriorities) {
        const connection = await PSMS.getConnection();
        const query = "INSERT INTO priority (ISO_NO, TYPE_PS, QTY, PRIORITY) VALUES (?, ?, ?, ?)";

        try {
            for (let i = 0; i < arrayOfPriorities.length; i++) {
                let values = [
                    arrayOfPriorities[i]["ISO NO"], arrayOfPriorities[i]["TYPE PS"], arrayOfPriorities[i]["QTY"], arrayOfPriorities[i]["PRIORITY"]
                ]

                await connection.query(query, values)
            }
        } catch (e) {
            console.log(e.message)
        } finally {
            connection.release();
        }
    }
}

module.exports = {
    Priority
}