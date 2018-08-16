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

module.exports = router;