var express = require('express');
var router = express.Router();

//	아이디 중복검사
const id = require( './id' ) ;
router.use( '/id' , id ) ;

//	닉네임 중복검사
const nickname = require( './nickname' ) ;
router.use( '/nickname' , nickname ) ;

module.exports = router;