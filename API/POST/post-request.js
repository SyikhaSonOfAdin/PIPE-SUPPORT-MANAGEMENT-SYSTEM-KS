const { DrawingList } = require('../../functions/Tables/drawingList');
const { Excel } = require('../../functions/Excel/excel');
const { FabList } = require('../../functions/Tables/fabList');
const { SetupData } = require('../../functions/Tables/setupData');
const Middleware = require('../../functions/Middleware/Auth');

const path = require('path');
const express = require('express');
const multer = require('multer');
const { Priority } = require('../../functions/Tables/priority');
const { Mto } = require('../../functions/Tables/mto');

var nameFile;

const middleware = new Middleware() ;
const router = express.Router();

const storageExcel = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads/excel'));
  },
  filename: (req, file, cb) => {
    nameFile = Date.now().toString() + '-' + file.originalname;
    cb(null, nameFile);
  },
});
const uploadExcel = multer({ storage: storageExcel });

const storagePDF = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads/drawings'));
  },
  filename: (req, file, cb) => {
    nameFile = Date.now().toString() + '-' + file.originalname;
    cb(null, nameFile);
  },
});
const uploadPDF = multer({ storage: storagePDF });

const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads/images'));
  },
  filename: (req, file, cb) => {
    nameFile = Date.now().toString() + '-' + file.originalname;
    cb(null, nameFile);
  },
});
const uploadImage = multer({ storage: storageImage });


router.post('/drawingfiles', uploadPDF.single('file'), (req, res) => {

  const { sum_jointdata_id, assignment_id, user_id } = req.body;
  const drawingTable = new DrawingList();

  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'File not uploaded',
    });
  }

  res.status(200).json({
    status: 'success',
    code: res.statusCode,    
    assignment_id: assignment_id,
    sum_jointdata_id: sum_jointdata_id    
  });

  drawingTable.sendDrawing(user_id, assignment_id, sum_jointdata_id, req.file.filename)

});

router.post('/fablistfiles', uploadExcel.single('file'), async (req, res) => {

  const { drawing_id } = req.body;

  const fablist = new FabList();
  const excel = new Excel();
  const mto = new Mto();

  try {

    const data = await excel.getData(`${nameFile}`);

    await fablist.sendFabFile(drawing_id, req.file.originalname);
    await fablist.detailProcess(drawing_id, data);
    await mto.insertSumOfMto()

    res.status(200).json({
      status: 'success',
      code: res.statusCode,
      OriginalfileName: req.file.originalname,
      ModifiedFileName: nameFile
    });

  } catch (error) {

    res.status(500).json({
      status: 'error',
      code: res.statusCode,
      message: 'Error uploading file',
      fileName: req.file.originalname
    });

  }
})

router.post('/setupfiles', uploadExcel.single('file'), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'File not uploaded',
    });
  }

  const excel = new Excel();
  const setup = new SetupData();

  try {
    const data = await excel.getData(`${nameFile}`);
    // await setup.setUp(data);
    await setup.forSetUp(data);

  } catch (e) {

    console.log(e.message);

  } finally {

    res.status(200).json({
      status: 'success',
      code: res.statusCode,
      originalFileName: req.file.originalname,
      modifiedFileName: req.file.filename,      
    });
  }
});

router.post('/priorityfiles', uploadExcel.single('file'), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'File not uploaded',
    });
  }

  const excel = new Excel();
  const priority = new Priority();

  try {
    const data = await excel.getData(`${nameFile}`);
    await priority.priorityInsertData(data);
  } catch (e) {
    console.log(e.message);
  } finally {
    res.status(200).json({
      status: 'success',
      code: res.statusCode,
      originalFileName: req.file.originalname,
      modifiedFileName: req.file.filename,      
    });
  }
});

// LOGIN PROTOCOL

router.post('/login', middleware.isAuthenticated, async (req, res) => {
  const { email, password } = req.body ;

  res.status(200).json({
    Authentication: true,
    Email: email,
    Password: password,
    Username: req.username,
    Id: req.id,
    level: req.level,
    Token: req.token
  })

})

module.exports = router;
