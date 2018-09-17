/*
	URL : /member/update/info
	Description : 멤버 프로필 수정
	Content-type : x-www-form-urlencoded
	method : POST - Body
	Body = {
		file : file , 					//	배경사진
		file : file , 					//	프로필사진
		member_ID : String ,			//	멤버 아이디
		member_nickname : String 		//	닉네임
		member_introduction : String 	//	멤버 자기소개
		member_category : String 		//	멤버 카테고리
	}
*/
const express = require('express');
const router = express.Router();
const pool = require( '../../../config/dbPool' ) ;	
const async = require( 'async' ) ;
const moment = require( 'moment' ) ;

const multer = require('multer' );		
const multerS3 = require( 'multer-s3' ) ;	
const aws = require( 'aws-sdk' ) ;	
aws.config.loadFromPath('../config/aws_config.json');
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

router.put( '/' , upload.array( 'file' , 2 ) , function( req , res ) {

	let member_backProfile = req.files[0].location ;
	let member_profile = req.files[1].location ;
	let member_ID = req.body.member_ID ;
	let member_nickname = req.body.member_nickname ;
	let member_introduction = req.body.member_introduction ;
	let member_category = req.body.member_category ;

	let task = [

		function( callback ) {
			pool.getConnection( function( err , connection ) {
				if(err) {
					res.status(500).send( {	
						status : "fail" ,
						msg : "internal server err"
					});
					callback( "getConnection err" ) ;
				} else {
					callback( null , connection ) ;
				}
			});	//	getConnection
		},	//	function

		function( connection , callback ) {

			let updateMemberInfoQuery = 'UPDATE Member SET member_backProfile = ? , member_profile = ? , member_nickname = ? , member_introduction = ? , member_category = ? WHERE member_ID = ?' ;
			let queryArr = [ member_backProfile , member_profile , member_nickname , member_introduction , member_category , member_ID ] ;
			
			connection.query( updateMemberInfoQuery , queryArr , function( err , result ) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						msg : "internal server err"
					}) ;
					callback( "updateMemberInfoQuery err" ) ;
				} else {
					res.status(201).send({
						status : "success" ,
						message : "successful updateMemberInfoQuery"
					});
					connection.release() ;
					callback( null , "successful updateMemberInfoQuery" );
				}
			}) ;	//	connection.query
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