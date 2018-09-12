var express = require('express');
var router = express.Router();

//	기본정보
const basic = require( './basic' ) ;
router.use( '/basic' , basic ) ;

//	공연 신청 현황 리스트
const reservationList = require( './reservationList' ) ;
router.use( '/reservationList' , reservationList ) ;

//	팔로잉 리스트
const followingReservationList = require( './followingReservationList' ) ;
router.use( '/followingReservationList' , followingReservationList ) ;


module.exports = router;