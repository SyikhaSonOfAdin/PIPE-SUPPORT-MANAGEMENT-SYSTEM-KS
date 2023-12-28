const { PSMS } = require("../db-config")


class Mto {

  async getSumOfMto() {
    const connection = await PSMS.getConnection()
    // const query = `
    // SELECT fd.FABRICATION_ITEM, fd.ITEM_CODE, fd.MATERIAL, fd.PAINT_CODE, fd.DIM1, fd.DIM2, fd.DIM3, fd.DIM4, fd.DIM5, fd.DIM6, fd.DIM7, fd.DIM8, fd.DIM9, fd.DIM10, fd.QTY, fd.QTY_UNIT, fd.NETTO_WEIGHT,
    //  fd.PAINTING_AREA, ROUND(SUM(fd.QTY * jd.SUM_QTY_OF_ISO_NO), 2) AS TOTAL_QTY, SUM(prio.QTY) AS NESTING, ROUND(SUM(fd.QTY_UNIT * jd.SUM_QTY_OF_ISO_NO), 2) AS TOTAL_QTY_UNIT, 
    //  ROUND(SUM(fd.NETTO_WEIGHT * jd.SUM_QTY_OF_ISO_NO), 2) AS TOTAL_NETT_WEIGHT, ROUND(SUM(fd.PAINTING_AREA * jd.SUM_QTY_OF_ISO_NO), 2) AS TOTAL_SHAPE 
    //  FROM fabricationdetail AS fd JOIN drawinglist AS draw ON fd.drawing_id = draw.drawing_id JOIN sum_jointdata AS jd ON draw.sum_jointdata_id = jd.id LEFT JOIN priority AS prio ON jd.TYPE_PS = prio.TYPE_PS WHERE fd.LP = "NO" 
    //  GROUP BY fd.ITEM_CODE, fd.MATERIAL, fd.PAINT_CODE, fd.DIM1, fd.DIM2, fd.DIM3, fd.DIM4, fd.DIM5, fd.DIM6, fd.DIM7, fd.DIM8, fd.DIM9, fd.DIM10;`;
    const query = `SELECT fd.id, fd.ITEM_CODE, fd.MATERIAL, fd.SHAPE_CODE AS PAINT_CODE, fd.DIM1, fd.DIM2, fd.DIM3, fd.DIM4, fd.DIM5, fd.DIM6, fd.DIM7, fd.DIM8, fd.DIM9, fd.DIM10, fd.MTO, fd.NETTO_WEIGHT, fd.AREA AS PAINTING_AREA,
                  fd.MTO AS TOTAL_QTY, fd.NESTING, fd.CUTTING, fd.BALANCE, fd.ISSUED, fd.STOCK FROM summary AS fd ORDER BY ITEM_CODE`


    try {
      return await connection.query(query);
    } catch (error) {
      return error
    } finally {
      connection.release();

    }
  }


  async getType_psBySumm_id(summary_id) {
    const connection = await PSMS.getConnection()
    const query = [`SELECT DISTINCT prio.id, prio.TYPE_PS FROM priority AS prio WHERE prio.TYPE_PS IN (SELECT sjd.TYPE_PS FROM sum_jointdata AS sjd WHERE sjd.id IN (SELECT dwg.sum_jointdata_id FROM drawinglist AS dwg WHERE dwg.drawing_id IN 
      (SELECT fd.drawing_id AS drawing FROM fabricationdetail AS fd JOIN summary AS summ ON summ.id = ? WHERE fd.ITEM_CODE = summ.ITEM_CODE AND fd.MATERIAL = summ.MATERIAL
      AND fd.PAINT_CODE = summ.SHAPE_CODE AND fd.DIM1 = summ.DIM1 AND fd.DIM2 = summ.DIM2 AND fd.DIM3 = summ.DIM3 AND fd.DIM4 = summ.DIM4 AND fd.DIM5 = summ.DIM5
      AND fd.DIM6 = summ.DIM6 AND fd.DIM7 = summ.DIM7 AND fd.DIM8 = summ.DIM8 AND fd.DIM9 = summ.DIM9 AND fd.DIM10 = summ.DIM10))) GROUP BY prio.TYPE_PS ;`]
    const values = [[summary_id]];

    try {
      return await connection.query(query[0], values[0]);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      connection.release();

    }
  }


