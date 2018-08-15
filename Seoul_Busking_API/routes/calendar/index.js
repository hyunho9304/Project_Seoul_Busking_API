var express = require('express');
var router = express.Router();

//	달력 오늘부터 14일 날짜 가져오기
const date = require( './date' ) ;
router.use( '/date' , date ) ;

module.exports = router;