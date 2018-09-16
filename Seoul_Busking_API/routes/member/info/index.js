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

//	팔로잉 리스트
const followingList = require( './followingList' ) ;
router.use( '/followingList' , followingList ) ;

//	팔로워 리스트
const followList = require( './followList' ) ;
router.use( '/followList' , followList ) ;

//	기본정보 memberInfo 최신으로 업데이트된것 가져오기
const re = require( './re' ) ;
router.use( '/re' , re ) ;


module.exports = router;