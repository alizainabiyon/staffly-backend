const multer = require('multer');
const util = require('util');

const storage = multer.memoryStorage();

exports.fileParser = util.promisify(
  multer({ storage: multer.memoryStorage() }).single('file')
);

exports.filesParser = util.promisify(
  multer({ storage }).fields([
    { name: 'primaryImage', maxCount: 1 }, // Handle single file for primaryImage
    { name: 'file', maxCount: 1 }, // Handle single file for primaryImage
    { name: 'files', maxCount: 15 }, // Handle up to 5 files for images
    { name: 'images', maxCount: 15 }, // Handle up to 5 files for images
    { name: 'agreements', maxCount: 15 }, // Handle up to 5 files for agreements
    { name: 'imageUrl', maxCount: 1 },
    { name: 'agreement', maxCount: 15 },
  ])
);
