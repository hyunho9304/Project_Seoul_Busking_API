var express = require('express');
var router = express.Router();

//	예약 가능 확인
const possibility = require( './possibility' ) ;
router.use( '/possibility' , possibility ) ;

//	예약 시도
const attempt = require( './attempt' ) ;
router.use( '/attempt' , attempt ) ;

module.exports = router;