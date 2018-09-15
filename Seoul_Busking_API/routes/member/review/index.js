var express = require('express');
var router = express.Router();

//	업로드
const upload = require( './upload' ) ;
router.use( '/upload' , upload ) ;

//	리뷰 리스트
const list = require( './list' ) ;
router.use( '/list' , list ) ;


module.exports = router;