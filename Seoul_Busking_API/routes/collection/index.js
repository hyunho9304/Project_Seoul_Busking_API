var express = require('express');
var router = express.Router();

//	달력 오늘부터 14일 날짜 가져오기
const calendarList = require( './calendarList' ) ;
router.use( '/calendarList' , calendarList ) ;

//	버스킹 존 목록 가져오기
const buskingZoneList = require( './buskingZoneList' ) ;
router.use( '/buskingZoneList' , buskingZoneList ) ;

module.exports = router;