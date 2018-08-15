var express = require('express');
var router = express.Router();

//	member 관련
const member = require( './member/index' ) ;
router.use( '/member' , member ) ;

//	달력
const calendar = require( './calendar/index' ) ;
router.use( '/calendar' , calendar ) ;

module.exports = router;
