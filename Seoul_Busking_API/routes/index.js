var express = require('express');
var router = express.Router();

//	member 관련
const member = require( './member/index' ) ;
router.use( '/member' , member ) ;

//	새로추가
const upload = require( './upload/index' ) ;
router.use( '/upload' , upload ) ;

//	리스트가져오기
const collection = require( './collection/index' ) ;
router.use( '/collection' , collection ) ;

//	예약
const reservation = require( './reservation/index' ) ;
router.use( '/reservation' , reservation ) ;

module.exports = router;
