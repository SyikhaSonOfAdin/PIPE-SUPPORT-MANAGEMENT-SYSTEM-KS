const { PSMS } = require("../db-config") ;

class Assignment {


    async assigning(assignedBy, worker, typePs, dueDate) {
        const connection = await PSMS.getConnection();
      
        return new Promise(async (resolve, reject) => {
          try {
            await connection.query(
              "INSERT INTO assignment (ASSIGNED_BY, ENGINEER, TYPE_PS, DUE_DATE) VALUES (?, ?, ?, ?)",
              [assignedBy, worker, typePs, dueDate]
            );
            resolve("Assigning Successfully");
          } catch (error) {
            reject("Assigning Error: " + error.message); 
          } finally {
            connection.release();
          }
        });
      }
      

    async getAssignment(worker) {
        const connection = await PSMS.getConnection() ;

        try {
            return await connection.query('SELECT ass.id AS assignment_id, jd.id AS sum_joint_data, jd.TYPE_PS FROM assignment AS ass JOIN sum_jointdata AS jd ON ass.TYPE_PS = jd.id WHERE ENGINEER = ? AND STATUS = "Assigned"', [worker]);
        } catch (error) {
            return error
        } finally {
            connection.release() ;
        }
    }

    async updateAssignment(assignment_id) {
        const connection = await PSMS.getConnection();

        try {
            await connection.query(
                `UPDATE assignment SET FINISHED_DATE = NOW(), STATUS = 'Finished' WHERE id = ?`,
                [assignment_id]
            );
        } catch (error) {
            console.error('Error sending drawing:', error.message);
        } finally {            
            connection.release();
        }
    }

    async updateInspected(drawing_id, user_id) {
        const connection = await PSMS.getConnection();

        try {
            await connection.query(
                `UPDATE assignment SET INSPECTED_BY = ?, INSPECTED_DATE = NOW() WHERE TYPE_PS = (SELECT id FROM sum_jointdata WHERE id = (SELECT sum_jointdata_id FROM drawinglist WHERE drawing_id = ? ))`,
                [user_id, drawing_id]
            );
        } catch (error) {
            console.error('Error sending drawing:', error.message);
        } finally {            
            connection.release();
        }
    }
}

module.exports = {
    Assignment
}