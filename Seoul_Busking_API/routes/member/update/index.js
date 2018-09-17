var express = require('express');
var router = express.Router();

//	대표 자치구 변경
const borough = require( './borough' ) ;
router.use( '/borough' , borough ) ;

//	프로필 수정
const info = require( './info' ) ;
router.use( '/info' , info ) ;

module.exports = router;