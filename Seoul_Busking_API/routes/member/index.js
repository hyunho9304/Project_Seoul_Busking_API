var express = require('express');
var router = express.Router();

//	회원가입
const signup = require( './signup' ) ;
router.use( '/signup' , signup ) ;

//	중복검사
const overlap = require( './overlap' ) ;
router.use( '/overlap' , overlap ) ;

//	로그인
const signin = require( './signin' ) ;
router.use( '/signin' , signin ) ;

//	자치구 대표index
const representativeBorough = require( './representativeBorough' ) ;
router.use( '/representativeBorough' , representativeBorough ) ;

//	대표 자치구 변경
const update = require( './update/index' ) ;
router.use( '/update' , update ) ;

//	팔로잉
const following = require( './following' ) ;
router.use( '/following' , following ) ;

//	멤버정보
const info = require( './info/index' ) ;
router.use( '/info' , info ) ;

//	삭제
const drop = require( './drop/index' ) ;
router.use( '/drop' , drop ) ;


module.exports = router;