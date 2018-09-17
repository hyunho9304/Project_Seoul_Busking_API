/*
	URL : /member/info/basic
	Description : 멤버 기본 프로필 정보 가져오기
	Content-type : x-www-form-urlencoded
	method : POST - Body
	Body = {
		member_nickname : String		//	닉네임
	}
*/

const express = require('express');
const router = express.Router();
const pool = require('../../../config/dbPool');
const async = require('async');
const moment = require( 'moment' ) ;

router.post('/', function(req, res) {

	let member_nickname = req.body.member_nickname ;

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

			let selectMemberInfoBasicQuery = 'SELECT * FROM Member WHERE member_nickname = ?' ;
			
			connection.query( selectMemberInfoBasicQuery , member_nickname , function( err , result ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectMemberInfoBasicQuery err") ;
				} else {
					res.status(201).send({
						status : "success" ,
						data : {

							member_type : result[0].member_type ,
							member_category : result[0].member_category ,
							member_nickname : result[0].member_nickname ,
							member_backProfile : result[0].member_backProfile ,
							member_profile : result[0].member_profile ,
							member_introduction : result[0].member_introduction ,
							member_score : result[0].member_score ,
							member_followCnt : result[0].member_followCnt ,
							member_followingCnt : result[0].member_followingCnt
						} ,
						message : "successful get member info basic"
					}) ;
					connection.release() ;
					callback( null , "successful get member info basic" ) ;
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
});

module.exports = router;





























