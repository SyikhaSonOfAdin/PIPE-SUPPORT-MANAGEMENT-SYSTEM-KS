const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

class Excel {

    async getData(fileName) {
        const filePath = path.join(__dirname, '../../../uploads/excel/', fileName);
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames;
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName[0]]);

        // await new Promise((resolve, reject) => {
        //     fs.writeFile(path.join(__dirname, '../../uploads/', 'data.json'), JSON.stringify(data), (err) => {
        //         if (err) {
        //             reject(err);
        //         } else {
        //             resolve('success');
        //         }
        //     });
        // });

        return data;
    }
}

module.exports = {
    Excel
};
