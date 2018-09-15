var express = require('express');
var router = express.Router();

//	업로드
const upload = require( './upload' ) ;
router.use( '/upload' , upload ) ;


module.exports = router;