var express = require('express');
var router = express.Router();

//	기본정보
const basic = require( './basic' ) ;
router.use( '/basic' , basic ) ;


module.exports = router;