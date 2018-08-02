var express = require('express');
var router = express.Router();

//	회원가입
const signup = require( './signup' ) ;
router.use( '/signup' , signup ) ;

// //	로그인
// const signin = require( './signin' ) ;
// router.use( '/signin' , signin ) ;

module.exports = router;