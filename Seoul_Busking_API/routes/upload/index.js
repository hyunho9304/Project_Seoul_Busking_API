var express = require('express');
var router = express.Router();

//	버스킹존 업로드
const buskingZone = require( './buskingZone' ) ;
router.use( '/buskingZone' , buskingZone ) ;

module.exports = router;