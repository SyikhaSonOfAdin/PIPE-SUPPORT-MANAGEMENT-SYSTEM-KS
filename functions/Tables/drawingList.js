const { Assignment } = require("./assigning");
const { PSMS } = require("../db-config")

class DrawingList {
    #assignment = new Assignment() ;

    async sendDrawing(user_id, assignment_id, sum_jointdata_id, file_name) {
        const connection = await PSMS.getConnection();

        try {
            await connection.query(
                'INSERT INTO drawinglist (sum_jointdata_id, assignment_id, user_id, upload_date, file_name) VALUES (?, ?, ?, NOW(), ?)',
                [sum_jointdata_id, assignment_id, user_id, file_name]
            );
            await this.#assignment.updateAssignment(assignment_id) ;
        } catch (error) {
            console.error('Error sending drawing:', error.message);
        } finally {            
            connection.release();
        }
    }    

    async statusUpdate(drawing_id, status) {
        const connection = await PSMS.getConnection();

        try {
            return connection.query('UPDATE drawinglist SET status = ? WHERE drawing_id = ?', [status, drawing_id]);
        } catch (error) {
            console.error('Error getting detail:', error.message);
        } finally {
            connection.release();
        }
    }

    async getDrawing(drawing_id) {
        const connection = await PSMS.getConnection();

        try {
            return await connection.query('SELECT * FROM drawinglist JOIN sum_jointdata AS jd ON drawinglist.sum_jointdata_id = jd.id WHERE drawing_id = ?', [drawing_id]);
        } catch (error) {
            console.error('Error getting drawing:', error.message);
        } finally {
            // Tutup koneksi setelah penggunaan.
            connection.release();
        }
    }

    async getDrawingAllAndFab() {
        const connection = await PSMS.getConnection();
        const query = `
        SELECT
        jd.id,
        jd.type_ps,
        assigned_by_user.username AS assigned_by,
        engineer_user.username AS engineer,
        DATE_FORMAT(ass.due_date, '%Y-%m-%d') AS due_date,
        DATE_FORMAT(ass.finished_date, '%Y-%m-%d') AS finished_date,
        (SELECT username FROM users WHERE id = ass.inspected_by) AS inspected_by,
        DATE_FORMAT(ass.inspected_date, '%Y-%m-%d') AS inspected_date,
        dw.drawing_id,
        dw.status AS dwg_status,
        fab.status AS fab_status
        FROM
            sum_jointdata AS jd
        LEFT JOIN
            assignment AS ass ON jd.id = ass.TYPE_PS
        LEFT JOIN
            users AS assigned_by_user ON ass.ASSIGNED_BY = assigned_by_user.id
        LEFT JOIN
            users AS engineer_user ON ass.ENGINEER = engineer_user.id
        LEFT JOIN
            drawinglist AS dw ON dw.sum_jointdata_id = jd.id
        LEFT JOIN
            fabricationlist AS fab ON fab.drawing_id = dw.drawing_id`;

        try {
            return await connection.query(query)
        } catch (error) {
            console.error('Error getting all drawings:', error.message);
        } finally {
            // Tutup koneksi setelah penggunaan.
            connection.release();
        }
    }
}

module.exports = {
    DrawingList
}
