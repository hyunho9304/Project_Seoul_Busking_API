var express = require('express');
var router = express.Router();

//	member 관련
const member = require( './member/index' ) ;
router.use( '/member' , member ) ;

//	달력
const calendar = require( './calendar/index' ) ;
router.use( '/calendar' , calendar ) ;

//	새로추가
const upload = require( './upload/index' ) ;
router.use( '/upload' , upload ) ;

module.exports = router;
