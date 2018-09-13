var express = require('express');
var router = express.Router();

//	예약 삭제
const reservation = require( './reservation' ) ;
router.use( '/reservation' , reservation ) ;

module.exports = router;