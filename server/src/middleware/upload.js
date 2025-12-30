const multer = require('multer');

// Store file in memory temporarily
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
