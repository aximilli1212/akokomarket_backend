const router = require("express").Router();
const hubtelProcessor = require("./hubtel.processor");

router.post('/hubtel', hubtelProcessor.processTransaction);

module.exports = router;