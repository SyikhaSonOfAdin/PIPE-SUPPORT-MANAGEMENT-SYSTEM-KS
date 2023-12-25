const { Database } = require("../db-connect");

class FabList {
    #database = new Database();

    async sendFabFile(drawing_id, fabList_name) {
        const connection = await this.#database.PSMS();
        const prevent = await this.processData(drawing_id);

        if (prevent) {
            await connection.query("DELETE FROM fabricationlist WHERE drawing_id = ?", [drawing_id]);
        }

        try {
            return (await this.#database.PSMS()).query('INSERT INTO fabricationlist (drawing_id, user_id, uploadDate, fabList_name) VALUES (?, (SELECT user_id FROM drawinglist WHERE drawing_id = ?), NOW(), ?)', [drawing_id, drawing_id, fabList_name])
        } catch (error) {
            console.error('Error send file  :', error.message);
        } finally {
            await this.#database.closeConnection(connection);
        }
    }


    async #sendDetail({
        drawing_id, LP, HEC_STD_NO, SUPPORT_NO, NO_DRAWING, FABRICATION_ITEM, ITEM_CODE, MATERIAL, PAINT_CODE, DIM1, DIM2, DIM3, DIM4, DIM5, DIM6, DIM7, DIM8, DIM9, DIM10, QTY, QTY_UNIT, NETTO_WEIGHT, PAINTING_AREA
    }, conn) {

        try {
            const query = `
                INSERT INTO fabricationdetail (drawing_id, LP, HEC_STD_NO, SUPPORT_NO, NO_DRAWING, FABRICATION_ITEM, ITEM_CODE, MATERIAL, PAINT_CODE, DIM1, DIM2, DIM3, DIM4, DIM5, DIM6, DIM7, DIM8, DIM9, DIM10, QTY, QTY_UNIT, NETTO_WEIGHT, PAINTING_AREA)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `;
            const values = [
                drawing_id, LP, HEC_STD_NO, SUPPORT_NO, NO_DRAWING, FABRICATION_ITEM, ITEM_CODE, MATERIAL, PAINT_CODE, DIM1, DIM2, DIM3, DIM4, DIM5, DIM6, DIM7, DIM8, DIM9, DIM10, QTY, QTY_UNIT, NETTO_WEIGHT, PAINTING_AREA
            ];
            return (await conn).query(query, values);
        } catch (error) {
            console.log('Error sending detail:', error.message);
        }
    }


    async #sendDetailTemp({
        LP, HEC_STD_NO, SUPPORT_NO, NO_DRAWING, FABRICATION_ITEM, ITEM_CODE, MATERIAL, PAINT_CODE, DIM1, DIM2, DIM3, DIM4, DIM5, DIM6, DIM7, DIM8, DIM9, DIM10, QTY, QTY_UNIT, NETTO_WEIGHT, PAINTING_AREA
    }, conn) {

        try {
            const query = `
                INSERT INTO fabricationdetail (drawing_id, sum_jointdata_id, LP, HEC_STD_NO, SUPPORT_NO, NO_DRAWING, FABRICATION_ITEM, ITEM_CODE, MATERIAL, PAINT_CODE, DIM1, DIM2, DIM3, DIM4, DIM5, DIM6, DIM7, DIM8, DIM9, DIM10, QTY, QTY_UNIT, NETTO_WEIGHT, PAINTING_AREA)
                VALUES ((SELECT dwg.drawing_id FROM drawinglist AS dwg WHERE dwg.sum_jointdata_id = (SELECT jd.id FROM sum_jointdata AS jd WHERE jd.TYPE_PS = ? LIMIT 1)), (SELECT jd.id FROM sum_jointdata AS jd WHERE jd.TYPE_PS = ? LIMIT 1), ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `;
            const values = [
                HEC_STD_NO, HEC_STD_NO, LP, HEC_STD_NO, SUPPORT_NO, NO_DRAWING, FABRICATION_ITEM, ITEM_CODE, MATERIAL, PAINT_CODE, DIM1, DIM2, DIM3, DIM4, DIM5, DIM6, DIM7, DIM8, DIM9, DIM10, QTY, QTY_UNIT, NETTO_WEIGHT, PAINTING_AREA
            ];
            return (await conn).query(query, values);
        } catch (error) {
            console.log('Error sending detail:', error.message);
        }
    }


    async detailProcess(drawing_id, arrayOfDetail) {
        const connection = await this.#database.PSMS();
        const prevent = await this.processData(drawing_id);

        if (prevent) {
            await connection.query("DELETE FROM fabricationdetail WHERE drawing_id = ?", [drawing_id]);
        }

        try {
            for (var i = 0; i < arrayOfDetail.length; i++) {

                const fieldsToCheck = [
                    'LP', 'HEC STD NO', 'SUPPORT NO', 'NO DRAWING', 'FABRICATION ITEM', 'ITEM CODE', 'MATERIAL', 'PAINT CODE', 'DIM1', 'DIM2', 'DIM3',
                    'DIM4', 'DIM5', 'DIM6', 'DIM7', 'DIM8', 'DIM9', 'DIM10', 'QTY', 'QTY UNIT', 'NETTO WEIGHT', 'PAINTING AREA'
                ];
                for (const i of arrayOfDetail) {
                    for (const field of fieldsToCheck) {
                        if (i[field] == null) {
                            i[field] = 0;
                        }
                    }
                }

                // await this.#sendDetail({
                //     drawing_id: drawing_id,
                //     LP: arrayOfDetail[i].LP,
                //     HEC_STD_NO: arrayOfDetail[i]['HEC STD NO'],
                //     SUPPORT_NO: arrayOfDetail[i]['SUPPORT NO'],
                //     NO_DRAWING: arrayOfDetail[i]['NO DRAWING'],
                //     FABRICATION_ITEM: arrayOfDetail[i]['FABRICATION ITEM'],
                //     ITEM_CODE: arrayOfDetail[i]['ITEM CODE'],
                //     MATERIAL: arrayOfDetail[i]['MATERIAL'],
                //     PAINT_CODE: arrayOfDetail[i]['PAINT CODE'],
                //     DIM1: arrayOfDetail[i].DIM1,
                //     DIM2: arrayOfDetail[i].DIM2,
                //     DIM3: arrayOfDetail[i].DIM3,
                //     DIM4: arrayOfDetail[i].DIM4,
                //     DIM5: arrayOfDetail[i].DIM5,
                //     DIM6: arrayOfDetail[i].DIM6,
                //     DIM7: arrayOfDetail[i].DIM7,
                //     DIM8: arrayOfDetail[i].DIM8,
                //     DIM9: arrayOfDetail[i].DIM9,
                //     DIM10: arrayOfDetail[i].DIM10,
                //     QTY: arrayOfDetail[i].QTY,
                //     QTY_UNIT: arrayOfDetail[i]['QTY UNIT'].toFixed(2),
                //     NETTO_WEIGHT: arrayOfDetail[i]['NETTO WEIGHT'].toFixed(2),
                //     PAINTING_AREA: arrayOfDetail[i]['PAINTING AREA']
                // }, connection)

                await this.#sendDetailTemp({
                    LP: arrayOfDetail[i].LP,
                    HEC_STD_NO: arrayOfDetail[i]['HEC STD NO'],
                    SUPPORT_NO: arrayOfDetail[i]['SUPPORT NO'],
                    NO_DRAWING: arrayOfDetail[i]['NO DRAWING'],
                    FABRICATION_ITEM: arrayOfDetail[i]['FABRICATION ITEM'],
                    ITEM_CODE: arrayOfDetail[i]['ITEM CODE'],
                    MATERIAL: arrayOfDetail[i]['MATERIAL'],
                    PAINT_CODE: arrayOfDetail[i]['PAINT CODE'],
                    DIM1: arrayOfDetail[i].DIM1,
                    DIM2: arrayOfDetail[i].DIM2,
                    DIM3: arrayOfDetail[i].DIM3,
                    DIM4: arrayOfDetail[i].DIM4,
                    DIM5: arrayOfDetail[i].DIM5,
                    DIM6: arrayOfDetail[i].DIM6,
                    DIM7: arrayOfDetail[i].DIM7,
                    DIM8: arrayOfDetail[i].DIM8,
                    DIM9: arrayOfDetail[i].DIM9,
                    DIM10: arrayOfDetail[i].DIM10,
                    QTY: arrayOfDetail[i].QTY,
                    QTY_UNIT: arrayOfDetail[i]['QTY UNIT'].toFixed(2),
                    NETTO_WEIGHT: arrayOfDetail[i]['NETTO WEIGHT'].toFixed(2),
                    PAINTING_AREA: arrayOfDetail[i]['PAINTING AREA']
                }, connection)
            }

        } catch (error) {
            console.log('Error sending detail:', error.message);
        } finally {
            await this.#database.closeConnection(connection);
        }


    }

    async statusUpdate(drawing_id, status) {
        const connection = await this.#database.PSMS();

        try {
            return await connection.query('UPDATE fabricationlist SET status = ? WHERE drawing_id = ?', [status, drawing_id]);
        } catch (error) {
            console.error('Error getting detail:', error.message);
        } finally {
            await this.#database.closeConnection(connection);
        }
    }

    // GET FAB
    async getFabByDrawingId(drawingId) {
        const connection = await this.#database.PSMS();

        try {
            return (await this.#database.PSMS()).query('SELECT * FROM fabricationlist WHERE drawing_id = ?', [drawingId]);
        } catch (error) {
            console.error('Error getting detail:', error.message);
        } finally {
            await this.#database.closeConnection(connection);
        }
    }


    // GET DETAIL OF FABLIST
    async getDetailbyDetailId(fabDetail_id) {
        const connection = await this.#database.PSMS();

        try {
            return (await this.#database.PSMS()).query('SELECT * FROM fabricationdetails WHERE fabDetail_id = ?', [fabDetail_id]);
        } catch (error) {
            console.error('Error getting detail:', error.message);
        } finally {
            await this.#database.closeConnection(connection);
        }
    }


    async getDetailbyDrawingNo(drawingNo) {
        const connection = await this.#database.PSMS();

        try {
            return (await this.#database.PSMS()).query('SELECT * FROM fabricationdetail WHERE NO_DRAWING = ?', [drawingNo]);
        } catch (error) {
            console.error('Error getting detail:', error.message);
        } finally {
            await this.#database.closeConnection(connection);
        }
    }


    async getDetailbyDrawingId(drawing_id) {
        const connection = await this.#database.PSMS();

        try {
            return (await this.#database.PSMS()).query('SELECT * FROM fabricationdetail WHERE drawing_id = ?', [drawing_id]);
        } catch (error) {
            console.error('Error getting detail:', error.message);
        } finally {
            await this.#database.closeConnection(connection);
        }
    }


    // PROCESS DATA DETAIL FOR MTO SUMMARY
    async processData(drawing_id) {
        const connection = await this.#database.PSMS();
        const query = `SELECT * FROM fabricationdetail WHERE drawing_id = ?`;


        try {
            const res = await connection.query(query, [drawing_id]);

            if (res[0].length) {
                if (res[0].length > 0) {
                    return true;
                } else {
                    return false;
                }
            }
            return false

        } catch (error) {
            console.error('Error getting detail:', error.message);
        } finally {
            await this.#database.closeConnection(connection);
        }
    }
}

module.exports = {
    FabList
}

// const test = new FabList();

// test.processData(66).then((res) => {
//     console.log(res)
// })