  async getType_psBySearch(summary_id, search) {
    const connection = await PSMS.getConnection()
    const query = [`SELECT DISTINCT prio.id, prio.TYPE_PS FROM priority AS prio WHERE prio.TYPE_PS IN (SELECT sjd.TYPE_PS FROM sum_jointdata AS sjd WHERE sjd.id IN (SELECT dwg.sum_jointdata_id FROM drawinglist AS dwg WHERE dwg.drawing_id IN 
      (SELECT fd.drawing_id AS drawing FROM fabricationdetail AS fd JOIN summary AS summ ON summ.id = ? WHERE fd.ITEM_CODE = summ.ITEM_CODE AND fd.MATERIAL = summ.MATERIAL
      AND fd.PAINT_CODE = summ.SHAPE_CODE AND fd.DIM1 = summ.DIM1 AND fd.DIM2 = summ.DIM2 AND fd.DIM3 = summ.DIM3 AND fd.DIM4 = summ.DIM4 AND fd.DIM5 = summ.DIM5
      AND fd.DIM6 = summ.DIM6 AND fd.DIM7 = summ.DIM7 AND fd.DIM8 = summ.DIM8 AND fd.DIM9 = summ.DIM9 AND fd.DIM10 = summ.DIM10 AND prio.TYPE_PS LIKE CONCAT('%', ?, '%')))) GROUP BY prio.TYPE_PS ;`]
    const values = [[summary_id, search]];

    try {
      return await connection.query(query[0], values[0]);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      connection.release();

    }
  }


  async getIso_noByPrio_id(prio_id) {
    const connection = await PSMS.getConnection()
    const query = [`SELECT * FROM priority AS prio WHERE prio.TYPE_PS = (SELECT TYPE_PS FROM priority WHERE id = ? );`]
    const values = [[prio_id]];

    try {
      return await connection.query(query[0], values[0]);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      connection.release();

    }
  }


  async getIso_noByBySearch(prio_id, search) {
    const connection = await PSMS.getConnection()
    const query = [`SELECT * FROM priority AS prio WHERE prio.TYPE_PS = (SELECT TYPE_PS FROM priority WHERE id = ? ) AND ISO_NO LIKE CONCAT('%', ?, '%');`]
    const values = [[prio_id, search]];

    try {
      return await connection.query(query[0], values[0]);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      connection.release();

    }
  }


  async getPriority(type_ps, iso_no) {
    const connection = await PSMS.getConnection()
    const query = [`SELECT * FROM priority AS prio WHERE prio.TYPE_PS = (SELECT TYPE_PS FROM priority WHERE id = ? ) AND ISO_NO = (SELECT ISO_NO FROM priority WHERE id = ? );`]
    const values = [[type_ps, iso_no]];

    try {
      return await connection.query(query[0], values[0]);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      connection.release();
    }
  }


  async getNestingDetail(sum_id) {
    const connection = await PSMS.getConnection()
    const query = [`SELECT prio.*
    FROM priority AS prio
    JOIN sum_jointdata AS jd ON prio.TYPE_PS = jd.TYPE_PS
    JOIN drawinglist AS dwg ON jd.id = dwg.sum_jointdata_id
    JOIN fabricationdetail AS fdOuter ON dwg.drawing_id = fdOuter.drawing_id
    JOIN summary AS s ON s.ITEM_CODE = fdOuter.ITEM_CODE
                      AND s.MATERIAL = fdOuter.MATERIAL
                      AND s.DIM1 = fdOuter.DIM1
                      AND s.DIM2 = fdOuter.DIM2
                      AND s.DIM3 = fdOuter.DIM3
                      AND s.DIM4 = fdOuter.DIM4
                      AND s.DIM5 = fdOuter.DIM5
                      AND s.DIM6 = fdOuter.DIM6
                      AND s.DIM7 = fdOuter.DIM7
                      AND s.DIM8 = fdOuter.DIM8
                      AND s.DIM9 = fdOuter.DIM9
                      AND s.DIM10 = fdOuter.DIM10
    WHERE s.id = ?;
    `]
    const values = [[sum_id]];

    try {
      return await connection.query(query[0], values[0]);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      connection.release();

    }
  }


