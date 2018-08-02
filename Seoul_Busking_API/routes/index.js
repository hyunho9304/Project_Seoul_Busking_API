var express = require('express');
var router = express.Router();

//	member 관련
const member = require( './member/index' ) ;
router.use( '/member' , member ) ;


module.exports = router;
