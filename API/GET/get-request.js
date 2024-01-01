const { Assignment } = require('../../functions/Tables/assigning');
const { DrawingList } = require('../../functions/Tables/drawingList');
const { SetupData } = require('../../functions/Tables/setupData');
const { Priority } = require('../../functions/Tables/priority');
const Middleware = require('../../functions/Middleware/Auth');
const { FabList } = require('../../functions/Tables/fabList');
const { Users } = require('../../functions/Tables/users');
const { Mto } = require('../../functions/Tables/mto');

const express = require('express');
const path = require('path');
const Fitup = require('../../functions/Tables/fitup');
const Welding = require('../../functions/Tables/welding');
const Painting = require('../../functions/Tables/painting');
const Location = require('../../functions/Tables/location');
const Ho = require('../../functions/Tables/Ho');

const router = express.Router();
const middleware = new Middleware()

router.get('/drawingfiles', async (req, res) => {

    try {

        const drawingTable = new DrawingList();
        const result = await drawingTable.getDrawingAllAndFab();
        res.status(200).json(result);

    } catch (error) {

        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/drawingbyid/:drawing_id', async (req, res) => {
    const { drawing_id } = req.params;
    try {
        const drawingTable = new DrawingList();
        const result = await drawingTable.getDrawing(drawing_id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/fabdetails/:drawing_id', async (req, res) => {

    const { drawing_id } = req.params;

    try {

        const fabDetails = new FabList();
        const result = await fabDetails.getDetailbyDrawingId(drawing_id)
        res.status(200).json(result);

    } catch (error) {

        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
})

router.get('/fab/:drawing_id', async (req, res) => {

    const { drawing_id } = req.params;

    try {

        const fabDetails = new FabList();
        const result = await fabDetails.getFabByDrawingId(drawing_id);
        res.status(200).json(result);

    } catch (error) {

        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
})

router.get('/fab_status/:drawing_id/:status', async (req, res) => {

    const { drawing_id, status } = req.params;

    try {

        const fabDetails = new FabList();
        const result = await fabDetails.statusUpdate(drawing_id, status);
        res.status(200).json(result);

    } catch (error) {

        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
})

router.get('/statusupdate/:drawing_id/:fab_status/:dwg_status', middleware.isValidated, async (req, res) => {

    const { drawing_id, fab_status, dwg_status } = req.params;
    const user_id = req.query.user_id;

    const drawinglist = new DrawingList();
    const assignment = new Assignment();
    const fabDetailst = new FabList();

    try {

        await assignment.updateInspected(drawing_id, user_id)

        await drawinglist.statusUpdate(drawing_id, dwg_status);
        const result = await fabDetailst.statusUpdate(drawing_id, fab_status);
        res.status(200).json(result);

    } catch (error) {

        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
})

router.get('/download/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, '../../../uploads/drawings/', fileName);

    // Mengatur header Content-Disposition
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Mengirimkan file sebagai unduhan
    res.sendFile(filePath, (err) => {
        if (err) {
            // Tangani kesalahan jika file tidak ditemukan
            if (err.code === 'ENOENT') {
                res.status(404).send('File not found.');
            } else {
                // Tangani kesalahan umum
                console.error(err);
                res.status(500).send('Internal Server Error.');
            }
        }
    });
});

router.get('/assigning', middleware.isValidated, async (req, res) => {
    const assignedBy = req.query.by;
    const worker = req.query.worker;
    const typePs = req.query.type;
    const dueDate = req.query.dueDate;

    const assignment = new Assignment();

    try {
        const process = await assignment.assigning(assignedBy, worker, typePs, dueDate);
    } catch (e) {
        console.log(e)
    } finally {
        res.status(200).json({
            Status: 'success',
            typePs: typePs,
        })
    }
})

router.get('/assignment', async (req, res) => {
    const worker = req.query.worker;

    const assignment = new Assignment();

    try {
        const result = await assignment.getAssignment(worker);
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/jointdata', async (req, res) => {

    const setup = new SetupData();

    try {
        const result = await setup.getDataGroup();
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/jointdatafiltered', async (req, res) => {

    const setup = new SetupData();

    try {
        const result = await setup.getDataGroupFiltered();
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/users', async (req, res) => {

    const user = new Users();

    try {
        const result = await user.getUsers();
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/sum/mto', async (req, res) => {

    const sum = new Mto();

    try {
        const result = await sum.getSumOfMto();
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/cutting', async (req, res) => {
    const summary_id = req.query.summary_id;
    const pic = req.query.pic;
    const qty = req.query.qty;
    const date = req.query.date;
    const by = req.query.user_id;

    const sum = new Mto();

    try {
        const result = await sum.insertCutting(summary_id, pic, qty, date, by);
        res.status(200).json(result)
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/sum/mto/issued', async (req, res) => {
    const summary_id = req.query.summary_id;
    const type_ps = req.query.type_ps;
    const iso_no = req.query.iso_no;
    const fitter = req.query.fitter;
    const qty = req.query.qty;
    const date = req.query.date;
    const by = req.query.user_id;

    const sum = new Mto();

    try {
        const result = await sum.insertIssued(summary_id, type_ps, iso_no, qty, fitter, date, by);
        res.status(200).json(result)
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/getType_psBySumm_id', async (req, res) => {
    const sum_id = req.query.sum_id;

    const sum = new Mto();

    try {
        const result = await sum.getType_psBySumm_id(sum_id);
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/getType_psBySearch', async (req, res) => {
    const sum_id = req.query.sum_id;
    const search = req.query.search;

    const sum = new Mto();

    try {
        const result = await sum.getType_psBySearch(sum_id, search);
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/getIso_noByPrio_id', async (req, res) => {
    const prio_id = req.query.prio_id;

    const sum = new Mto();

    try {
        const result = await sum.getIso_noByPrio_id(prio_id);
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/getIso_noByBySearch', async (req, res) => {
    const sum_id = req.query.sum_id;
    const search = req.query.search;

    const sum = new Mto();

    try {
        const result = await sum.getIso_noByBySearch(sum_id, search);
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/get_priority', async (req, res) => {
    const sum_id = req.query.sum_id;
    const iso_no = req.query.iso_no;

    const sum = new Mto();

    try {
        const result = await sum.getPriority(sum_id, iso_no);
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/get_qty', async (req, res) => {
    const sum_id = req.query.sum_id;
    const iso_no = req.query.iso_no;
    const prioritas = req.query.priority;

    const sum = new Mto();

    try {
        const result = await sum.getQty(sum_id, iso_no, prioritas);
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/nestingdetail', async (req, res) => {
    const summ_id = req.query.summ_id;

    const sum = new Mto();

    try {
        const result = await sum.getNestingDetail(summ_id);
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/jointdetail', async (req, res) => {
    const summ_id = req.query.summ_id;

    const sum = new Mto();

    try {
        const result = await sum.getJointDataBySummId(summ_id);
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/iso/:type_ps_id', async (req, res) => {
    const { type_ps_id } = req.params;

    const iso = new SetupData();

    try {
        const result = await iso.isoDetail(type_ps_id);
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

// ISO NO END POINT
router.get('/priority', async (req, res) => {

    const priority = new Priority();

    try {
        const result = await priority.priorityGetData();
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/priority/detail', async (req, res) => {
    const param = req.query.param;
    const type_ps = req.query.type_ps;
    const prio = req.query.priority;

    const priority = new Priority();

    try {
        const result = await priority.priorityDetail(param, type_ps, prio);
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/priority/fitup', async (req, res) => {
    const type_ps = req.query.type_ps;
    const iso_no = req.query.iso_no;
    const priority = req.query.priority;
    const qty = req.query.qty;
    const fitter = req.query.fitter;
    const date = req.query.date;
    const rfa_no = req.query.rfa_no;
    const by_id = req.query.by_id;


    const FITUP = new Fitup()

    try {
        const result = await FITUP.insert(type_ps, iso_no, priority, qty, fitter, rfa_no, date, by_id)
        res.status(200).json({
            status: 'success',
        })
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/priority/welding', async (req, res) => {
    const type_ps = req.query.type_ps;
    const iso_no = req.query.iso_no;
    const priority = req.query.priority;
    const qty = req.query.qty;
    const welder = req.query.welder;
    const date = req.query.date;
    const rfa_no = req.query.rfa_no;
    const by_id = req.query.by_id;


    const WELDING = new Welding()

    try {
        const result = await WELDING.insert(type_ps, iso_no, priority, qty, welder, rfa_no, date, by_id)
        res.status(200).json({
            status: 'success',
        })
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/priority/painting', async (req, res) => {
    const type_ps = req.query.type_ps;
    const iso_no = req.query.iso_no;
    const priority = req.query.priority;
    const qty = req.query.qty;
    const painter = req.query.painter;
    const date = req.query.date;
    const rfa_no = req.query.rfa_no;
    const by_id = req.query.by_id;


    const PAINTING = new Painting()

    try {
        const result = await PAINTING.insert(type_ps, iso_no, priority, qty, painter, rfa_no, date, by_id)
        res.status(200).json({
            status: 'success',
        })
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/priority/location', async (req, res) => {
    const type_ps = req.query.type_ps;
    const iso_no = req.query.iso_no;
    const priority = req.query.priority;
    const qty = req.query.qty;
    const area = req.query.area;
    const date = req.query.date;
    const rfa_no = req.query.rfa_no;
    const by_id = req.query.by_id;


    const LOCATION = new Location()

    try {
        const result = await LOCATION.insert(type_ps, iso_no, priority, qty, area, rfa_no, date, by_id)
        res.status(200).json({
            status: 'success',
        })
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/priority/ho', async (req, res) => {
    const type_ps = req.query.type_ps;
    const iso_no = req.query.iso_no;
    const priority = req.query.priority;
    const qty = req.query.qty;
    const client = req.query.client;
    const date = req.query.date;
    const packing_list_no = req.query.packing_list_no;
    const by_id = req.query.by_id;


    const HO = new Ho()

    try {
        const result = await HO.insert(type_ps, iso_no, priority, qty, client, packing_list_no, date, by_id)
        res.status(200).json({
            status: 'success',
        })
    } catch (error) {
        console.log(error.message)
    }
})





module.exports = router;
