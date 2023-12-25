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

        const fabDetails = new FabList() ;
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

        const fabDetails = new FabList() ;
        const result = await fabDetails.getFabByDrawingId(drawing_id) ;
        res.status(200).json(result);

    } catch (error) {

        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
})

router.get('/fab_status/:drawing_id/:status', async (req, res) => {

    const { drawing_id, status } = req.params;

    try {

        const fabDetails = new FabList() ;
        const result = await fabDetails.statusUpdate(drawing_id, status) ;
        res.status(200).json(result);

    } catch (error) {

        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
})

router.get('/statusupdate/:drawing_id/:fab_status/:dwg_status', middleware.isValidated, async (req, res) => {

    const { drawing_id, fab_status, dwg_status } = req.params;
    const user_id = req.query.user_id ;

    const drawinglist = new DrawingList() ;
    const assignment = new Assignment() ;
    const fabDetailst = new FabList() ;

    try {

        await assignment.updateInspected(drawing_id, user_id)

        await drawinglist.statusUpdate(drawing_id, dwg_status) ;
        const result = await fabDetailst.statusUpdate(drawing_id, fab_status) ;
        res.status(200).json(result);

    } catch (error) {

        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
})

router.get('/download/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/', fileName);

    // Mengatur header Content-Disposition
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Mengirimkan file sebagai unduhan
    res.sendFile(filePath);
});

router.get('/assigning', middleware.isValidated, async (req, res) => {
    const assignedBy = req.query.by ;
    const worker = req.query.worker ;
    const typePs = req.query.type ;
    const dueDate = req.query.dueDate ;

    const assignment = new Assignment() ;

    try {
        const process = await assignment.assigning(assignedBy, worker, typePs, dueDate) ;
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
    const worker = req.query.worker ;

    const assignment = new Assignment() ;

    try {
        const result = await assignment.getAssignment(worker) ;
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/jointdata', async (req, res) => {

    const setup = new SetupData() ;

    try {
        const result = await setup.getDataGroup() ;
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/jointdatafiltered', async (req, res) => {

    const setup = new SetupData() ;

    try {
        const result = await setup.getDataGroupFiltered() ;
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/users', async (req, res) => {

    const user = new Users() ;

    try {
        const result = await user.getUsers() ;
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/sum/mto', async (req, res) => {

    const sum = new Mto() ;

    try {
        const result = await sum.getSumOfMto() ;
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/cutting', async (req, res) => {
    const summary_id = req.query.summary_id ;
    const pic = req.query.pic ;
    const qty = req.query.qty ;
    const date = req.query.date ;
    const by = req.query.user_id ;

    const sum = new Mto() ;

    try {
        const result = await sum.insertCutting(summary_id, pic, qty, date, by) ;
        res.status(200).json(result)
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/sum/mto/issued', async (req, res) => {
    const summary_id = req.query.summary_id ;
    const type_ps = req.query.type_ps ;
    const iso_no = req.query.iso_no ;
    const fitter = req.query.fitter ;
    const qty = req.query.qty ;
    const date = req.query.date ;
    const by = req.query.user_id ;

    const sum = new Mto() ;

    try {
        const result = await sum.insertIssued(summary_id, type_ps, iso_no, qty, fitter, date, by) ;
        res.status(200).json(result)
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/getType_psBySumm_id', async (req, res) => {
    const sum_id = req.query.sum_id ;

    const sum = new Mto() ;

    try {
        const result = await sum.getType_psBySumm_id(sum_id) ;
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/getIso_noByPrio_id', async (req, res) => {
    const prio_id = req.query.prio_id ;

    const sum = new Mto() ;

    try {
        const result = await sum.getIso_noByPrio_id(prio_id) ;
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/nestingdetail', async (req, res) => {
    const summ_id = req.query.summ_id ;

    const sum = new Mto() ;

    try {
        const result = await sum.getNestingDetail(summ_id) ;
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

router.get('/sum/mto/jointdetail', async (req, res) => {
    const summ_id = req.query.summ_id ;

    const sum = new Mto() ;

    try {
        const result = await sum.getJointDataBySummId(summ_id) ;
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/iso/:type_ps_id', async (req, res) => {
    const { type_ps_id } = req.params ;

    const iso = new SetupData() ;

    try {
        const result = await iso.isoDetail(type_ps_id) ;
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})

// ISO NO END POINT
router.get('/priority', async (req, res) => {

    const priority = new Priority() ;

    try {
        const result = await priority.priorityGetData() ;
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})


router.get('/priority/detail', async (req, res) => {
    const type_ps = req.query.type_ps ;
    const prio = req.query.priority ;

    const priority = new Priority() ;

    try {
        const result = await priority.priorityDetail(type_ps, prio) ;
        res.status(200).json(result[0])
    } catch (error) {
        console.log(error.message)
    }
})





module.exports = router;
