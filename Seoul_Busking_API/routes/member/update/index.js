var express = require('express');
var router = express.Router();

//	대표 자치구 변경
const borough = require( './borough' ) ;
router.use( '/borough' , borough ) ;

module.exports = router;