  async getJointDataBySummId(sum_id) {
    const connection = await PSMS.getConnection()

    const query = [`SELECT joint.*
    FROM jointdata AS joint
    JOIN sum_jointdata AS jd ON joint.TYPE_PS = jd.TYPE_PS
    JOIN drawinglist AS dwg ON jd.id = dwg.sum_jointdata_id
    JOIN fabricationdetail AS fdOuter ON dwg.drawing_id = fdOuter.drawing_id
    JOIN summary AS s ON s.ITEM_CODE = fdOuter.ITEM_CODE
        AND s.MATERIAL = fdOuter.MATERIAL
        AND s.DIM1 = fdOuter.DIM1
        AND s.DIM2 = fdOuter.DIM2
        AND s.DIM3 = fdOuter.DIM3
        AND s.DIM4 = fdOuter.DIM4
        AND s.DIM5 = fdOuter.DIM5
        AND s.DIM6 = fdOuter.DIM6
        AND s.DIM7 = fdOuter.DIM7
        AND s.DIM8 = fdOuter.DIM8
        AND s.DIM9 = fdOuter.DIM9
        AND s.DIM10 = fdOuter.DIM10
    WHERE s.id = ?;
    `]
    const values = [[sum_id]];

    try {
      return await connection.query(query[0], values[0]);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      connection.release();

    }
  }


  async insertSumOfMto() {
    const connection = await PSMS.getConnection()


    const query = `
    INSERT INTO summary (
      ITEM_CODE, MATERIAL, SHAPE_CODE, DIM1, DIM2, DIM3, DIM4, DIM5, DIM6, DIM7, DIM8, DIM9, DIM10, NETTO_WEIGHT, AREA, MTO, NESTING, BALANCE
  )
  SELECT
      fdOuter.ITEM_CODE, fdOuter.MATERIAL, fdOuter.PAINT_CODE, fdOuter.DIM1, fdOuter.DIM2, fdOuter.DIM3, fdOuter.DIM4, fdOuter.DIM5, fdOuter.DIM6, fdOuter.DIM7, fdOuter.DIM8, fdOuter.DIM9, fdOuter.DIM10,
      fdOuter.NETTO_WEIGHT, fdOuter.PAINTING_AREA,
      (
          SELECT SUM(jd.SUM_QTY_OF_ISO_NO * fd.QTY) AS sum_jointdata
          FROM sum_jointdata AS jd
                   JOIN drawinglist AS dwg ON jd.id = dwg.sum_jointdata_id
                   JOIN fabricationdetail AS fd ON dwg.drawing_id = fd.drawing_id
          WHERE fd.LP = "NO"
            AND (
                     fd.ITEM_CODE, fd.MATERIAL, fd.PAINT_CODE, fd.DIM1, fd.DIM2, fd.DIM3, fd.DIM4, fd.DIM5,
                     fd.DIM6, fd.DIM7, fd.DIM8, fd.DIM9, fd.DIM10
                 ) = (
                     SELECT
                         fbd.ITEM_CODE, fbd.MATERIAL, fbd.PAINT_CODE, fbd.DIM1, fbd.DIM2, fbd.DIM3, fbd.DIM4, fbd.DIM5,
                         fbd.DIM6, fbd.DIM7, fbd.DIM8, fbd.DIM9, fbd.DIM10
                     FROM fabricationdetail AS fbd
                     WHERE fbd.fabDetail_id = fdOuter.fabDetail_id
                 )
      ) AS TOTAL_QTY,
      SUM(prio.QTY * fdOuter.QTY) AS NESTING,
      SUM(prio.QTY * fdOuter.QTY) AS BALANCE
  FROM fabricationdetail AS fdOuter
           JOIN drawinglist AS draw ON fdOuter.drawing_id = draw.drawing_id
           JOIN sum_jointdata AS jd ON draw.sum_jointdata_id = jd.id
           LEFT JOIN priority AS prio ON jd.TYPE_PS = prio.TYPE_PS
  WHERE fdOuter.LP = "NO"
    AND NOT EXISTS (
      SELECT 1
      FROM summary AS s
      WHERE s.ITEM_CODE = fdOuter.ITEM_CODE
        AND s.MATERIAL = fdOuter.MATERIAL
        AND s.DIM1 = fdOuter.DIM1
        AND s.DIM2 = fdOuter.DIM2
        AND s.DIM3 = fdOuter.DIM3
        AND s.DIM4 = fdOuter.DIM4
        AND s.DIM5 = fdOuter.DIM5
        AND s.DIM6 = fdOuter.DIM6
        AND s.DIM7 = fdOuter.DIM7
        AND s.DIM8 = fdOuter.DIM8
        AND s.DIM9 = fdOuter.DIM9
        AND s.DIM10 = fdOuter.DIM10
    )
  GROUP BY
      fdOuter.ITEM_CODE, fdOuter.MATERIAL, fdOuter.PAINT_CODE, fdOuter.DIM1, fdOuter.DIM2, fdOuter.DIM3, fdOuter.DIM4, fdOuter.DIM5,
      fdOuter.DIM6, fdOuter.DIM7, fdOuter.DIM8, fdOuter.DIM9, fdOuter.DIM10;  
    `;

    try {
      // await this.#deleteFromMto(connection);

      const result = await connection.query(query);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      connection.release();

    }
  }


