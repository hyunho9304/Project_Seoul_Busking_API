/*
	URL : /upload/buskingZone
	Description : 새로운 버스킹 존 등록
	Content-type : form_data
	method : POST - Body
	Body = {
		sb_id : Int ,				//	구 index
		sbz_type : Int , 			//	존 타입( 0 : 서울예술단 , 1 : 우리 )
		sbz_name : String , 		//	존 이름
		sbz_photo : file 			//	존 사진
		sbz_address : String ,		//	존 주소
		sbz_logitude : Double , 	//	존 경도
		sbz_latitude : Double , 	//	존 위도
	}
*/

const express = require('express');
const router = express.Router();
const pool = require('../../config/dbPool');
const async = require('async');
const moment = require( 'moment' ) ;

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath('../config/aws_config.json');	//	server 에서는 2개
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'hyunho9304',
        acl: 'public-read',
        key: function(req, file, callback) {
            callback(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })
});

router.post('/', upload.single('sbz_photo'), function(req, res) {

	let sb_id = req.body.sb_id ;
	let sbz_type = req.body.sbz_type ;
	let sbz_name = req.body.sbz_name ;
	let sbz_photo = req.file.location ;
	let sbz_address = req.body.sbz_address ;
	let sbz_longitude = req.body.sbz_longitude ;
	let sbz_latitude = req.body.sbz_latitude ;
	

	let uploadtime = moment().format( "YYYYMMDDHHmmss" ) ;

	let task = [

		function( callback ) {

			pool.getConnection(function(err , connection ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					});
					callback( "getConnection err" );
				} else {
					callback( null , connection ) ;
				}
			});
		} ,

		function( connection , callback ) {

			let insertSeoulBuskingZoneQuery = 'INSERT INTO SeoulBuskingZone VALUES( ? , ? , ? , ? , ? , ? , ? , ? , ? )' ;
			let queryArr = [ null , sb_id , sbz_type , sbz_name , sbz_photo , uploadtime , sbz_address , sbz_longitude , sbz_latitude ] ;

			connection.query( insertSeoulBuskingZoneQuery , queryArr , function( err , result ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "insertSeoulBuskingZoneQuery err") ;
				} else {
					res.status(201).send({
						status : "success" , 
						message : "successful SeoulBuskingZone upload"
					}) ;
					connection.release() ;
					callback( null , "successful SeoulBuskingZone upload" ) ;
				}
			}) ;
		}
	] ;

	async.waterfall(task, function(err, result) {
		
		let logtime = moment().format('MMMM Do YYYY, h:mm:ss a');

		if (err)
			console.log(' [ ' + logtime + ' ] ' + err);
		else
			console.log(' [ ' + logtime + ' ] ' + result);
	}); //async.waterfall
}) ;

module.exports = router;






















