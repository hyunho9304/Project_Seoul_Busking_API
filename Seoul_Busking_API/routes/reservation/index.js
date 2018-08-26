var express = require('express');
var router = express.Router();

//	예약 가능 확인
const possibility = require( './possibility' ) ;
router.use( '/possibility' , possibility ) ;

module.exports = router;