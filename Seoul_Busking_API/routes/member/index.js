var express = require('express');
var router = express.Router();

//	회원가입
const signup = require( './signup' ) ;
router.use( '/signup' , signup ) ;

//	중복검사
const overlap = require( './overlap/index' ) ;
router.use( '/overlap' , overlap ) ;

//	로그인
const signin = require( './signin' ) ;
router.use( '/signin' , signin ) ;

module.exports = router;