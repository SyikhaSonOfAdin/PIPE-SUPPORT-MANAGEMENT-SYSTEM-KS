const { PSMS } = require("../db-config")


class Priority {

    async priorityDetail(param, type_ps, priority) {

        const connection = await PSMS.getConnection();
        let query ;
        if (param == "fitup") {
            query = `SELECT ft.TYPE_PS, ft.ISO_NO, ft.PRIORITY, ft.QTY, ft.FITTER, ft.RFA_NO, DATE_FORMAT(ft.INPUT_DATE, '%Y-%m-%d') AS INPUT_DATE, (SELECT username FROM users WHERE id = ft.INPUT_BY) AS INPUT_BY FROM fitup AS ft WHERE ft.TYPE_PS = (SELECT TYPE_PS FROM priority WHERE id = ?) AND ft.PRIORITY = ?;`;
        } else if (param == "welding") {
            query = `SELECT ft.TYPE_PS, ft.ISO_NO, ft.PRIORITY, ft.QTY, ft.WELDER, ft.RFA_NO, DATE_FORMAT(ft.INPUT_DATE, '%Y-%m-%d') AS INPUT_DATE, (SELECT username FROM users WHERE id = ft.INPUT_BY) AS INPUT_BY FROM welding AS ft WHERE ft.TYPE_PS = (SELECT TYPE_PS FROM priority WHERE id = ?) AND ft.PRIORITY = ?;`;                    
        } else if (param == "painting") {
            query = `SELECT ft.TYPE_PS, ft.ISO_NO, ft.PRIORITY, ft.QTY, ft.PAINTER, ft.RFA_NO, DATE_FORMAT(ft.INPUT_DATE, '%Y-%m-%d') AS INPUT_DATE, (SELECT username FROM users WHERE id = ft.INPUT_BY) AS INPUT_BY FROM painting AS ft WHERE ft.TYPE_PS = (SELECT TYPE_PS FROM priority WHERE id = ?) AND ft.PRIORITY = ?;`;                    
        } else if (param == "location") {
            query = `SELECT ft.TYPE_PS, ft.ISO_NO, ft.PRIORITY, ft.QTY, ft.AREA, ft.RFA_NO, DATE_FORMAT(ft.INPUT_DATE, '%Y-%m-%d') AS INPUT_DATE, (SELECT username FROM users WHERE id = ft.INPUT_BY) AS INPUT_BY FROM location AS ft WHERE ft.TYPE_PS = (SELECT TYPE_PS FROM priority WHERE id = ?) AND ft.PRIORITY = ?;`;                    
        } else if (param == "ho") {
            query = `SELECT ft.TYPE_PS, ft.ISO_NO, ft.PRIORITY, ft.QTY, ft.CLIENT, ft.PACKING_LIST_NO, DATE_FORMAT(ft.INPUT_DATE, '%Y-%m-%d') AS INPUT_DATE, (SELECT username FROM users WHERE id = ft.INPUT_BY) AS INPUT_BY FROM ho AS ft WHERE ft.TYPE_PS = (SELECT TYPE_PS FROM priority WHERE id = ?) AND ft.PRIORITY = ?;`;                    
        } else {
            query = `SELECT * FROM priority WHERE TYPE_PS = (SELECT TYPE_PS FROM priority WHERE id = ?) AND PRIORITY = ?;`;
        }
    
        try {
            return await connection.query(query, [type_ps, priority])
        } catch (e) {
            console.log(e.message)
            throw e ;
        } finally {
            connection.release();
        }
    }

    async priorityGetData() {
        const connection = await PSMS.getConnection();
        const query = `SELECT prio.id, prio.TYPE_PS, SUM(prio.QTY) AS QTY, prio.PRIORITY, dwg.status AS DWG_STATUS, fb.status AS FAB_STATUS, COALESCE((SELECT SUM(QTY) FROM fitup AS ft WHERE ft.TYPE_PS = prio.TYPE_PS AND ft.PRIORITY = prio.PRIORITY ), 0) AS FITUP, COALESCE((SELECT SUM(QTY) FROM welding AS wel WHERE wel.TYPE_PS = prio.TYPE_PS AND wel.PRIORITY = prio.PRIORITY ), 0) AS WELDING, 
        COALESCE((SELECT SUM(QTY) FROM painting AS paint WHERE paint.TYPE_PS = prio.TYPE_PS AND paint.PRIORITY = prio.PRIORITY ), 0) AS PAINTING, COALESCE((SELECT SUM(QTY) FROM location AS loc WHERE loc.TYPE_PS = prio.TYPE_PS AND loc.PRIORITY = prio.PRIORITY ), 0) AS LOCATION, 
        COALESCE((SELECT SUM(QTY) FROM ho AS ho WHERE ho.TYPE_PS = prio.TYPE_PS AND ho.PRIORITY = prio.PRIORITY ), 0) AS HO FROM priority AS prio LEFT JOIN drawinglist AS dwg ON dwg.sum_jointdata_id = (SELECT jd.id FROM sum_jointdata AS jd WHERE jd.TYPE_PS = prio.TYPE_PS) LEFT JOIN fabricationlist AS fb ON fb.drawing_id = dwg.drawing_id GROUP BY prio.TYPE_PS, prio.PRIORITY ;`

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
            throw e
        } finally {
            connection.release();
        }
    }
}

module.exports = {
    Priority
}