  async insertCutting(summary_id, pic, qty, input_date, input_by_id) {
    const connection = await PSMS.getConnection()

    const query = ['INSERT INTO cutting (summary_id, PIC, QTY, INPUT_DATE, INPUT_BY) VALUES (?, ?, ?, ?, ?)',
      'UPDATE summary AS sum SET CUTTING = sum.CUTTING + ?, BALANCE = sum.BALANCE - ?, STOCK = sum.STOCK + ? WHERE sum.id = ?'];
    const values = [[summary_id, pic, qty, input_date, input_by_id], [qty, qty, qty, summary_id]]

    try {
      for (let i = 0; i < query.length; i++) {
        await connection.query(query[i], values[i]);
      }
    } catch (error) {
      console.error(error);
      throw error; // Lempar kembali kesalahan untuk ditangani di lapisan yang lebih tinggi
    } finally {
      connection.release();

    }
  }


  async insertIssued(summary_id, type_ps, iso_no, qty, fitter, input_date, input_by_id) {
    const connection = await PSMS.getConnection()

    const query = ['INSERT INTO issued (summary_id, TYPE_PS, ISO_NO, QTY, FITTER, INPUT_DATE, INPUT_BY) VALUES (?, (SELECT TYPE_PS FROM priority WHERE id = ?), ?, ?, ?, ?, ?)',
      'UPDATE summary AS sum SET ISSUED = sum.ISSUED + ?, STOCK = sum.STOCK - ? WHERE sum.id = ?'];
    const values = [[summary_id, type_ps, iso_no, qty, fitter, input_date, input_by_id], [qty, qty, summary_id]]

    try {
      for (let i = 0; i < query.length; i++) {
        await connection.query(query[i], values[i]);
      }
    } catch (error) {
      console.error(error);
      throw error; // Lempar kembali kesalahan untuk ditangani di lapisan yang lebih tinggi
    } finally {
      connection.release();

    }
  }


  async #deleteFromMto(connection) {
    const query = 'DELETE FROM summary;';

    return new Promise(async (resolve, reject) => {
      try {
        const result = await connection.query(query);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = {
  Mto
};