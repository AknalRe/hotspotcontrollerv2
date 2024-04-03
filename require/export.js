const { logg, fs } = require('./main');

const path = require('path');
const XLSX = require('xlsx');

async function ExportXLSX(title, data) {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        const filePath = path.join(__dirname, '..', 'views', 'public', 'exports', `${title}.xlsx`);
        const directoryPath = path.dirname(filePath);
    
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
    
        XLSX.writeFile(workbook, filePath);
        logg(true, `Berhasil melakukan export data menjadi xlsx dengan nama ${title}`);
        return { success: true, title: `Export Akun`, message: `Berhasil melakukan export data menjadi xlsx dengan nama ${title}`, file: `${title}.xlsx`};
    } catch (err) {
        logg(false, `Gagal melakukan export data menjadi xlsx dengan nama ${title}, error: ${err.message}`);
        return { success: true, title: `Export Akun`, message: `Gagal melakukan export data menjadi xlsx dengan nama ${title}, error: ${err.message}`, file: `""`};
    }
}

module.exports = {
    ExportXLSX
}