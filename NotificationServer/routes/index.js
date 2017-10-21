var express = require('express');
var router = express.Router();

/**
 *  Accessing this server in this way is not anticipated. Say hi to the inquisitive.
 */
router.get('/', function(req, res, next) {
  res.send('<h1>AstonHack Notification Server</h1>');
});

module.exports = router;
