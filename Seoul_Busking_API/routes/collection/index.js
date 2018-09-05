var express = require('express');
var router = express.Router();

//	달력 오늘부터 14일 날짜 가져오기
const calendarList = require( './calendarList' ) ;
router.use( '/calendarList' , calendarList ) ;

//	자치구에 해당되는 버스킹 존 목록 가져오기
const buskingZoneList = require( './buskingZoneList' ) ;
router.use( '/buskingZoneList' , buskingZoneList ) ;

//	버스킹 존 목록전체 가져오기
const buskingZoneListAll = require( './buskingZoneListAll' ) ;
router.use( '/buskingZoneListAll' , buskingZoneListAll ) ;

//	자치구 목록 가져오기
const boroughList = require( './boroughList' ) ;
router.use( '/boroughList' , boroughList ) ;

//	현재 공연 목록 가져오기
const currentList = require( './currentList' ) ;
router.use( '/currentList' , currentList ) ;

//	랭킹 리스트
const rankingList = require( './rankingList' ) ;
router.use( '/rankingList' , rankingList ) ;

//	팔로잉 확인
const isFollowing = require( './isFollowing' ) ;
router.use( '/isFollowing' , isFollowing ) ;

module.exports = router;