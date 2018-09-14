var express = require('express');
var router = express.Router();

//	기본정보
const basic = require( './basic' ) ;
router.use( '/basic' , basic ) ;

//	공연 신청 현황 리스트
const reservationList = require( './reservationList' ) ;
router.use( '/reservationList' , reservationList ) ;

//	팔로잉 예약 리스트
const followingReservationList = require( './followingReservationList' ) ;
router.use( '/followingReservationList' , followingReservationList ) ;

//	my 팔로잉 리스트
const followingList = require( './followingList' ) ;
router.use( '/followingList' , followingList ) ;


module.exports = router;